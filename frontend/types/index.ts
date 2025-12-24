
export interface File {
    id: string;
    name: string;
    size: number;
    uploadedAt: string;
}

export interface IFileUpload {
    count: number
}

export interface IFileUploadResponse {
    links: string[],
}

export interface UploadProgress {
    [key: string]: number;
};

export type JobStatus = "running" | "completed" | "failed" | "pending";

export interface Job {
    id: string;
    name: string;
    status: JobStatus;
    createdAt: string;
    processedFiles: number;
    failedFiles: string[];
    totalFiles: number;
    outputFile?: string;
}