/* eslint-disable @typescript-eslint/no-unsafe-return */
// filepath: /home/dio/programacao/maos_a_obra_app/api/src/cache/cache.module.ts
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Module, Global } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as dotenv from 'dotenv';

dotenv.config();

@Global()
@Module({
  providers: [
    {
      provide: CACHE_MANAGER,
      useFactory: () => {
        const secondary = createKeyv(
          process.env.REDIS_URL ?? 'redis://localhost:6379',
        );
        return new Cacheable({ secondary, ttl: 1000 * 60 * 60 * 24 });
      },
    },
    {
      provide: 'CACHE_INSTANCE',
      useFactory: () => {
        const secondary = createKeyv(
          process.env.REDIS_URL ?? 'redis://localhost:6379',
        );
        return new Cacheable({ secondary, ttl: 1000 * 60 * 60 * 24 });
      },
    },
  ],
  exports: [CACHE_MANAGER, 'CACHE_INSTANCE'],
})
export class CacheModule {}
