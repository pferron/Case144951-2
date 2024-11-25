/**
 * @jest-environment node
 */
import endpoint from '@pages/api/redis';
import type { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';
import { AuthClient } from '@cvent/auth-client';
import { RedisCache } from '@server/cache/RedisCache';
import Redis from 'ioredis';

const pagesHandler: typeof endpoint & { config?: PageConfig } = endpoint;

jest.mock('@cvent/auth-client');
jest.mock('ioredis');

describe('/api/redis', () => {
  it('request should fail without valid auth', async () => {
    jest.spyOn(AuthClient.prototype, 'verifyApiKey').mockImplementation(() => {
      throw new Error('Unauthenticated');
    });
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET', headers: { authorization: 'api_key 1234' } });
        expect(res.status).toEqual(401);
      },
      params: { key: 'keyName' }
    });
  });

  it('request should fail without any of the optional parameters', async () => {
    jest.spyOn(AuthClient.prototype, 'verifyApiKey').mockImplementation(jest.fn());
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET', headers: { authorization: 'api_key 1234' } });
        expect(res.status).toEqual(400);
      },
      params: {}
    });
  });

  it('should return a single key', async () => {
    jest.spyOn(AuthClient.prototype, 'verifyApiKey').mockImplementation(jest.fn());
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET', headers: { authorization: 'api_key 1234' } });
        expect(res.status).toEqual(200);
      },
      params: { key: 'keyName' }
    });
  });

  it('should delete a key', async () => {
    jest.spyOn(AuthClient.prototype, 'verifyApiKey').mockImplementation(jest.fn());
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE', headers: { authorization: 'api_key 1234' } });
        expect(res.status).toEqual(200);
      },
      params: { key: 'keyName' }
    });
  });

  it('should return keys', async () => {
    jest.spyOn(AuthClient.prototype, 'verifyApiKey').mockImplementation(jest.fn());
    Redis.mockImplementation(() => {
      return {
        call: (): object => {
          return [0, []];
        }
      };
    });
    RedisCache.redisClient = new Redis();
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET', headers: { authorization: 'api_key 1234' } });
        expect(res.status).toEqual(200);
      },
      params: { keys: '*' }
    });
  });
});
