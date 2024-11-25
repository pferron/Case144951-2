import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { AnalyticsClient } from '@dataSources/analyticsService/client';
import {
  averageViewDurationByHubIdClientRequest,
  totalHubViewData,
  totalHubViewDataClientRequest,
  totalHubViewDataResponse,
  totalVideosViewCountRequest,
  totalVideoViewDataResponseWeek1,
  totalViewsPerDayPerVideoClientRequest,
  totalViewsPerDayPerVideoResponse,
  totalWatchDurationPerMember,
  videosViewDataResponse,
  watchDurationDataResponse
} from '@dataSources/__TestUtils__/fixtures/analyticsData';

let dataSource: AnalyticsClient;
beforeAll(() => {
  dataSource = new AnalyticsClient();
});

const PARAMS = {
  hubId: 'baa1deee-289a-452b-9c95-190ba185775f',
  videoId: '467788fc-bd41-48bd-b6c4-cd6c164478db',
  mappingId: 'baa1deee-289a-452b-9c95-190ba185775f',
  startDate: '2021-08-15T00:00:00Z',
  endDate: '2023-08-15T00:00:00Z',
  limit: 2500,
  offset: 0
};

describe('Analytics Service Tests', () => {
  beforeEach(() => {
    dataSource.post = jest.fn().mockImplementation(async () => null);
  });

  it('sends POST /v1/analytics_data_source/requestData/total_views_per_hub_per_day_agg', async () => {
    mockDataSource(dataSource, 'post', totalHubViewData);
    const response = await dataSource.getTotalViewsByHubId(PARAMS.hubId, PARAMS.startDate, PARAMS.endDate);

    expect(response).toEqual(totalHubViewDataResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/total_views_per_hub_per_day_agg`,
      totalHubViewDataClientRequest,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });

  it('sends POST /v1/analytics_data_source/requestData/total_views_per_hub_per_day_agg_v2 (V2)', async () => {
    mockDataSource(dataSource, 'post', totalHubViewData);
    const response = await dataSource.getTotalViewsByHubId(PARAMS.hubId, PARAMS.startDate, PARAMS.endDate, 'v2');

    expect(response).toEqual(totalHubViewDataResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/total_views_per_hub_per_day_agg_v2`,
      totalHubViewDataClientRequest,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });

  it('sends POST /v1/analytics_data_source/requestData/average_view_duration_per_hub_per_day_agg', async () => {
    mockDataSource(dataSource, 'post', totalHubViewData);
    const response = await dataSource.averageViewDurationByHubId(PARAMS.hubId, PARAMS.startDate, PARAMS.endDate);

    expect(response).toEqual(totalHubViewDataResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/average_view_duration_per_hub_per_day_agg`,
      averageViewDurationByHubIdClientRequest,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });

  it('sends POST /v1/analytics_data_source/requestData/average_view_duration_per_hub_per_day_agg_v2 (V2)', async () => {
    mockDataSource(dataSource, 'post', totalHubViewData);
    const response = await dataSource.averageViewDurationByHubId(PARAMS.hubId, PARAMS.startDate, PARAMS.endDate, 'v2');

    expect(response).toEqual(totalHubViewDataResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/average_view_duration_per_hub_per_day_agg_v2`,
      averageViewDurationByHubIdClientRequest,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });

  it('sends POST /v1/analytics_data_source/requestData/total_views_per_source_per_day_agg', async () => {
    mockDataSource(dataSource, 'post', totalVideoViewDataResponseWeek1);
    const response = await dataSource.getTotalVideosViewedByHubId(
      PARAMS.mappingId,
      PARAMS.hubId,
      PARAMS.startDate,
      PARAMS.endDate,
      'v1'
    );

    expect(response).toEqual(totalViewsPerDayPerVideoResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/total_views_per_source_per_day_agg`,
      totalViewsPerDayPerVideoClientRequest,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });

  it('sends POST /v1/analytics_data_source/requestData/total_views_per_source_per_day_agg_v2 (V2)', async () => {
    mockDataSource(dataSource, 'post', totalVideoViewDataResponseWeek1);
    const response = await dataSource.getTotalVideosViewedByHubId(
      PARAMS.mappingId,
      PARAMS.hubId,
      PARAMS.startDate,
      PARAMS.endDate,
      'v2'
    );

    expect(response).toEqual(totalViewsPerDayPerVideoResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/total_views_per_source_per_day_agg_v2`,
      totalViewsPerDayPerVideoClientRequest,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });

  it('sends POST /v1/analytics_data_source/requestData/total_views_per_hub_per_video_agg_v2', async () => {
    mockDataSource(dataSource, 'post', videosViewDataResponse);
    const response = await dataSource.getAllVideosViewedByHubId(
      PARAMS.mappingId,
      PARAMS.hubId,
      PARAMS.startDate,
      PARAMS.endDate,
      PARAMS.limit,
      PARAMS.offset
    );

    expect(response).toEqual(videosViewDataResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/total_views_per_hub_per_video_agg_v2`,
      totalVideosViewCountRequest,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });

  it('sends POST /v1/analytics_data_source/requestData/total_watch_duration_per_member_agg_v2', async () => {
    mockDataSource(dataSource, 'post', watchDurationDataResponse);
    const response = await dataSource.getMemberVideoWatchDurationByHubId(
      PARAMS.mappingId,
      PARAMS.hubId,
      PARAMS.videoId,
      PARAMS.startDate,
      PARAMS.endDate,
      PARAMS.limit,
      PARAMS.offset
    );

    expect(response).toEqual(watchDurationDataResponse);

    expect(dataSource.post).toHaveBeenCalledWith(
      `/v1/analytics_data_source/requestData/total_watch_duration_per_member_agg_v2`,
      totalWatchDurationPerMember,
      { headers: { authorization: `API_KEY ${process.env.API_KEY}` } }
    );
  });
});
