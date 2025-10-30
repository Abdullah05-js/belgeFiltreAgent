import { z } from 'zod';

export const createDocumentSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1)
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
