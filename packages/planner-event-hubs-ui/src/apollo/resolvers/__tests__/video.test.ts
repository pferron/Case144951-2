import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import {
  getMockResolverRequestWithNoCenterId,
  getMockResolverRequestWithPlannerRole,
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import videoResolver from '@resolvers/video';
import { videosResponseData } from '../fixtures/videosData';

let dataSources;

beforeEach(() => {
  jest.clearAllMocks();
  dataSources = {
    universalVideoServiceClient: new UniversalVideoServiceClient()
  };
});

const mockFilterInput = {
  filterInput: {
    filter: "status eq 'Available'"
  }
};

describe('Test video resolvers', () => {
  it('Get videos should fail: Unauthorized for NO center id/planner role in auth', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'postVideos', videosResponseData);
    const resolverRequest = getMockResolverRequestWithNoCenterId('Query.getVideos', dataSources, {});
    dataSources.universalVideoServiceClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveQueryResponse(videoResolver, 'getVideos', resolverRequest);
    }).rejects.toThrow('Not authorized');
  });

  it('Get videos should fail: Unauthorized', async () => {
    mockDataSourceError(dataSources.universalVideoServiceClient, 'postVideos', 'Unauthorised', '401');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getVideos', dataSources, mockFilterInput);
    dataSources.universalVideoServiceClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveQueryResponse(videoResolver, 'getVideos', resolverRequest);
    }).rejects.toThrow('Unauthorised');
  });

  it('Get videos should fail for null filter in member request', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'postVideos', videosResponseData);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getVideos', dataSources, {});
    dataSources.universalVideoServiceClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveQueryResponse(videoResolver, 'getVideos', resolverRequest);
    }).rejects.toThrow('Filter cannot be null');
  });

  it('Get videos should return videos data successfully', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'postVideos', videosResponseData);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getVideos', dataSources, mockFilterInput);

    dataSources.universalVideoServiceClient.context = resolverRequest.context;
    const response = await resolveQueryResponse(videoResolver, 'getVideos', resolverRequest);
    expect(response).toBeTruthy();
    expect(response.data.length).toBe(1);
    expect(response.data[0].id).toBeTruthy();
    expect(response.data[0].title).toBe(videosResponseData.data[0].title);
    expect(response.data[0].description).toBe(videosResponseData.data[0].description);
    expect(response.data[0].created).toBe(videosResponseData.data[0].created);
    expect(response.data[0].duration).toBe(videosResponseData.data[0].duration);
    expect(response.data[0].tags).toBe(videosResponseData.data[0].tags);
    expect(response.data[0].sessions).toBe(videosResponseData.data[0].sessions);
    expect(response.data[0].catalogs).toBe(videosResponseData.data[0].catalogs);
  });

  it('Get videos should return videos data successfully (planner role in auth)', async () => {
    mockDataSource(dataSources.universalVideoServiceClient, 'postVideos', videosResponseData);
    const resolverRequest = getMockResolverRequestWithPlannerRole('Query.getVideos', dataSources, {});
    dataSources.universalVideoServiceClient.context = resolverRequest.context;
    const response = await resolveQueryResponse(videoResolver, 'getVideos', resolverRequest);
    expect(response).toBeTruthy();
    expect(response.data.length).toBe(1);
  });
});
