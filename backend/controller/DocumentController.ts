import type { FastifyRequest } from 'fastify/types/request';
import type { FastifyReply } from 'fastify/types/reply';
import type { BaseErr, BaseResponse } from '../types/types';
import type { IcreateJob, IUploadDocuments, Job } from '../route/schema/documentSchema';
import type DocumentService from '../service/DocumentService';

export class DocumentController {
  constructor(private documentService: DocumentService) { }

  async UploadDocuments(request: FastifyRequest<{ Body: IUploadDocuments }>, reply: FastifyReply) {
    try {
      const { count } = request.body
      const links = this.documentService.uploadDocuments(count)
      return reply.status(201).send(links)
    } catch (error) {
      const err = error as BaseErr
      return reply.status(err.code ?? 500).send({
        message: err.message ?? "unknown error",
        data: "",
        success: false
      } as BaseResponse)
    }
  }

  async getDocuments(request: FastifyRequest, reply: FastifyReply) {
    try {
      const files = await this.documentService.getDocuments()
      console.log(files);
      return reply.status(200).send(files)
    } catch (error) {
      const err = error as BaseErr
      reply.status(err.code ?? 500).send({
        message: err.message ?? "unknown error",
        data: "",
        success: false
      } as BaseResponse)
    }
  }

  async getJobs(request: FastifyRequest, reply: FastifyReply) {
    try {
      const files = await this.documentService.getJobs()
      console.log(files);
      return reply.status(200).send(files)
    } catch (error) {
      const err = error as BaseErr
      reply.status(err.code ?? 500).send({
        message: err.message ?? "unknown error",
        data: "",
        success: false
      } as BaseResponse)
    }
  }

  async CreateJob(request: FastifyRequest<{ Body: IcreateJob }>, reply: FastifyReply) {
    try {
      const { links, name } = request.body
      console.log(links);
      await this.documentService.CreateJobs(links, name)
      return reply.status(201).send("")
    } catch (error) {
      const err = error as BaseErr
      return reply.status(err.code ?? 500).send({
        message: err.message ?? "unknown error",
        data: "",
        success: false
      } as BaseResponse)
    }
  }

  async deleteJob(request: FastifyRequest<{
    Querystring: {
      jobID: string
    }
  }>, reply: FastifyReply) {
    try {
      const { jobID } = request.query

      await this.documentService.deleteDocument(jobID)
      return reply.status(200)
    } catch (error) {
      const err = error as BaseErr
      return reply.status(err.code ?? 500).send({
        message: err.message ?? "unknown error",
        data: "",
        success: false
      } as BaseResponse)
    }
  }

  async deleteFile(request: FastifyRequest<{
    Querystring: {
      fileID: string
    }
  }>, reply: FastifyReply) {
    try {
      const { fileID } = request.query
      console.log("-----\n", fileID);
      await this.documentService.deleteFile(fileID)
      return reply.status(200)
    } catch (error) {
      const err = error as BaseErr
      return reply.status(err.code ?? 500).send({
        message: err.message ?? "unknown error",
        data: "",
        success: false
      } as BaseResponse)
    }
  }


}
