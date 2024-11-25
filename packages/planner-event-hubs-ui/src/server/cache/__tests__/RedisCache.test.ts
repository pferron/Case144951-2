import Redis from 'ioredis-mock';
import { RedisCache } from '@server/cache/RedisCache';

jest.mock('ioredis');

describe('RedisCache', () => {
  let redisCache: RedisCache;
  let redis: Redis;

  beforeEach(() => {
    redis = new Redis();
    redisCache = new RedisCache(redis);
  });

  it('stores the token"', async () => {
    const key = 'test key';
    const token = 'test token';
    await redisCache.set(key, token, { ttl: 100 });
    const tokenResponse = await redis.get(key);
    expect(tokenResponse).toEqual(token);
  });
});
