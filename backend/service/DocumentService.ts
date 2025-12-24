import { type FastifyInstance } from "fastify";
import { type IDocumentRepository } from "../repository/interface/IDocumentRepository";
import type { IJob } from "../config/bullmq/QueueBullMQ";
import type { IDocumentRecord } from "../models/Documents";
import removeJobsByName from "../lib/removeJobsByName";
import type { File, IUploadDocumentsResponse, Job } from "../route/schema/documentSchema";


export default class DocumentService {


    constructor(private readonly documentRepo: IDocumentRepository, private readonly fastify: FastifyInstance,
    ) { }



    async CreateJobs(documents: string[], name: string): Promise<void> {
        let id: string | undefined;
        try {
            const links = documents.map((a) => this.fastify.R2.presign(a, {
                expiresIn: 3600 * 4,
            }))

            const doc = await this.documentRepo.create(documents.length, name);
            id = doc._id.toString()
            const buildJobs: {
                name: string;
                data: IJob;
            }[] = links.map((a) => {
                return {
                    name: doc._id.toString(),
                    data: {
                        fileURL: a
                    }
                }
            });

            await this.fastify.BullMQueue.addBulk(buildJobs);
            await this.documentRepo.editDocumentStatus(id, "running")

        } catch (error) {
            if (id) {
                console.log("----\n deleting boys");
                await this.documentRepo.deleteDocumentByID(id);
            }
            throw error;
        }
    }

    async getOneDocument(id: string): Promise<IDocumentRecord> {
        try {
            const doc = await this.documentRepo.getByID(id)
            return doc
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }


    async getPagination(page: number, limit: number, order: boolean): Promise<IDocumentRecord[]> {
        try {
            const docs = await this.documentRepo.getPagination(page, limit, order)
            return docs
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }


    async deleteDocument(id: string) {
        try {
            await this.documentRepo.deleteDocumentByID(id)
            await removeJobsByName(this.fastify.BullMQueue, id)

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    async deleteFile(id: string) {
        try {
            await this.fastify.R2.delete(id)
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }



    uploadDocuments(count: number): IUploadDocumentsResponse {
        try {

            const links = (new Array(count)).fill(0).map(() => {
                const key = `files/${Bun.randomUUIDv7()}.pdf`
                return this.fastify.R2.presign(key, {
                    method: "PUT",
                    expiresIn: 60 * 60,
                    type: "application/pdf"
                })
            })

            return { links }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    async getDocuments(): Promise<File[]> {
        try {

            const files = await this.fastify.R2.list({
                prefix: 'files/',
                maxKeys: 500,
            })

            return files.contents?.map((file) => {
                return {
                    id: file.key,
                    name: file.key,
                    size: file.size,
                    uploadedAt: file.lastModified,
                } as File
            }) ?? []

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    async getJobs(): Promise<Job[]> {
        try {

            const jobs = await this.documentRepo.getJobs()

            return jobs?.map((job) => {

                return {
                    id: job._id.toString(),
                    name: job.name,
                    status: job.status,
                    createdAt: job.createdAt?.toDateString(),
                    processedFiles: job.success.length,
                    failedFiles: job.error,
                    totalFiles: job.totalCount,
                    outputFile: job.outputKey === "" ? job.outputKey : this.fastify.R2.presign(job.outputKey, {
                        expiresIn: 3600 * 6,
                    }),
                } as Job
            }) ?? []

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

} 