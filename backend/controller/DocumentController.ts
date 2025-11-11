import { DocumentService } from '../service/DocumentService';

export class DocumentController {
  constructor(private documentService: DocumentService) {}

  async getDocuments(request: any, reply: any) {
    try {
      
    } catch (error) {
      
    }
  }

  async createDocument(request: any, reply: any) {
    const doc = await this.documentService.createDocument(request.body);
    reply.code(201).send(doc);
  }
}
