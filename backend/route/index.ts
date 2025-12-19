import type { FastifyInstance } from "fastify";
import DocumentRoute from "./documentRoute";


export default async function IndexRoute(app: FastifyInstance) {
    app.register(DocumentRoute, {
        prefix: "/document"
    })
}