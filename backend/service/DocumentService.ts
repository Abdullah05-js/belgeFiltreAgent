import type { FastifyInstance } from "fastify";
import { type IDocumentRepository } from "../repository/interface/IDocumentRepository";
import type { IJob } from "../config/bullmq/QueueBullMQ";
import type { IDocumentRecord } from "../models/Documents";


export default class DocumentService {


    constructor(private readonly documentRepo: IDocumentRepository, private readonly fastify: FastifyInstance,
    ) { }

    async createDocument(documents: string[]): Promise<void> {
        let id: string | undefined;
        try {
            const doc = await this.documentRepo.create(documents.length);
            id = doc._id.toString()
            const buildJobs: {
                name: string;
                data: IJob;
            }[] = documents.map((a) => {
                return {
                    name: doc._id.toString(),
                    data: {
                        fileURL: a
                    }
                }
            });

            // Add to queue
            await this.fastify.BullMQueue.addBulk(buildJobs);

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
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }



} 