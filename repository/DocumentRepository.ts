import { IDocumentRepository } from './interface/IDocumentRepository';
import { Document } from './Document';

export class DocumentRepository implements IDocumentRepository {
  private documents: Document[] = [];

  async findAll(): Promise<Document[]> {
    return this.documents;
  }

  async create(data: Partial<Document>): Promise<Document> {
    const doc = new Document(Date.now().toString(), data.title ?? '', data.content ?? '');
    this.documents.push(doc);
    return doc;
  }
  // ... boilerplate for more data-access methods
}
