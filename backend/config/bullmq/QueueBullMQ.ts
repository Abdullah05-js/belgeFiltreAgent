import type { FastifyInstance } from "fastify"
import { Queue, QueueEvents, Worker } from 'bullmq';
import fp from 'fastify-plugin';
import DocumentsRepository from "../../repository/DocumentsRepository";
import mongoose from "mongoose";
import workertest from "./WorkerBullMQ";
import { Categorys } from "../../categorys";
import generateDocx from "../../lib/generateDocx";
import { Packer } from "docx";


interface IOptions {
    connection: {
        host: string
        password: string
        port: number
    }
    name: string
    concurrency: number
}

export interface IJob {
    fileURL: string
    // fileID: string
    // _id: string
}

export const repo = new DocumentsRepository()

async function QueueBullMQ(fastify: FastifyInstance, options: IOptions) {
    try {

        if (!options.connection?.host) {
            throw new Error('Redis host is required');
        }
        if (!options.connection?.password) {
            throw new Error('Redis password is required');
        }
        if (!options.connection?.port) {
            throw new Error('Redis port is required');
        }

        const queue = new Queue<IJob>(options.name, {
            connection: options.connection,

            defaultJobOptions: {
                removeOnComplete: true,
                removeOnFail: true,
                attempts: 3,
                backoff: {
                    type: "fixed",
                    delay: 1000 * 60
                },
            }
        })

        await queue.setGlobalConcurrency(options.concurrency);
        await queue.removeGlobalRateLimit();
        fastify.decorate("BullMQueue", queue)


        const queueEvents = new QueueEvents(options.name, { connection: options.connection });

        queueEvents.on('completed', (data: { jobId: string, returnvalue: any }) => {
            fastify.log.info("job done: " + data.jobId)
        });

        queueEvents.on('failed', (data: { jobId: string, failedReason: string }) => {
            fastify.log.info("job failed: " + data.jobId)
        });


        const workerPath = process.cwd() + '/config/bullmq/WorkerBullMQ.ts'
        const worker = new Worker<IJob>(
            options.name,
            workertest,
            {
                connection: options.connection,
                concurrency: options.concurrency,
                limiter: {
                    max: 1,
                    duration: 1000 * 30
                },
            }
        );

        worker.on('failed', async (job, err) => {
            try {
                if (!job) return

                if (job.attemptsMade >= job.opts.attempts! && mongoose.isValidObjectId(job.name)) {
                    console.log('Final failure, removing job:', job.id)
                    await repo.editDocumentErr(job.name, job.data.fileURL)

                    const jobRecord = await repo.getByID(job.name)
                    await repo.editDocumentStatus(jobRecord._id.toString(), "failed")
                    if (jobRecord.success.length + jobRecord.error.length == jobRecord.totalCount) {
                        const successRecords = jobRecord.success.sort((a, b) => a.categoryName.localeCompare(b.categoryName)).map((doc, index) => {
                            return Categorys[doc.categoryName].docx(doc.data, index + 1)
                        })
                        await repo.editDocumentStatus(jobRecord._id.toString(), "completed")

                        if (successRecords.length > 0) {
                            const doc = generateDocx(successRecords)
                            const buffer = (await Packer.toBuffer(doc)).buffer
                            const key = `output/${Bun.randomUUIDv7()}.docx`
                            await fastify.R2.write(key, buffer)
                            await repo.editDocuementOutput(jobRecord._id.toString(), key)
                        }
                    }

                }
            } catch (error) {
                console.log("-------\n", err.message);
            }
        })

        // await queue.upsertJobScheduler('test', {
        //     every: 1000 * 60 * 30,
        // }, {
        //     name: "test-1",
        //     data: { fileURL: "https://cdn.thodex.live/20240703_3811c_yl%20-%20-9-tez-savunmasi-juri-ortak-raporu_235116001_Saip%20Onurhan%20KADIO%C4%9ELU%20(1).pdf" },
        // });


        // await queue.addBulk([
        //     {
        //         name: "job-1",
        //         data: { fileURL: `https://cdn.thodex.live/test/Tez%20Savunma%20Sinavi%20Juri%20Onerisi%20Talebi%20hk.DR-16.pdf` },
        //     }
        // ])


        fastify.addHook("onClose", async () => {
            await queueEvents.close()
            await queue.close()
            await worker.close();
        })



    } catch (error) {
        fastify.log.error(error);
        throw error;
    }
}


export default fp(QueueBullMQ, {
    name: "BullMQ",
    dependencies: []
})