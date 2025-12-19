import type { IDocumentRecord, SuccessDocument } from "../models/Documents";
import { type IDocumentRepository } from "./interface/IDocumentRepository"
import { DocumentsModel } from "../models/Documents";
import mongoose from "mongoose";
export default class DocumentsRepository implements IDocumentRepository {

    async create(totalCount: number): Promise<IDocumentRecord> {
        try {

            if (totalCount <= 0) throw new Error("totalCount must be greater than 0");

            const newDocumentsJob = new DocumentsModel({
                totalCount,
            })

            return await newDocumentsJob.save()
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
    async getPagination(page: number, limit: number, order: boolean): Promise<IDocumentRecord[]> {
        try {
            const offest = (page - 1) * limit
            const data = await DocumentsModel.find({}).sort({ createdAt: order ? 1 : -1 }).skip(offest).limit(limit)
            return data
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    async getByID(id: string): Promise<IDocumentRecord> {
        try {
            
            const doc = await DocumentsModel.findById(id)
            if (!doc) throw new Error("ararken hatta oldu")
                        console.log("----\n 4355 ");

            return doc
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    async editDocumentErr(id: string, url: string): Promise<IDocumentRecord> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid document id");
            }
            const data = await DocumentsModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        error: url,
                    },
                },
                {
                    new: true,
                }
            );

            if (!data) {
                throw new Error("Cannot find document with given id");
            }

            return data;
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
    async editDocumentSuccess(id: string, doc: SuccessDocument): Promise<IDocumentRecord> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid document id");
            }
            const data = await DocumentsModel.findByIdAndUpdate(
                id,
                {
                    $push: {
                        success: doc,
                    },
                },
                {
                    new: true,
                }
            );

            console.log("done boys");

            if (!data) {
                throw new Error("Cannot find document with given id");
            }

            return data;

        } catch (error) {
            throw new Error((error as Error).message)
        }
    }
    async editDocuementOutput(id: string, key: string): Promise<IDocumentRecord> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid document id");
            }
            const data = await DocumentsModel.findByIdAndUpdate(
                id,
                {
                    outputKey: key
                },
                {
                    new: true,
                }
            );

            if (!data) {
                throw new Error("Cannot find document with given id");
            }

            return data;
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    async deleteDocumentByID(id: string): Promise<void> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid document id");
            }
            const isDeleted = await DocumentsModel.findByIdAndDelete(id)
            if (!isDeleted) {
                throw new Error("Document not found");
            }
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

}