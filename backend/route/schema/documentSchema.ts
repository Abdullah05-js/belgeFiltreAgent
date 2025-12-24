import { z } from 'zod';

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

export interface IcreateJob {
  links: string[],
  name: string,
}

export interface File {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export interface IUploadDocuments {
  count: number
}


export interface IUploadDocumentsResponse {
  links: string[],
}

export const createDocumentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1)
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
