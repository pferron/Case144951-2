import {
  averageViewDurationByHubId,
  getMemberVideoWatchDurationByHubId,
  getTopFiveVideosViewedByHubId,
  getTotalViewsByHubId,
  getVideosViewDetailsByHubId,
  viewsByDeviceType
} from '@resolvers/common/dataAccess/analytics';
import { AnalyticsClient } from '@dataSources/analyticsService/client';
import {
  totalHubViewDataResponse,
  videosResponseData,
  averageWatchTimeDataResponse,
  totalVideoViewDataResponseWeek1,
  totalVideoViewDataResponseWeek2,
  top5VideosResponse,
  videosViewDataResponse,
  watchDurationDataResponse,
  contactsResponseData
} from '@dataSources/__TestUtils__/fixtures/analyticsData';
import { viewsByDeviceTypePerDay } from '@resolvers/fixtures/analyticsData';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { UniversalContactsClient } from '@dataSources/universalContactsService/client';

describe('dataAccess/analytics', () => {
  let mockAnalyticsClient: AnalyticsClient;
  let universalVideoServiceClient: UniversalVideoServiceClient;
  let universalContactClient: UniversalContactsClient;
  const accountMappingId = 'f6d74648-2c09-496f-a3e3-e3f6cd1503a0';
  const videoId = '467788fc-bd41-48bd-b6c4-cd6c164478db';
  const videoDuration = 1000;
  const hubId = 'baa1deee-289a-452b-9c95-190ba185775f';
  const startDate = '2023-08-01T00:00:00Z';
  const endDate13Days = '2023-08-14T00:00:00Z';
  const endDate60Days = '2023-09-30T00:00:00Z';
  const endDate100Days = '2023-11-09T00:00:00Z';

  beforeEach(() => {
    mockAnalyticsClient = new AnalyticsClient();
    universalVideoServiceClient = new UniversalVideoServiceClient();
    universalContactClient = new UniversalContactsClient();
    universalVideoServiceClient.getVideos = jest.fn().mockReturnValue(videosResponseData);
    universalVideoServiceClient.postVideos = jest.fn().mockReturnValue(videosResponseData);
    universalContactClient.filterContacts = jest.fn().mockReturnValue(contactsResponseData);
    mockAnalyticsClient.getTotalViewsByHubId = jest.fn().mockReturnValue(totalHubViewDataResponse);
    mockAnalyticsClient.averageViewDurationByHubId = jest.fn().mockReturnValue(averageWatchTimeDataResponse);
    mockAnalyticsClient.getTotalVideosViewedByHubId = jest.fn().mockImplementation((_mapId, _hubId, _startDate) => {
      return _startDate === '2023-08-08T23:59:00.000Z'
        ? totalVideoViewDataResponseWeek1
        : totalVideoViewDataResponseWeek2;
    });
    mockAnalyticsClient.getAllVideosViewedByHubId = jest.fn().mockReturnValueOnce(videosViewDataResponse);
    mockAnalyticsClient.getMemberVideoWatchDurationByHubId = jest.fn().mockReturnValueOnce(watchDurationDataResponse);
    mockAnalyticsClient.viewsByDeviceType = jest.fn().mockReturnValue(viewsByDeviceTypePerDay);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getTotalViewsByHubId: should give data in perDay when start and end difference is upto 13 day', async () => {
    const response = await getTotalViewsByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: startDate,
      endDateStr: endDate13Days
    });
    expect(response.perDay).toBeTruthy();
    expect(response.perWeek).toBeFalsy();
    expect(response.perMonth).toBeFalsy();

    expect(response.perDay.length).toBe(14);
    expect(response.perDay[0].date.toLocaleDateString()).toBe('8/1/2023');
    expect(response.perDay[1].date.toLocaleDateString()).toBe('8/2/2023');
    expect(response.perDay[2].date.toLocaleDateString()).toBe('8/3/2023');
    expect(response.perDay[3].date.toLocaleDateString()).toBe('8/4/2023');
    expect(response.perDay[4].date.toLocaleDateString()).toBe('8/5/2023');
    expect(response.perDay[5].date.toLocaleDateString()).toBe('8/6/2023');
    expect(response.perDay[6].date.toLocaleDateString()).toBe('8/7/2023');
    expect(response.perDay[7].date.toLocaleDateString()).toBe('8/8/2023');
    expect(response.perDay[8].date.toLocaleDateString()).toBe('8/9/2023');
    expect(response.perDay[9].date.toLocaleDateString()).toBe('8/10/2023');
    expect(response.perDay[10].date.toLocaleDateString()).toBe('8/11/2023');
    expect(response.perDay[11].date.toLocaleDateString()).toBe('8/12/2023');
    expect(response.perDay[12].date.toLocaleDateString()).toBe('8/13/2023');
    expect(response.perDay[13].date.toLocaleDateString()).toBe('8/14/2023');

    expect(response.total).toBe(25);
  });

  it('averageViewDurationByHubId: should give data in perDay when start and end difference is upto 13 days', async () => {
    const response = await averageViewDurationByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: startDate,
      endDateStr: endDate13Days
    });
    expect(response.perDay).toBeTruthy();
    expect(response.perWeek).toBeFalsy();
    expect(response.perMonth).toBeFalsy();

    expect(response.perDay.length).toBe(14);
    expect(response.perDay[0].date.toLocaleDateString()).toBe('8/1/2023');
    expect(response.perDay[1].date.toLocaleDateString()).toBe('8/2/2023');
    expect(response.perDay[2].date.toLocaleDateString()).toBe('8/3/2023');
    expect(response.perDay[3].date.toLocaleDateString()).toBe('8/4/2023');
    expect(response.perDay[4].date.toLocaleDateString()).toBe('8/5/2023');
    expect(response.perDay[5].date.toLocaleDateString()).toBe('8/6/2023');
    expect(response.perDay[6].date.toLocaleDateString()).toBe('8/7/2023');
    expect(response.perDay[7].date.toLocaleDateString()).toBe('8/8/2023');
    expect(response.perDay[8].date.toLocaleDateString()).toBe('8/9/2023');
    expect(response.perDay[9].date.toLocaleDateString()).toBe('8/10/2023');
    expect(response.perDay[10].date.toLocaleDateString()).toBe('8/11/2023');
    expect(response.perDay[11].date.toLocaleDateString()).toBe('8/12/2023');
    expect(response.perDay[12].date.toLocaleDateString()).toBe('8/13/2023');
    expect(response.perDay[13].date.toLocaleDateString()).toBe('8/14/2023');

    expect(response.total).toBe(2422.5151515151515);
  });

  it('getTotalViewsByHubId: should give data in perMonth when start and end difference is upto 60 days', async () => {
    const response = await getTotalViewsByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: startDate,
      endDateStr: endDate60Days
    });
    expect(response.perWeek).toBeTruthy();
    expect(response.perDay).toBeFalsy();
    expect(response.perMonth).toBeFalsy();

    expect(response.perWeek.length).toBe(9);
    expect(response.perWeek[0].date.toLocaleDateString()).toBe('7/30/2023');
    expect(response.perWeek[1].date.toLocaleDateString()).toBe('8/6/2023');
    expect(response.perWeek[2].date.toLocaleDateString()).toBe('8/13/2023');
    expect(response.perWeek[3].date.toLocaleDateString()).toBe('8/20/2023');
    expect(response.perWeek[4].date.toLocaleDateString()).toBe('8/27/2023');
    expect(response.perWeek[5].date.toLocaleDateString()).toBe('9/3/2023');
    expect(response.perWeek[6].date.toLocaleDateString()).toBe('9/10/2023');
    expect(response.perWeek[7].date.toLocaleDateString()).toBe('9/17/2023');
    expect(response.perWeek[8].date.toLocaleDateString()).toBe('9/24/2023');

    expect(response.total).toBe(25);
  });

  it('averageViewDurationByHubId: should give data in perMonth when start and end difference is upto 60 days', async () => {
    const response = await averageViewDurationByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: startDate,
      endDateStr: endDate60Days
    });
    expect(response.perWeek).toBeTruthy();
    expect(response.perDay).toBeFalsy();
    expect(response.perMonth).toBeFalsy();

    expect(response.perWeek.length).toBe(9);
    expect(response.perWeek[0].date.toLocaleDateString()).toBe('7/30/2023');
    expect(response.perWeek[1].date.toLocaleDateString()).toBe('8/6/2023');
    expect(response.perWeek[2].date.toLocaleDateString()).toBe('8/13/2023');
    expect(response.perWeek[3].date.toLocaleDateString()).toBe('8/20/2023');
    expect(response.perWeek[4].date.toLocaleDateString()).toBe('8/27/2023');
    expect(response.perWeek[5].date.toLocaleDateString()).toBe('9/3/2023');
    expect(response.perWeek[6].date.toLocaleDateString()).toBe('9/10/2023');
    expect(response.perWeek[7].date.toLocaleDateString()).toBe('9/17/2023');
    expect(response.perWeek[8].date.toLocaleDateString()).toBe('9/24/2023');

    expect(response.total).toBe(2422.5151515151515);
  });

  it('getTotalViewsByHubId: should give data in perMonth when start and end difference is more than 60 days', async () => {
    const response = await getTotalViewsByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: startDate,
      endDateStr: endDate100Days
    });
    expect(response.perMonth).toBeTruthy();
    expect(response.perDay).toBeFalsy();
    expect(response.perWeek).toBeFalsy();

    expect(response.perMonth.length).toBe(4); // Including start date
    expect(response.perMonth[0].date.toLocaleDateString()).toBe('8/1/2023');
    expect(response.perMonth[1].date.toLocaleDateString()).toBe('9/1/2023');
    expect(response.perMonth[2].date.toLocaleDateString()).toBe('10/1/2023');
    expect(response.perMonth[3].date.toLocaleDateString()).toBe('11/1/2023');

    expect(response.total).toBe(25);
  });

  it('averageViewDurationByHubId: should give data in perMonth when start and end difference is more than 60 days', async () => {
    const response = await averageViewDurationByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: startDate,
      endDateStr: endDate100Days
    });
    expect(response.perMonth).toBeTruthy();
    expect(response.perDay).toBeFalsy();
    expect(response.perWeek).toBeFalsy();

    expect(response.perMonth.length).toBe(4); // Including start date
    expect(response.perMonth[0].date.toLocaleDateString()).toBe('8/1/2023');
    expect(response.perMonth[1].date.toLocaleDateString()).toBe('9/1/2023');
    expect(response.perMonth[2].date.toLocaleDateString()).toBe('10/1/2023');
    expect(response.perMonth[3].date.toLocaleDateString()).toBe('11/1/2023');

    expect(response.total).toBe(2422.5151515151515);
  });

  it('viewsByDeviceType: should give accumulated data across date range', async () => {
    const response = await viewsByDeviceType({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: startDate,
      endDateStr: endDate100Days
    });
    expect(response.desktopViews).toBe(23);
    expect(response.mobileViews).toBe(111);
    expect(response.tabletViews).toBe(99);
    expect(response.totalViews).toBe(233);
  });

  it('getTopFiveVideosViewedByHubId:', async () => {
    const response = await getTopFiveVideosViewedByHubId(
      {
        analyticsClient: mockAnalyticsClient,
        hubId: '2e82365e-415e-49a7-90cb-2553aa0b6bd9',
        startDateStr: '2023-08-08T23:59:00.000Z',
        endDateStr: '2023-08-15T23:59:00.000Z'
      },
      universalVideoServiceClient,
      accountMappingId
    );
    expect(response).toStrictEqual(top5VideosResponse);
  });

  it('getTotalViewsByHubId throws error when day difference > 365:', async () => {
    const response = await getTotalViewsByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: '2023-08-01T00:00:00Z',
      endDateStr: '2025-08-01T00:00:00Z'
    });
    expect(response).toStrictEqual({
      serverError: true
    });
  });

  it('averageViewDurationByHubId throws error when day difference > 365:', async () => {
    const response = await averageViewDurationByHubId({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: '2023-08-01T00:00:00Z',
      endDateStr: '2025-08-01T00:00:00Z'
    });
    expect(response).toStrictEqual({
      serverError: true
    });
  });

  it('viewsByDeviceType throws error when day difference > 365:', async () => {
    const response = await viewsByDeviceType({
      analyticsClient: mockAnalyticsClient,
      hubId,
      startDateStr: '2023-08-01T00:00:00Z',
      endDateStr: '2025-08-01T00:00:00Z'
    });
    expect(response).toStrictEqual({
      desktopViews: null,
      tabletViews: null,
      mobileViews: null,
      serverError: true
    });
  });

  it('getVideosViewDetailsByHubId: should give accumulated data across date range', async () => {
    const response = await getVideosViewDetailsByHubId(
      {
        analyticsClient: mockAnalyticsClient,
        hubId,
        startDateStr: startDate,
        endDateStr: endDate100Days
      },
      accountMappingId,
      universalVideoServiceClient
    );
    expect(response.serverError).toBe(false);
    expect(response.data[0]).toStrictEqual({
      videoId: '12345678-1234-1234-1234-12345678901d',
      views: 100,
      videoDuration: 50,
      videoTitle: 'Video D',
      thumbnail: 'videod.png'
    });
    expect(response.data[1]).toStrictEqual({
      videoId: '12345678-1234-1234-1234-12345678901a',
      views: 85,
      videoDuration: 20,
      videoTitle: 'Video A',
      thumbnail: 'videoa.png'
    });
    expect(response.data[2]).toStrictEqual({
      videoId: '12345678-1234-1234-1234-12345678901b',
      views: 40,
      videoDuration: 30,
      videoTitle: 'Video B',
      thumbnail: 'videob.png'
    });
    expect(response.data[3]).toStrictEqual({
      videoId: '12345678-1234-1234-1234-12345678901c',
      views: 20,
      videoDuration: 0,
      videoTitle: 'Video C',
      thumbnail: 'videoc.png'
    });
  });
  it('getVideosViewDetailsByHubId throws error when day difference > 365:', async () => {
    const response = await getVideosViewDetailsByHubId(
      {
        analyticsClient: mockAnalyticsClient,
        hubId,
        startDateStr: '2023-08-01T00:00:00Z',
        endDateStr: '2025-08-01T00:00:00Z'
      },
      accountMappingId,
      universalVideoServiceClient
    );
    expect(response).toStrictEqual({
      serverError: true
    });
  });
  it('getMemberVideoWatchDurationByHubId: should give accumulated data across date range', async () => {
    const response = await getMemberVideoWatchDurationByHubId(
      {
        analyticsClient: mockAnalyticsClient,
        hubId,
        startDateStr: startDate,
        endDateStr: endDate100Days
      },
      videoId,
      videoDuration,
      accountMappingId,
      universalContactClient
    );
    expect(response.serverError).toBe(false);
    expect(response.data[0]).toStrictEqual({
      id: '12345678-1234-1234-1234-12345678901a',
      duration: 80,
      percentage: 8,
      firstName: 'A_First',
      lastName: 'A_Last',
      email: 'A@mail.com'
    });
    expect(response.data[1]).toStrictEqual({
      id: '12345678-1234-1234-1234-12345678901b',
      duration: 40,
      percentage: 4,
      firstName: 'B_First',
      lastName: 'B_Last',
      email: 'B@mail.com'
    });
    expect(response.data[2]).toStrictEqual({
      id: '12345678-1234-1234-1234-12345678901c',
      duration: 20,
      percentage: 2,
      firstName: 'C_First',
      lastName: 'C_Last',
      email: 'C@mail.com'
    });
    expect(response.data[3]).toStrictEqual({
      id: '12345678-1234-1234-1234-12345678901d',
      duration: 100,
      percentage: 10,
      firstName: 'D_First',
      lastName: 'D_Last',
      email: 'D@mail.com'
    });
    expect(response.data[4]).toStrictEqual({
      id: '12345678-1234-1234-1234-12345678901e',
      duration: 120,
      percentage: 12,
      firstName: 'E_First',
      lastName: 'E_Last',
      email: 'E@mail.com'
    });
  });
  it('getMemberVideoWatchDurationByHubId throws error when day difference > 365:', async () => {
    const response = await getMemberVideoWatchDurationByHubId(
      {
        analyticsClient: mockAnalyticsClient,
        hubId,
        startDateStr: '2023-08-01T00:00:00Z',
        endDateStr: '2025-08-01T00:00:00Z'
      },
      videoId,
      videoDuration,
      accountMappingId,
      universalContactClient
    );
    expect(response).toStrictEqual({
      serverError: true
    });
  });
});
