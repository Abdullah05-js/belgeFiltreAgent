import type { FastifyInstance } from "fastify"
import DocumentsRepository from "../repository/DocumentsRepository"
import DocumentService from "../service/DocumentService"
import { DocumentController } from "../controller/DocumentController"

export default async function DocumentRoute(app: FastifyInstance) {

    const docRepository = new DocumentsRepository()
    const documentSv = new DocumentService(docRepository, app)
    const documentCtr = new DocumentController(documentSv)

    app.post("/createJob", documentCtr.createDocument.bind(documentCtr))
}