import Fastify from 'fastify';
import { documentRoute } from './route/documentRoute';
import multipart from "@fastify/multipart";
import cors from "@fastify/cors"
import fastifyCookie from "@fastify/cookie";
import pluginS3 from "./config/objectStorage";


const fastify = Fastify({
    logger: true,
});

fastify.register(cors, {
    origin: "http://localhost:3000", // frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
})
fastify.register(fastifyCookie, {
    hook: "onRequest"
})

fastify.register(pluginS3, {
    accessKeyId: process.env.BUCKET_ACCESS_KEY || "",
    secretAccessKey: process.env.BUCKET_SECRET_KEY || "",
    bucket: process.env.BUCKET_NAME || "",
    endpoint: process.env.BUCKET_URL || ""
})
fastify.register(multipart)
fastify.register(documentRoute);


fastify.get("/getURL", async (req, res) => {
    const data = fastify.R2.presign("122.docx", {
        expiresIn: 3600,
    })
    res.send(data)
})


fastify.listen({ port: 5000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
