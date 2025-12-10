import 'fastify';
import type { Connection } from 'mongoose';
import { IUserDocument } from '../src/models/User';
import type { S3Client, RedisClient } from 'bun';

declare module 'fastify' {

    interface FastifyInstance {
        R2: S3Client;
        BullMQueue: Queue<IJob, any, string, IJob, any, string>
    }
}