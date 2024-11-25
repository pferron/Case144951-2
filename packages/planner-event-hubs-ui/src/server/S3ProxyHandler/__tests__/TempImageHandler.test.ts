import { grantedAccessToken } from '@server/__TestUtils__/mockData';
import Redis from 'ioredis-mock';
import { IncomingHttpHeaders } from 'http';
import { S3ProxyCallbackPayload, ScanStatus } from '@cvent/planner-event-hubs-model/types';
import { RedisCache } from '@server/cache/RedisCache';
import { TempImageHandler } from '../TempImageHandler';

let handler: TempImageHandler;
let mockTempImageCache: RedisCache;
let redis: Redis;
let key: string;
let centerId: string;
let entityId: string;
let environment: string;
let headers: IncomingHttpHeaders;
let payload: S3ProxyCallbackPayload;

jest.mock('ioredis');

describe('TempImageHandler.handleS3ProxyCallback(headers, payload)', () => {
  beforeEach(() => {
    centerId = '123';
    entityId = '321';
    handler = new TempImageHandler(grantedAccessToken, centerId, entityId, environment);
    redis = new Redis();
    mockTempImageCache = new RedisCache(redis);
    headers = {
      authorization: 'bearer token'
    };
    payload = {
      status: ScanStatus.ScanSuccess,
      fileId: 'unique',
      fullFilePath: 's3/key',
      location: 'https://amazonaws.com/s3/url',
      failureReason: ''
    };
    key = `tempimagecache:${payload.fullFilePath}`;
  });

  it('does nothing when payload.status is SCAN_IN_PROGRESS', async () => {
    payload.status = ScanStatus.ScanInProgress;
    await handler.handleS3ProxyCallback(headers, payload, { tempImageCache: mockTempImageCache });
    expect(await redis.get(key)).toBeNull();
  });

  it('for all other payload.status, store the payload in redis at key: tempimagecache:{fullFilePath}', async () => {
    await handler.handleS3ProxyCallback(headers, payload, { tempImageCache: mockTempImageCache });
    expect(await redis.get(key)).toEqual(JSON.stringify(payload));
  });
});
