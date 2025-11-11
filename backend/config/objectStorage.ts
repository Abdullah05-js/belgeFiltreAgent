import { S3Client } from 'bun';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

interface OSoptions {
    accessKeyId: string
    secretAccessKey: string
    bucket: string
    endpoint: string
}


async function ObjectStoragePlugin(fastify: FastifyInstance, options: OSoptions) {
    try {
        const R2Client = new S3Client(options)
        fastify.decorate('R2', R2Client);
        fastify.log.info('S3 bağlantısı başarılı.')

    } catch (error) {
        fastify.log.error(`S3 bağlantı hatası: ${error}`);
        throw new Error('S3 bağlantısı kurulamadı.');
    }
}

const pluginS3 = fp(ObjectStoragePlugin, {
    name: "S3-OS",
})

export default pluginS3