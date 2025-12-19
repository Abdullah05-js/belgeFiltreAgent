import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import mongoose from 'mongoose';


interface DBoptions {
    url: string
}

mongoose.set('strictQuery', false);


async function mongoosePlugin(fastify: FastifyInstance, options: DBoptions) {
    try {
        const connection = await mongoose.connect(options.url, {
            serverSelectionTimeoutMS: 50000,
            socketTimeoutMS: 45000,
            connectTimeoutMS: 10000
        });

        fastify.decorate('mongoose', connection.connection);
        fastify.log.info('MongoDB bağlantısı başarılı.');

        fastify.addHook('onClose', async () => {
            await mongoose.disconnect();
            fastify.log.info('MongoDB bağlantısı kesildi.');
        });

    } catch (err) {
        fastify.log.error(`MongoDB bağlantı hatası: ${err}`);
        throw new Error('Veritabanı bağlantısı kurulamadı.');
    }
}


const pluginDB = fp(mongoosePlugin, {
    name: 'mongoose-db'
});

export default pluginDB