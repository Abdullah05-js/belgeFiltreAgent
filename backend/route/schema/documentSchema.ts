import { z } from 'zod';


export interface getDocumentSchema {
  documentURLs: string[]
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
