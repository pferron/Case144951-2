import Redis from 'ioredis';
import { RedisConfig } from '@server/RedisConfig';
import { InMemoryLRUCache } from 'apollo-server-caching';
import { RedisCache } from '@server/cache/RedisCache';

export const initialiseServerCache = (remote = false): InMemoryLRUCache | RedisCache => {
  if (!remote && process.env.NODE_ENV === 'development') {
    return new InMemoryLRUCache({ maxSize: 500 });
  }
  const redisClient = new Redis(RedisConfig.init(true));
  return new RedisCache(redisClient);
};
