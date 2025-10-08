import { Global, Module } from '@nestjs/common';
import {
  CacheModule as NestCacheModule,
  CacheModuleOptions,
} from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Global()
@Module({
  imports: [
    NestCacheModule.registerAsync({
      useFactory: async (): Promise<CacheModuleOptions> => {
        const host = process.env.REDIS_HOST || 'redis_db';
        const port = parseInt(process.env.REDIS_PORT || '6379', 10);
        const password = process.env.REDIS_PASSWORD || undefined;

        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
          const store = await redisStore({
            socket: {
              host,
              port,
            },
            password,
            ttl: 0,
          });
          return {
            store,
            ttl: 0,
          };
        } catch (err) {
          console.warn('[CACHE] Fallback memória. Erro Redis:', err);
          return {
            ttl: 0,
            max: 0,
          };
        }
      },
    }),
  ],
  exports: [NestCacheModule],
})
export class CacheModule {}
