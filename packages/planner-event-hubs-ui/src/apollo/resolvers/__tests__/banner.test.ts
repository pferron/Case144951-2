import { resolveQueryResponse, resolveMutationResponse } from '@resolvers/common/testUtils/mockFunction';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { BannerServiceClient } from '@dataSources/bannerService/client';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { BannerUpdate, ExistingBanner } from '@cvent/planner-event-hubs-model/types';
import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { ImageLookupClient } from '@dataSources/imageLookupService/client';
import bannerResolver from '../banner/index';
// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let dataSources: any;
const bannerSearch = { bannersSearch: { centerId: 'centerId', bannerId: 'bannerId' } };
let existingBanner: ExistingBanner;
let updatingBanner: BannerUpdate;
let fetchBannersResponse: { data: Array<ExistingBanner>; paging: NonNullable<unknown> };

describe('Test banner resolver', () => {
  beforeEach(() => {
    dataSources = {
      bannerServiceClient: new BannerServiceClient(),
      videoCenterClient: new VideoCenterClient(),
      s3ProxyServiceClient: new S3ProxyClient(),
      imageLookupClient: new ImageLookupClient()
    };
    existingBanner = {
      id: bannerSearch.bannersSearch.bannerId,
      centerId: bannerSearch.bannersSearch.centerId,
      name: 'name',
      layout: 'layout'
    };
    updatingBanner = {
      ...existingBanner
    };
    fetchBannersResponse = { data: [existingBanner], paging: {} };
  });

  it('Get banner bubbles up service error', async () => {
    const errorMessage = 'ut-error-essage';
    mockDataSourceError(dataSources.bannerServiceClient, 'get', errorMessage, 'error-code');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getBanner', dataSources, bannerSearch);
    dataSources.bannerServiceClient.context = resolverRequest.context;

    await expect(async () => {
      await resolveQueryResponse(bannerResolver, 'banner', resolverRequest);
    }).rejects.toThrow(errorMessage);
  });

  describe('creating a banner', () => {
    let newBannerResponse;
    let createBannerInput;
    let resolverRequest;
    beforeEach(() => {
      newBannerResponse = { id: 'id' };
      createBannerInput = { input: { centerId: 'centerId', id: 'id', name: 'name', layout: 'layout' } };
      mockDataSource(dataSources.bannerServiceClient, 'post', newBannerResponse);
      mockDataSource(dataSources.bannerServiceClient, 'delete', null);
      mockDataSource(dataSources.videoCenterClient, 'post', null);
      resolverRequest = getMockResolverRequestWithDataSources('Mutation.bannerCreate', dataSources, createBannerInput);
      dataSources.bannerServiceClient.context = resolverRequest.context;
      dataSources.videoCenterClient.context = resolverRequest.context;
    });

    it('Should create a banner, adding new banner to current video center and return the banner id', async () => {
      const createBannerResponse = await resolveMutationResponse(bannerResolver, 'bannerCreate', resolverRequest);

      expect(createBannerResponse).toEqual(newBannerResponse.id);
    });

    it('bubbles up any errors', async () => {
      const errorMessage = 'ut-error-essage';
      mockDataSourceError(dataSources.bannerServiceClient, 'post', errorMessage, 'error-code');
      dataSources.bannerServiceClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveMutationResponse(bannerResolver, 'bannerCreate', resolverRequest);
      }).rejects.toThrow(errorMessage);
    });
  });

  it('Should fetch a banner', async () => {
    mockDataSource(dataSources.bannerServiceClient, 'get', existingBanner);

    const graphResponse = await resolveQueryResponse(
      bannerResolver,
      'banner',
      getMockResolverRequestWithDataSources('Query.getBanner', dataSources, bannerSearch)
    );

    expect(graphResponse).toBeTruthy();
    expect(graphResponse.id).toEqual(bannerSearch.bannersSearch.bannerId);
  });

  it('Should fetch a banners', async () => {
    const bannersSearchQueryArgs = {
      bannerFilter: {
        hubId: 'hubId',
        filterInput: { hubId: 'hubId', token: 'token', limit: 10 }
      }
    };
    mockDataSource(dataSources.bannerServiceClient, 'get', fetchBannersResponse);

    const graphResponse = await resolveQueryResponse(
      bannerResolver,
      'banners',
      getMockResolverRequestWithDataSources('Query.getBanners', dataSources, bannersSearchQueryArgs)
    );

    expect(graphResponse).toBeTruthy();
    expect(graphResponse.data.length).toEqual(fetchBannersResponse.data.length);
    expect(graphResponse.data[0]).toEqual(graphResponse.data[0]);
  });

  describe('deleting a banner', () => {
    it('Should delete a banner and return deleted banner id', async () => {
      mockDataSource(dataSources.bannerServiceClient, 'delete', null);

      const deleteBannerResponse = await resolveMutationResponse(
        bannerResolver,
        'bannerDelete',
        getMockResolverRequestWithDataSources('Mutation.bannerDelete', dataSources, bannerSearch)
      );

      expect(deleteBannerResponse).toEqual(existingBanner.id);
    });

    it('bubles up any errors', async () => {
      const errorMessage = 'ut-error-essage';
      mockDataSourceError(dataSources.bannerServiceClient, 'delete', errorMessage, 'error-code');
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.bannerDelete', dataSources, bannerSearch);
      dataSources.bannerServiceClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveMutationResponse(bannerResolver, 'bannerDelete', resolverRequest);
      }).rejects.toThrow(errorMessage);
    });
  });

  describe('updating a banner', () => {
    it('Should update a banner when newImage fields are NOT present', async () => {
      mockDataSource(dataSources.bannerServiceClient, 'updateBanner', fetchBannersResponse);

      const updateBanner = await resolveMutationResponse(
        bannerResolver,
        'bannerUpdate',
        getMockResolverRequestWithDataSources('Mutation.bannerUpdate', dataSources, { input: updatingBanner })
      );

      expect(updateBanner).toEqual(fetchBannersResponse);
    });

    it('updates banner when newImage fields are present', async () => {
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
      mockDataSource(dataSources.bannerServiceClient, 'updateBanner', fetchBannersResponse);
      updatingBanner.newImageUrl = 'https://image-lower.cvent.com/eventsplus/banner/image.jpg';
      updatingBanner.newOriginalImageUrl = 'https://image-lower.cvent.com/eventsplus/banner/image.jpg';
      const updateBanner = await resolveMutationResponse(
        bannerResolver,
        'bannerUpdate',
        getMockResolverRequestWithDataSources('Mutation.bannerUpdate', dataSources, { input: updatingBanner })
      );
      fetchBannersResponse.data[0] = {
        ...existingBanner,
        imageUrl: optimizedImageUrl,
        originalImageUrl: updatingBanner.newOriginalImageUrl
      };
      expect(updateBanner).toEqual(fetchBannersResponse);
    });
  });
});
