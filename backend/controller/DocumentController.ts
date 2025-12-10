import { DocumentService } from '../service/DocumentService';
import type { FastifyRequest } from 'fastify/types/request';
import type { FastifyReply } from 'fastify/types/reply';
import type { BaseErr, BaseResponse } from '../types/types';
import type { getDocumentSchema } from '../route/schema/documentSchema';
import { Packer } from 'docx';
import type { FilteredDocumentResult } from '../flow/FilterDocumentFlow';
import { combineDocuments } from '../flow/category';
export class DocumentController {
  constructor(private documentService: DocumentService) { }

  async getDocuments(request: FastifyRequest<{ Body: getDocumentSchema }>, reply: FastifyReply) {
    try {
      console.log("am here");
      const documentURLs = request.body.documentURLs
      console.log("----------", documentURLs);
      const results = await Promise.all(
        documentURLs.map(
          (documenturl) =>
            new Promise<FilteredDocumentResult>((resolve, reject) => {
              const worker = new Worker("./worker.ts");

              worker.postMessage({ fileURL: documenturl });

              worker.onmessage = (event: MessageEvent<FilteredDocumentResult>) => {
                resolve(event.data.data);
                worker.terminate();
              };

              worker.onerror = (err) => {
                reject(err);
                worker.terminate();
              };
            })
        )
      );
      console.log("-----------", results);
      const doc = combineDocuments(results)
      const buffer = await Packer.toBuffer(doc);
      reply
        .header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
        .header('Content-Disposition', 'attachment; filename="document.docx"')
        .send(buffer);

    } catch (error) {
      const err = error as BaseErr
      reply.status(err.code ?? 500).send({
        message: err.message ?? "unknown error",
        data: "",
        success: false
      } as BaseResponse)
    }
  }

  async createDocument(request: any, reply: any) {
    const doc = await this.documentService.createDocument(request.body);
    reply.code(201).send(doc);
  }
}
