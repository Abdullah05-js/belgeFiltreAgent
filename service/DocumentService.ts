// DocumentService provides business logic for Document entity
import type { IDocumentRepository } from '../repository/interface/IDocumentRepository';
import type { Document } from '../repository/Document';

export class DocumentService {
  constructor(private documentRepository: IDocumentRepository) {}

  async getDocuments() {
    return await this.documentRepository.findAll();
  }

  async createDocument(data: Partial<Document>) {
    return await this.documentRepository.create(data);
  }
  // ... further business logic
}
