import { getMockResolverRequestWithDataSources, mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import analyticsResolver from '@resolvers/analytics';
import { AnalyticsClient } from '@dataSources/analyticsService/client';
import {
  contactsResponseData,
  totalHubViewData,
  totalVideoViewDataResponse,
  videosResponseData,
  watchDurationDataResponse
} from '@dataSources/__TestUtils__/fixtures/analyticsData';
import { UniversalContactsClient } from '@dataSources/universalContactsService/client';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';

const input = {
  hubId: 'baa1deee-289a-452b-9c95-190ba185775f',
  startDate: '2021-08-15T00:00:00Z',
  endDate: '2023-08-15T00:00:00Z'
};
describe('resolvers/snapshot', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      analyticsClient: new AnalyticsClient(),
      universalContactsClient: new UniversalContactsClient(),
      universalVideoClient: new UniversalVideoServiceClient()
    };
  });

  describe('Analytics resolver', () => {
    it('Should fetch totalViewsByHubId for passed in hub id', async () => {
      mockDataSource(dataSources.analyticsClient, 'post', totalHubViewData);

      const resolverRequest = getMockResolverRequestWithDataSources('totalViewsByHubId', dataSources, {
        input
      });
      dataSources.analyticsClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(analyticsResolver, 'totalViewsByHubId', resolverRequest);
      expect(response).toBeTruthy();
    });

    it('Should fetch averageViewDurationByHubId for passed in hub id', async () => {
      mockDataSource(dataSources.analyticsClient, 'post', totalHubViewData);

      const resolverRequest = getMockResolverRequestWithDataSources('averageViewDurationByHubId', dataSources, {
        input
      });
      dataSources.analyticsClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(analyticsResolver, 'averageViewDurationByHubId', resolverRequest);
      expect(response).toBeTruthy();
    });

    it('Should fetch viewsByDeviceType for passed in hub id', async () => {
      mockDataSource(dataSources.analyticsClient, 'post', totalHubViewData);

      const resolverRequest = getMockResolverRequestWithDataSources('viewsByDeviceType', dataSources, {
        input
      });
      dataSources.analyticsClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(analyticsResolver, 'viewsByDeviceType', resolverRequest);
      expect(response).toBeTruthy();
    });

    it('Should fetch videosViewDetailsByHubId for passed in hub id', async () => {
      mockDataSource(dataSources.analyticsClient, 'post', totalVideoViewDataResponse);
      mockDataSource(dataSources.universalVideoClient, 'post', videosResponseData);

      const resolverRequest = getMockResolverRequestWithDataSources('videosViewDetailsByHubId', dataSources, {
        input
      });
      dataSources.analyticsClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(analyticsResolver, 'videosViewDetailsByHubId', resolverRequest);
      expect(response).toBeTruthy();
    });

    it('Should fetch memberVideoWatchDurationByHubId for passed in hub id', async () => {
      mockDataSource(dataSources.analyticsClient, 'post', watchDurationDataResponse);
      mockDataSource(dataSources.universalContactsClient, 'post', contactsResponseData);

      const resolverRequest = getMockResolverRequestWithDataSources('memberVideoWatchDurationByHubId', dataSources, {
        input: {
          videoId: 'baa1deee-289a-452b-9c95-190ba185775f',
          videoDuration: 100,
          filter: input
        }
      });
      dataSources.analyticsClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(
        analyticsResolver,
        'memberVideoWatchDurationByHubId',
        resolverRequest
      );
      expect(response).toBeTruthy();
    });
  });
});
