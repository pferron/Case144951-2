import { EntityImagesServiceClient } from '@dataSources/entityImagesService/client';
import { mockDataSource, mockDataSourceError } from '@resolvers/common/testUtils/mockRequestData';
import { expect } from '@jest/globals';
import { EntityInput } from '@cvent/planner-event-hubs-model/types';

describe('EntityImagesServiceClient/client', () => {
  let dataSource: EntityImagesServiceClient;

  const entity: EntityInput = {
    id: 'entityId',
    type: 'CALENDAR_ADDITIONAL_ITEM'
  };

  beforeEach(() => {
    dataSource = new EntityImagesServiceClient();
    dataSource.context = {
      headers: { AccountId: 'account-id' },
      auth: {
        authorization: {
          metadata: {
            environment: 'unit-test',
            accountId: 'account-Id'
          }
        }
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get entity image successfully', async () => {
    const ImageResponse = {
      getEntityImage: {
        id: 'imageId',
        filename: 'test-file.jpeg',
        size: 323,
        url: 'https://www.google.com/images',
        entityId: 'entityId',
        entityType: 'CALENDAR_ADDITIONAL_ITEM'
      }
    };
    mockDataSource(dataSource, 'get', ImageResponse);
    await expect(dataSource.getEntityImage(entity)).resolves.toBe(ImageResponse);
  });

  it('Auth error while fetching channel', async () => {
    mockDataSourceError(dataSource, 'get', 'unauthorized', '401');
    await expect(dataSource.getEntityImage(entity)).rejects.toThrow('unauthorized');
  });

  it('Create image successfully', async () => {
    const ImageResponse = {
      uploadEntityImage: {
        id: 'imageId',
        filename: 'test-file.jpeg',
        size: 323,
        url: 'https://www.google.com/images',
        entityId: 'entityId',
        entityType: 'CALENDAR_ADDITIONAL_ITEM'
      }
    };
    const ImageInput = {
      name: 'test-file.jpeg',
      size: 323,
      url: 'https://www.google.com/images',
      entity: {
        id: 'entityId',
        type: 'CALENDAR_ADDITIONAL_ITEM'
      }
    };
    mockDataSource(dataSource, 'post', ImageResponse);
    await expect(dataSource.uploadEntityImage(ImageInput)).resolves.toBe(ImageResponse);
  });

  it('Delete image successfully', async () => {
    mockDataSource(dataSource, 'delete', true);
    await expect(dataSource.deleteEntityImage('imageId')).resolves.toBe(true);
  });

  it('Entity image should not throw error when 404 is returned', async () => {
    mockDataSourceError(dataSource, 'get', 'Not Found', '404');
    await expect(dataSource.getEntityImage(entity)).resolves.toBe(null);
  });
});
