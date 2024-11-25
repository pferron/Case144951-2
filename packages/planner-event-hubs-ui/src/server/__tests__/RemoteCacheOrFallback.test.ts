import { RedisConfig } from '@server/RedisConfig';
import { RemoteCacheOrFallback } from '@server/RemoteCacheOrFallback';
import { BaseRedisCache } from 'apollo-server-cache-redis';
import { InMemoryLRUCache } from 'apollo-server-caching';

describe('RemoteCacheOrFallback', () => {
  let remoteCacheOrFallback: RemoteCacheOrFallback;

  beforeEach(() => {
    process.env.USE_REMOTE_CACHE = 'true';
    remoteCacheOrFallback = new RemoteCacheOrFallback();
  });

  afterEach(() => {
    remoteCacheOrFallback.redisClient.disconnect();
    process.env.USE_REMOTE_CACHE = 'false';
  });

  describe('constructor()', () => {
    it('inits redisClient', () => {
      expect(remoteCacheOrFallback.redisClient).toBeTruthy();
    });

    it('inits redisClient, attempting to connect immediately', () => {
      expect(remoteCacheOrFallback.redisClient.status).toEqual('connecting');
    });
  });

  describe('useRemoteCache()', () => {
    it('returns true by default when process.env.USE_REMOTE_CACHE is empty', () => {
      delete process.env.USE_REMOTE_CACHE;
      expect(remoteCacheOrFallback.useRemoteCache()).toBeTruthy();
    });

    it('returns true when process.env.USE_REMOTE_CACHE is "true"', () => {
      process.env.USE_REMOTE_CACHE = 'true';
      expect(remoteCacheOrFallback.useRemoteCache()).toBeTruthy();
    });

    it('returns false when process.env.USE_REMOTE_CACHE is not "true"', () => {
      process.env.USE_REMOTE_CACHE = 't';
      expect(remoteCacheOrFallback.useRemoteCache()).toBeFalsy();
    });
  });

  describe('getCache()', () => {
    it('returns a new InMemoryLRUCache instance when USE_REMOTE_CACHE is false', () => {
      process.env.USE_REMOTE_CACHE = 'false';
      expect(remoteCacheOrFallback.getCache()).toBeInstanceOf(InMemoryLRUCache);
    });

    it('returns a new BaseRedisCache when USE_REMOTE_CACHE is true', () => {
      process.env.USE_REMOTE_CACHE = 'true';
      expect(remoteCacheOrFallback.getCache()).toBeInstanceOf(BaseRedisCache);
    });

    it('returns a new BaseRedisCache when USE_REMOTE_CACHE is empty', () => {
      process.env.USE_REMOTE_CACHE = '';
      expect(remoteCacheOrFallback.getCache()).toBeInstanceOf(BaseRedisCache);
    });
  });

  describe('initRedis()', () => {
    it('does not instantiate Redis when RedisConfig.init() returns falsey', () => {
      RedisConfig.init = jest.fn().mockImplementation(jest.fn());
      const cache = new RemoteCacheOrFallback();
      expect(cache.redisClient).toBeUndefined();
      expect(process.env.USE_REMOTE_CACHE).toEqual('false');
    });
  });
});
