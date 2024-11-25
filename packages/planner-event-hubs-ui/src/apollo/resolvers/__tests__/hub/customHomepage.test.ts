import { resolveQueryResponse, resolveMutationResponse } from '@resolvers/common/testUtils/mockFunction';
import {
  mockDataSource,
  getMockResolverRequestWithDataSources,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { ImageLookupClient } from '@dataSources/imageLookupService/client';
import hubResolver from '../../hub/index';

const centerId = '0624f8ef-e9e1-4304-bbf5-63827e61a322';

describe('Events+ Hub Homepage Customization graphs', () => {
  let dataSources;
  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient(),
      s3ProxyServiceClient: new S3ProxyClient(),
      imageLookupClient: new ImageLookupClient()
    };
  });

  describe('getPage', () => {
    it('Should successfully return the most recent published page', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', {});
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getPage', dataSources, {
        input: { hubId: centerId }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getPage', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({});
    });

    it('Should return empty page when service response with no published page found for hub', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Not Found', '404', {
        message: 'No Published Page found for hub'
      });
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getPage', dataSources, {
        input: { hubId: centerId }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getPage', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({});
    });
  });

  describe('createPage', () => {
    it('Should successfully create and return a new Page', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', {});

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.createPage', dataSources, {
        page: {}
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'createPage', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({ page: {} });
    });

    it('optionally accepts a newSection to create and return', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', {});
      mockDataSource(dataSources.videoCenterClient, 'put', {});

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.createPage', dataSources, {
        page: {},
        newSection: {}
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'createPage', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({ page: {}, newSection: {} });
    });
  });

  describe('updatePage', () => {
    it('Should successfully update a page', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', {});

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.updatePage', dataSources, {
        data: {}
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'updatePage', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({});
    });
  });

  describe('createSection', () => {
    it('Should successfully create a section', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', {});
      mockDataSource(dataSources.videoCenterClient, 'put', {});

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.createSection', dataSources, {
        input: { hubID: centerId },
        data: {}
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'createSection', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({});
    });
  });

  describe('updateSection', () => {
    it('Should successfully update a section', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', {});

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.updateSection', dataSources, {
        input: { hubID: centerId },
        data: {}
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'updateSection', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({});
    });

    it('Should successfully update a section and update a new image', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', {});
      const movedFileUrl = 'https://image-lower.cvent.com/final/resting/place/image.jpg';
      const optimizedImageUrl =
        'https://image-lower.cvent.com/final/resting/place/imageJWIKOEJFOWIEJ!_!JIOWJEF23842.jpg';
      mockDataSource(dataSources.s3ProxyServiceClient, 'moveFile', movedFileUrl);
      mockDataSource(dataSources.imageLookupClient, 'lookup', {
        data: {
          [movedFileUrl]: {
            height: 100,
            width: 100,
            hashedURL: optimizedImageUrl
          }
        }
      });
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.updateSection', dataSources, {
        input: { hubID: centerId },
        data: {
          newImageUrl: 'https://image-lower.cvent.com/eventsplus/banner/image.jpg',
          newOriginalImageUrl: 'https://image-lower.cvent.com/eventsplus/banner/image.jpg',
          imageUrl: 'https://images-lower.cvent.com/bogus/imageJKLWJEF234!_!WJIOEJF89234.jpg',
          originalImageUrl: 'https://s3.amazonaws.com/cvent/account/bogus/image.jpg'
        }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'updateSection', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual({});
    });
  });
});
