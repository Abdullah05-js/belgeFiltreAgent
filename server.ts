import Fastify from 'fastify';
import { documentRoute } from './route/documentRoute';
import multipart from "@fastify/multipart";
import cors from "@fastify/cors"
import fastifyCookie from "@fastify/cookie";


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

fastify.register(multipart)
fastify.register(documentRoute);





fastify.listen({ port: 5000 }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Server listening at ${address}`);
});
