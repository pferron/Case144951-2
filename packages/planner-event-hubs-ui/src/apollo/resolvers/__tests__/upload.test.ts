import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import uploadResolver from '@resolvers/upload';
import { getMockResolverRequestWithDataSources, mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { RedisCache } from '@server/cache/RedisCache';
import Redis from 'ioredis-mock';
import { ScanStatus } from '@cvent/planner-event-hubs-model/types';

jest.mock('ioredis');

describe('resolvers/upload/index', () => {
  const dataSources = {
    s3ProxyServiceClient: new S3ProxyClient()
  };

  beforeEach(() => {
    RedisCache.redisClient = new Redis();
    dataSources.s3ProxyServiceClient.initialize({ context: { headers: {}, environment: 'env' }, cache: undefined });
  });

  afterEach(() => {
    RedisCache.redisClient = null;
  });

  it('should successfully get status', async () => {
    const fullFilePath = '0000/video-center/<center-id>/context/<context-id>/filename.ext';
    const fileId = 98765;
    const status = ScanStatus.ScanSuccess;
    await RedisCache.redisClient.set(
      `tempimagecache:${fullFilePath}`,
      JSON.stringify({ fullFilePath, fileId, status })
    );

    const response = await resolveQueryResponse(
      uploadResolver,
      'checkScanStatus',
      getMockResolverRequestWithDataSources('Query.checkScanStatus', dataSources, {
        input: {
          filePath: fullFilePath
        }
      })
    );
    expect(response).toEqual({ fullFilePath, fileId, status });
  });

  // lower-case is required for ILS compatibility
  it('should successfully generate pre-signed url with lower-case fullFilePath', async () => {
    const location = 'https://s3.amazon.com/image/location?x-amz-acl=bucket&fileId=testFileId';
    const relativePath = 'relative/file/path';
    mockDataSource(dataSources.s3ProxyServiceClient, 'post', {
      location,
      relativePath
    });
    const response = await resolveQueryResponse(
      uploadResolver,
      'generatePreSignedUrl',
      getMockResolverRequestWithDataSources('Query.generatePreSignedUrl', dataSources, {
        input: {
          centerId: 'center_id',
          entityId: 'entity_id',
          entityType: 'Banner',
          fileName: 'Image',
          fileExtension: 'PNG'
        }
      })
    );
    expect(response.uploadUrl).toBe(location);
    expect(response.fileId).toBe('testFileId');
    expect(response.fullFilePath).toBe(
      '99737873-fcf0-4b0f-bcf9-e5d3a55b1c22/video-center/center_id/banner/entity_id/image.png'
    );
  });
});
