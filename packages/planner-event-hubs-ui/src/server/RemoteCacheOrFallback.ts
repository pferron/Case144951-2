import Redis from 'ioredis';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { isEmpty } from 'lodash';
import { RedisConfig } from '@server/RedisConfig';

export const LOG = LoggerFactory.create('remote-cache-or-fallback');
export class RemoteCacheOrFallback {
  redisClient: Redis;

  cache: BaseRedisCache | InMemoryLRUCache;

  constructor() {
    this.initRedis();
  }

  private initRedis(): void {
    if (!this.useRemoteCache()) {
      return;
    }
    const redisInit = RedisConfig.init();
    if (redisInit) {
      this.redisClient = new Redis(redisInit);
    } else {
      process.env.USE_REMOTE_CACHE = 'false';
    }
  }

  /**
   * This method determines whether the remote cache will be initialized or not. When true is returned then the remote cache will be initialized.
   * Returns true when USE_REMOTE_CACHE is empty or set to 'true'. Returns false otherwise.
   * @returns boolean
   */
  public useRemoteCache(): boolean {
    LOG.debug('useRemoteCache() USE_REMOTE_CACHE is', process.env.USE_REMOTE_CACHE);
    return isEmpty(process.env.USE_REMOTE_CACHE) || process.env.USE_REMOTE_CACHE === 'true';
  }

  /**
   * Returns InMemoryLRUCache when useRemoteCache() returns false, BaseRedisCache otherwise.
   * @returns KeyValueCache compatible cache store
   */
  public getCache(): InMemoryLRUCache | BaseRedisCache {
    if (this.useRemoteCache()) {
      LOG.info('Using BaseRedisCache because useRemoteCache() is true');
      return new BaseRedisCache({ client: this.redisClient });
    }
    LOG.info('Using InMemoryLRUCache because useRemoteCache() is false');
    return new InMemoryLRUCache({ maxSize: 500 });
  }
}
