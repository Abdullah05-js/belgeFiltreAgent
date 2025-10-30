import type { FastifyInstance } from 'fastify';
import { DocumentController } from '../controller/DocumentController';
import { DocumentService } from '../service/DocumentService';
import { DocumentRepository } from '../repository/DocumentRepository';

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

export async function documentRoute(fastify: FastifyInstance) {
  fastify.get('/documents', (req, reply) => documentController.getDocuments(req, reply));

  fastify.post('/documents', {
    handler: (req, reply) => documentController.createDocument(req, reply)
  });
}
