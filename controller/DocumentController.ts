import { DocumentService } from '../service/DocumentService';

export class DocumentController {
  constructor(private documentService: DocumentService) {}

  async getDocuments(request: any, reply: any) {
    const docs = await this.documentService.getDocuments();
    reply.send(docs);
  }

  async createDocument(request: any, reply: any) {
    const doc = await this.documentService.createDocument(request.body);
    reply.code(201).send(doc);
  }
}
