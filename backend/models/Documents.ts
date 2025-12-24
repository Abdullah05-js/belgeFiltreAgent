import mongoose, { Schema } from 'mongoose';
import type { IWithTimestamps } from '../types/types';
import type { CategoryName } from '../categorys';
import type { JobStatus } from '../route/schema/documentSchema';



export interface SuccessDocument {
    categoryName: CategoryName;
    data: any;
}

export interface IDocumentRecord extends IWithTimestamps {
    _id: mongoose.Types.ObjectId;
    name: string
    status: JobStatus
    totalCount: number
    success: {
        categoryName: CategoryName;
        data: any;
    }[]
    error: string[]
    outputKey: string
}

export const DocumentsSchema = new Schema<IDocumentRecord>(
    {
        status: {
            type: String,
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        outputKey: {
            type: String,
            required: false,
            default: ""
        },

        totalCount: {
            type: Number,
            required: true,
        },

        error: {
            type: [String],
            default: [],
        },

        success: {
            type: [
                {
                    categoryName: {
                        type: String,
                        required: true,
                    },
                    data: {
                        type: Schema.Types.Mixed,
                        required: true,
                    },
                },
            ],
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

export const DocumentsModel = mongoose.model(
    "Documents",
    DocumentsSchema
);

