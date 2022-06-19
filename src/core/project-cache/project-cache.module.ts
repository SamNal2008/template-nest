import { CacheModule, Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      imports: [ConfigModule],
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        store: redisStore,
        ttl: configService.get('storage.cache.ttl'),
        socket: {
          host: configService.get('storage.cache.host'),
          port: configService.get('storage.cache.port'),
        },
      }),
    }),
  ],
})
export class ProjectCacheModule {}
