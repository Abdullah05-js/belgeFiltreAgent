import { Document } from '../Document';

export interface IDocumentRepository {
  findAll(): Promise<Document[]>;
  create(data: Partial<Document>): Promise<Document>;
  // ... further data-access signatures
}
