import type { FastifyInstance } from 'fastify';
import { DocumentController } from '../controller/DocumentController';
import { DocumentService } from '../service/DocumentService';
import { DocumentRepository } from '../repository/DocumentsRepository';
import type { FastifyRequest } from 'fastify/types/request';
import type { getDocumentSchema } from './schema/documentSchema';

const documentRepository = new DocumentRepository();
const documentService = new DocumentService(documentRepository);
const documentController = new DocumentController(documentService);

export async function documentRoute(fastify: FastifyInstance) {
  fastify.post('/documents', (req: FastifyRequest<{ Body: getDocumentSchema }>, reply) => documentController.getDocuments(req, reply));

 
}
