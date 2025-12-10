import type { FastifyInstance } from "fastify"
import { Queue, QueueEvents, Worker } from 'bullmq';
import fp from 'fastify-plugin';


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
}

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
                attempts: 3,
                backoff: {
                    type: "fixed",
                    delay: 2000
                },

            }
        })

        await queue.setGlobalConcurrency(4);
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
            workerPath,
            {
                connection: options.connection,
                concurrency: options.concurrency,
            }
        );


        await queue.upsertJobScheduler('test', {
            every: 1000 * 10,
        }, {
            name: "test-1",
            data: { fileURL: "pdjfvodsıfjosdıj.com" },
        });




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