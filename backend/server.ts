import Fastify from 'fastify';
import multipart from "@fastify/multipart";
import cors from "@fastify/cors"
import fastifyCookie from "@fastify/cookie";
import pluginS3 from "./config/objectStorage";
import QueueBullMQ, { repo } from './config/bullmq/QueueBullMQ';
import IndexRoute from './route';
import pluginDB from './config/database';
import { Categorys } from './categorys';
import { Packer } from 'docx';
import generateDocx from './lib/generateDocx';

export const fastify = Fastify({
    logger: true,
    trustProxy: true,
});

await fastify.register(cors, {
    origin: "http://localhost:3000", // your frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});

fastify.register(fastifyCookie, {
    hook: "onRequest"
})

fastify.register(pluginDB, { url: process.env.MONGO_URL || "" });


fastify.register(pluginS3, {
    accessKeyId: process.env.BUCKET_ACCESS_KEY || "",
    secretAccessKey: process.env.BUCKET_SECRET_KEY || "",
    bucket: process.env.BUCKET_NAME || "",
    endpoint: process.env.BUCKET_URL || ""
})
fastify.register(multipart)


fastify.register(QueueBullMQ, {
    connection: {
        host: Bun.env.REDIS_HOST!,
        password: Bun.env.REDIS_PASSWORD!,
        port: Number(Bun.env.REDIS_PORT!)
    },
    name: "file",
    concurrency: 1,
})


fastify.register(IndexRoute, { prefix: "/api/v1" })


fastify.get("/test", async (req, res) => {

    const link = fastify.R2.presign("Java_Lab_Egzersiz.pdf", {
        expiresIn: 3600,
    })

    res.status(200).send(link)
})

fastify.listen({ port: 5000, host: "0.0.0.0" }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
