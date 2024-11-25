import { EntityImagesServiceClient } from '@dataSources/entityImagesService/client';
import resolver from '../entityMedia/index';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '../common/testUtils/mockRequestData';
import { resolveMutationResponse, resolveQueryResponse } from '../common/testUtils/mockFunction';

const entity = {
  id: 'a6e50019-54e7-4d88-9ee7-c609bb13fada',
  type: 'CALENDAR_ADDITIONAL_ITEM'
};
const imageId = '8fd7f50c-6903-4f66-8661-d1c6b180b078';

const uploadImageRequest = {
  imageInput: {
    name: 'test.png',
    size: 3,
    url: 'https://silo460-custom.core.cvent.org/00000000000000000000000000000000/371bbb1f-1067-4c53-b900-81ae495f241c/asset/image/2457dabc-0cb9-4437-a320-1fddc59f6303.png/3000pixelimage.jpeg',
    entity
  }
};

const uploadImageResponse = {
  id: imageId,
  name: 'test.png',
  size: 3,
  relativePath:
    '/e09eca22b99544fc9b4bee746c855bd3/d426d7af-449d-4309-a5da-57f175624365/image/55175055-f429-403c-980a-7cf07eb8f4e4.png',
  optimizedUrl:
    'https://images-lower.cvent.com/S460/e09eca22b99544fc9b4bee746c855bd3/d426d7af-449d-4309-a5da-57f175624365/image/55175055-f429-403c-980a-7cf07eb8f4e4!_!41981b7e996add5da96e59be5d59e0d7.png',
  createdAt: '2019-01-21T05:47:26.853Z',
  entityId: entity.id,
  entityType: entity.type
};

const getEntityImageResponse = {
  data: [
    {
      id: imageId,
      name: 'test.png',
      size: 3,
      relativePath:
        '/e09eca22b99544fc9b4bee746c855bd3/d426d7af-449d-4309-a5da-57f175624365/image/55175055-f429-403c-980a-7cf07eb8f4e4.png',
      optimizedUrl:
        'https://images-lower.cvent.com/S460/e09eca22b99544fc9b4bee746c855bd3/d426d7af-449d-4309-a5da-57f175624365/image/55175055-f429-403c-980a-7cf07eb8f4e4!_!41981b7e996add5da96e59be5d59e0d7.png',
      createdAt: '2021-12-02T09:10:20.583Z',
      entityId: entity.id,
      entityType: entity.type
    }
  ]
};

describe('Test entityImage resolvers', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      entityImagesServiceClient: new EntityImagesServiceClient()
    };
  });

  it('Should get an entity image', async () => {
    mockDataSource(dataSources.entityImagesServiceClient, 'getEntityImage', getEntityImageResponse);

    // // Mocking API call to get channel
    const entityImage = await resolveQueryResponse(
      resolver,
      'getEntityImage',
      getMockResolverRequestWithDataSources('Query.getEntityImage', dataSources, { entity })
    );

    expect(entityImage).toBeTruthy();
    expect(entityImage.id).toBe(imageId);
    expect(entityImage.filename).toBe(getEntityImageResponse.data[0].name);
    expect(entityImage.size).toBe(getEntityImageResponse.data[0].size);
    expect(entityImage.createdAt).toBe(getEntityImageResponse.data[0].createdAt);
    expect(entityImage.entityId).toBe(entity.id);
    expect(entityImage.entityType).toBe(entity.type);
  });

  it('Should return null if trying to get an entity image that does not exist', async () => {
    mockDataSource(dataSources.entityImagesServiceClient, 'getEntityImage', null);

    const entityImage = await resolveQueryResponse(
      resolver,
      'getEntityImage',
      getMockResolverRequestWithDataSources('Query.getEntityImage', dataSources, { entity })
    );
    expect(entityImage).toBeNull();
  });

  it('Should upload an entity image', async () => {
    mockDataSource(dataSources.entityImagesServiceClient, 'uploadEntityImage', uploadImageResponse);

    const entityImage = await resolveMutationResponse(
      resolver,
      'uploadEntityImage',
      getMockResolverRequestWithDataSources('Mutation.uploadEntityImage', dataSources, {
        imageInput: uploadImageRequest.imageInput
      })
    );
    expect(entityImage).toBeTruthy();
    expect(entityImage.id).toBe(imageId);
    expect(entityImage.filename).toBe(uploadImageResponse.name);
    expect(entityImage.size).toBe(uploadImageResponse.size);
    expect(entityImage.createdAt).toBe(uploadImageResponse.createdAt);
    expect(entityImage.entityId).toBe(entity.id);
    expect(entityImage.entityType).toBe(entity.type);
  });

  it('Should fail due to authorization', async () => {
    mockDataSourceError(dataSources.entityImagesServiceClient, 'uploadEntityImage', 'Unauthorised', '401');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'uploadEntityImage',
        getMockResolverRequestWithDataSources('Mutation.uploadEntityImage', dataSources, {
          imageInput: uploadImageRequest.imageInput
        })
      );
    }).rejects.toThrow('Unauthorised');
  });

  it('should delete an entity image successfully', async () => {
    mockDataSource(dataSources.entityImagesServiceClient, 'deleteEntityImage', {});

    const response = await resolveMutationResponse(
      resolver,
      'deleteEntityImage',
      getMockResolverRequestWithDataSources('Mutation.deleteEntityImage', dataSources, { imageId })
    );
    expect(response).toBeTruthy();
    expect(response).toBe(true);
  });

  it('Should fail to delete as image not found', async () => {
    mockDataSourceError(dataSources.entityImagesServiceClient, 'deleteEntityImage', 'Not Found', '404');

    await expect(async () => {
      await resolveMutationResponse(
        resolver,
        'deleteEntityImage',
        getMockResolverRequestWithDataSources('Mutation.deleteEntityImage', dataSources, {
          imageId: '12345'
        })
      );
    }).rejects.toThrow('Not Found');
  });
});
