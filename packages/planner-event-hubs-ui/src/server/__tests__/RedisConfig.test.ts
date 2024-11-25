import { RedisConfig } from '@server/RedisConfig';
import * as process from 'process';

describe('RedisConfig', () => {
  beforeEach(() => {
    process.env.DEV_MODE = 'true';
    [process.env.ELASTICACHE_PRIMARY_ENDPOINT, process.env.ELASTICACHE_PORT, process.env.ELASTICACHE_PASSWORD] = [
      'primary',
      '6380',
      'password',
      'https://reader.com'
    ];
  });
  describe('RedisConfig.init()', () => {
    it('returns RedisOptions', async () => {
      expect(RedisConfig.init()).toEqual({
        host: '127.0.0.1',
        noDelay: false,
        port: 6379,
        connectTimeout: 10000,
        commandTimeout: 1000
      });
    });
  });

  describe('RedisConfig.init(true)', () => {
    it('returns RedisOptions', async () => {
      expect(RedisConfig.init(true)).toEqual({
        host: '127.0.0.1',
        noDelay: true,
        port: 6379,
        connectTimeout: 10000,
        commandTimeout: 1000
      });
    });

    it('returns RedisOptions for development environment', async () => {
      expect(RedisConfig.init()).toEqual({
        host: '127.0.0.1',
        noDelay: false,
        port: 6379,
        connectTimeout: 10000,
        commandTimeout: 1000
      });
    });

    it('returns RedisOptions for production environment', async () => {
      process.env.DEV_MODE = '';
      process.env.NX_MODE = 'build';
      delete process.env.NX_MODE;
      expect(RedisConfig.init()).toEqual({
        host: 'primary',
        noDelay: false,
        port: 6380,
        username: 'redis-app-user',
        password: 'password',
        connectTimeout: 10000,
        commandTimeout: 1000,
        tls: {}
      });
    });
  });
});
