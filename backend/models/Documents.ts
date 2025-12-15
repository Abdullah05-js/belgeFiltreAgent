import z from 'zod';
import { doktoraSavunmaOutput, yuksekLisansKonuBildirimiOutput, yuksekLisansSavunmaOutput, type CategoryName } from '../flow/category';
import mongoose, { Schema } from 'mongoose';
import type { IWithTimestamps } from '../types/types';



export interface IDocumentRecord extends IWithTimestamps {
    _id: mongoose.Types.ObjectId;
    docType: string;
    categoryName: CategoryName;
    data: IDocuments;
}

const DocumentsSchema = new Schema<IDocumentRecord>(
    {
        docType: {
            type: String,
            required: true,
            index: true,
        },

        categoryName: {
            type: String,
            required: true,
            index: true,
        },

        // ZOD PAYLOAD
        data: {
            type: Schema.Types.Mixed,
            required: true,
        },
    },
    {
        timestamps: true,
        strict: true, // ✅ now safe to turn ON
    }
);

export const DocumentsModel = mongoose.model(
    "Documents",
    DocumentsSchema
);

export type IDocuments =
    | z.infer<typeof yuksekLisansSavunmaOutput>
    | z.infer<typeof doktoraSavunmaOutput>
    | z.infer<typeof yuksekLisansKonuBildirimiOutput>;