import { Module, Global, Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

const redisProvider: Provider = {
    provide: REDIS_CLIENT,
    useFactory: () => {
        const client = new Redis({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: Number(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            retryStrategy: (times) => {
                if (times > 3) {
                    console.error('❌ Redis server not found. Have you started?');
                    return null;
                }
                return Math.min(times * 50, 2000);
            }

        });

        // Handle initial connection logging cleanly
        client.on('connect', () => {
            console.log('⚡ [LogiSync-X] Redis Engine integrated cleanly inside Infrastructure Matrix.');
        });

        client.on('error', (err) => {
            console.error('❌ [LogiSync-X] Redis Connection Error:', err);
        });

        return client;
    },
};

@Global()
@Module({
    providers: [redisProvider],
    exports: [REDIS_CLIENT],
})
export class RedisModule { }
