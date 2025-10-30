import type { FastifyInstance } from 'fastify';
import { DocumentController } from '../controller/DocumentController';
import { DocumentService } from '../service/DocumentService';
import { DocumentRepository } from '../repository/DocumentRepository';
import { createDocumentSchema } from './schema/documentSchema';

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

export async function documentRoute(fastify: FastifyInstance) {
  fastify.get('/documents', (req, reply) => documentController.getDocuments(req, reply));

  fastify.post('/documents', {
    schema: {
      body: createDocumentSchema,
    },
    handler: (req, reply) => documentController.createDocument(req, reply)
  });
}
