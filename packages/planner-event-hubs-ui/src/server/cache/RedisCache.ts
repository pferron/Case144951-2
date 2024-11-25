import Redis from 'ioredis';
import { RedisConfig } from '@server/RedisConfig';

export class RedisCache {
  static redisClient: Redis;

  client: Redis;

  constructor(client?: Redis) {
    this.client = client;
    this.initRedis();
  }

  public static async initRedis(): Promise<Redis> {
    if (!RedisCache.redisClient) {
      RedisCache.redisClient = new Redis(RedisConfig.init());
    }
    return RedisCache.redisClient;
  }

  public async initRedis(): Promise<Redis> {
    if (!this.client) {
      this.client = await RedisCache.initRedis();
    }
    return this.client;
  }

  public async set(key: string, value: string, options?: { ttl?: number }): Promise<'OK'> {
    await this.initRedis();
    if (options?.ttl) {
      return this.client.setex(key, options.ttl, value);
    }
    return this.client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    await this.initRedis();
    return this.client.get(key);
  }

  public async delete(key: string): Promise<number> {
    await this.initRedis();
    return this.client.del(key);
  }
}
