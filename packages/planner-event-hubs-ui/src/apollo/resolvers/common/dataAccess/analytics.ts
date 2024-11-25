import { AnalyticsClient, VideoViewsAndPosition } from '@dataSources/analyticsService/client';
import {
  mapToDays,
  mapToWeeks,
  mapToMonths,
  DAY_IN_MILLISECONDS,
  sortVideosByViewsDescending,
  computeViewsBySource
} from '@resolvers/common/utils/analyticsUtils';
import {
  AnalyticsData,
  TopVideosResponse,
  Video,
  type VideoCountData,
  MemberWatchDurationData,
  MemberVideoWatchData,
  ViewsBySourceResponse,
  VideoAnalyticsItem
} from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { UniversalContactsClient } from '@dataSources/universalContactsService/client';
import { BATCH_SIZE, LIMIT } from '@resolvers/common/utils/constants';

const LOG = LoggerFactory.create('dataAccess/analytics.ts');

export interface AnalyticsRequestInput {
  analyticsClient: AnalyticsClient;
  hubId: string;
  startDateStr: string;
  endDateStr: string;
  pipeline?: string;
}

export const getTotalViewsByHubId = async ({
  analyticsClient,
  hubId,
  startDateStr,
  endDateStr,
  pipeline
}: AnalyticsRequestInput): Promise<AnalyticsData> => {
  try {
    const startDate = Date.parse(startDateStr);
    const endDate = Date.parse(endDateStr);
    const TOTAL_VIEWS_INDEX = 2;

    const diffInDays = (endDate - startDate) / DAY_IN_MILLISECONDS;
    if (diffInDays > 365) {
      throw new Error('Time difference can not be greater then 365 days');
    }
    let response = {};
    if (diffInDays > 0) {
      const analyticsData = await analyticsClient.getTotalViewsByHubId(hubId, startDateStr, endDateStr, pipeline);
      if (diffInDays <= 13) {
        response = mapToDays(analyticsData, startDate, endDate, TOTAL_VIEWS_INDEX);
      } else if (diffInDays <= 60) {
        response = mapToWeeks(analyticsData, startDate, endDate, TOTAL_VIEWS_INDEX);
      } else {
        response = mapToMonths(analyticsData, startDate, endDate, TOTAL_VIEWS_INDEX);
      }
    }
    return response;
  } catch (error) {
    return {
      serverError: true
    };
  }
};

export const averageViewDurationByHubId = async ({
  analyticsClient,
  hubId,
  startDateStr,
  endDateStr,
  pipeline
}: AnalyticsRequestInput): Promise<AnalyticsData> => {
  try {
    const startDate = Date.parse(startDateStr);
    const endDate = Date.parse(endDateStr);
    const AVERAGE_VIEW_DURATION_INDEX = 2;

    const diffInDays = (endDate - startDate) / DAY_IN_MILLISECONDS;
    if (diffInDays > 365) {
      throw new Error('Time difference can not be greater then 365 days');
    }
    let response = {};
    if (diffInDays > 0) {
      const analyticsData = await analyticsClient.averageViewDurationByHubId(hubId, startDateStr, endDateStr, pipeline);
      if (diffInDays <= 13) {
        response = mapToDays(analyticsData, startDate, endDate, AVERAGE_VIEW_DURATION_INDEX);
      } else if (diffInDays <= 60) {
        response = mapToWeeks(analyticsData, startDate, endDate, AVERAGE_VIEW_DURATION_INDEX);
      } else {
        response = mapToMonths(analyticsData, startDate, endDate, AVERAGE_VIEW_DURATION_INDEX);
      }
    }
    return response;
  } catch (error) {
    return {
      serverError: true
    };
  }
};

export const getTopFiveVideosViewedByHubId = async (
  { analyticsClient, hubId, startDateStr, endDateStr, pipeline }: AnalyticsRequestInput,
  universalVideoServiceClient: UniversalVideoServiceClient,
  accountMappingId: string
): Promise<TopVideosResponse> => {
  try {
    const TOTAL_VIDEO_COUNT = 5;

    const startDate = Date.parse(startDateStr);
    const endDate = Date.parse(endDateStr);

    const diffInDays = (endDate - startDate) / DAY_IN_MILLISECONDS;
    if (diffInDays > 365) {
      throw new Error('Time difference can not be greater then 365 days');
    }

    const previousStartDate = startDate - (endDate - startDate);
    const previousStartDateStr = new Date(previousStartDate).toISOString();

    const analyticsDataForCurrentRange = await analyticsClient.getTotalVideosViewedByHubId(
      accountMappingId,
      hubId,
      startDateStr,
      endDateStr,
      pipeline
    );
    const analyticsDataForPreviousRange = await analyticsClient.getTotalVideosViewedByHubId(
      accountMappingId,
      hubId,
      previousStartDateStr,
      startDateStr,
      pipeline
    );

    const currentData = sortVideosByViewsDescending(analyticsDataForCurrentRange);
    const previousData = sortVideosByViewsDescending(analyticsDataForPreviousRange);

    const currentTop5Videos = currentData.slice(0, TOTAL_VIDEO_COUNT);
    const videoIds = currentTop5Videos.map((value, _key) => `id eq '${value.videoId}'`);
    const universalVideoResponse = await universalVideoServiceClient.getVideos({
      filter: videoIds.join(' OR ')
    });

    const videoTitleById = new Map(
      universalVideoResponse?.data.map((video: Video) => {
        return [video.id, video.title];
      })
    );

    return {
      topVideos: currentTop5Videos.map(({ videoId, totalViews, position }: VideoViewsAndPosition) => ({
        videoId,
        totalViews,
        videoName: videoTitleById.has(videoId) ? videoTitleById.get(videoId) : '',
        currentPosition: position,
        previousPosition: previousData.find(videos => videos.videoId === videoId)?.position || 0
      }))
    };
  } catch (error) {
    return {
      serverError: true
    };
  }
};

export const viewsByDeviceType = async ({
  analyticsClient,
  hubId,
  startDateStr,
  endDateStr,
  pipeline
}: AnalyticsRequestInput): Promise<ViewsBySourceResponse> => {
  try {
    const startDate = Date.parse(startDateStr);
    const endDate = Date.parse(endDateStr);
    const diffInDays = (endDate - startDate) / DAY_IN_MILLISECONDS;
    if (diffInDays > 365) {
      throw new Error('Time difference can not be greater then 365 days');
    }
    const analyticsData = await analyticsClient.viewsByDeviceType(hubId, startDateStr, endDateStr, pipeline);
    return computeViewsBySource(analyticsData);
  } catch (error) {
    return {
      desktopViews: null,
      tabletViews: null,
      mobileViews: null,
      serverError: true
    };
  }
};

const getIdValueMap = analyticsData => {
  const idValueMap = new Map<string, number>();
  analyticsData.forEach(a => {
    const id = a.values && a.values.length > 0 ? a.values[0] : '';
    const value = a.values && a.values.length > 1 ? a.values[1] : 0;
    if (idValueMap.has(id)) {
      idValueMap.set(id, idValueMap.get(id) + value);
    } else {
      idValueMap.set(id, value);
    }
  });
  return idValueMap;
};

export const getVideosViewDetailsByHubId = async (
  { analyticsClient, hubId, startDateStr, endDateStr }: AnalyticsRequestInput,
  accountMappingId: string,
  videoClient: UniversalVideoServiceClient
): Promise<VideoCountData> => {
  try {
    const startDate = Date.parse(startDateStr);
    const endDate = Date.parse(endDateStr);

    const diffInDays = (endDate - startDate) / DAY_IN_MILLISECONDS;
    if (diffInDays > 365) {
      LOG.error(`getVideosViewDetailsByHubId() - Time difference can not be greater then 365 days`);
      return {
        serverError: true
      };
    }

    // Call analytics service in batches
    let analyticsData = [];
    let length = 0;
    let offset = 0;
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await analyticsClient.getAllVideosViewedByHubId(
        accountMappingId,
        hubId,
        startDateStr,
        endDateStr,
        LIMIT,
        offset
      );
      length = response?.rows?.length || 0;
      analyticsData = analyticsData.concat(response?.rows || []);
      offset += LIMIT;
    } while (length > 0 && length === LIMIT);

    // If there is no analytics data, then return empty response
    if (analyticsData.length === 0) {
      return {
        data: [],
        serverError: false
      };
    }

    // Format the analytics data to a map of (videoId - Views)
    const durationMap = getIdValueMap(analyticsData);
    const videoIds = Array.from(durationMap.keys());

    // Call universal-video service to get video details

    // Step 1 : Divide member ids in batches of 200 ids and create its filter string
    const videoMap = new Map<string, Video>();
    for (let i = 0; i < videoIds.length; i += BATCH_SIZE) {
      const batch = videoIds.slice(i, i + BATCH_SIZE);
      const filter = batch.map(id => `id eq "${id}"`).join(' or ');

      // Step 2 : Call universal-video service
      // eslint-disable-next-line no-await-in-loop
      const videosResponse = await videoClient.postVideos({ filter });
      if (videosResponse?.data) {
        videosResponse.data.forEach(video => {
          videoMap.set(video.id.toLowerCase(), video);
        });
      }
    }

    // Step 3 : Create response
    const analyticsResponse: VideoAnalyticsItem[] = [];
    for (const [_key, value] of videoMap) {
      const actualDuration = durationMap.get(_key);
      analyticsResponse.push({
        videoId: value.id.toLowerCase(),
        views: actualDuration,
        videoDuration: Math.round((value.duration || 0) / 1000), // value.duration is in milliseconds hence converted it to seconds
        videoTitle: value.title || '',
        thumbnail: value.generatedThumbnail?.url?.href || ''
      });
    }

    // Sort in descending order of views
    analyticsResponse.sort((a, b) => b.views - a.views);

    return {
      data: analyticsResponse,
      serverError: false
    };
  } catch (error) {
    LOG.error(`getVideosViewCountByHubId() - ${error.message}`);
    return {
      serverError: true
    };
  }
};

export const getMemberVideoWatchDurationByHubId = async (
  { analyticsClient, hubId, startDateStr, endDateStr }: AnalyticsRequestInput,
  videoId: string,
  videoDuration: number,
  accountMappingId: string,
  universalContactClient: UniversalContactsClient
): Promise<MemberWatchDurationData> => {
  try {
    const startDate = Date.parse(startDateStr);
    const endDate = Date.parse(endDateStr);

    const diffInDays = (endDate - startDate) / DAY_IN_MILLISECONDS;
    if (diffInDays > 365) {
      LOG.error(`getMemberVideoWatchDurationByHubId() - Time difference can not be greater then 365 days`);
      return {
        serverError: true
      };
    }

    // Call analytics service in batches
    let analyticsData = [];
    let length = 0;
    let offset = 0;
    do {
      // eslint-disable-next-line no-await-in-loop
      const response = await analyticsClient.getMemberVideoWatchDurationByHubId(
        accountMappingId,
        hubId,
        videoId,
        startDateStr,
        endDateStr,
        LIMIT,
        offset
      );
      length = response?.rows?.length || 0;
      analyticsData = analyticsData.concat(response?.rows || []);
      offset += LIMIT;
    } while (length > 0 && length === LIMIT);

    // If there is no analytics data, then return empty response
    if (analyticsData.length === 0) {
      return {
        data: [],
        serverError: false
      };
    }

    // Create member duration map and unique ids list for member duration
    const memberDuration = getIdValueMap(analyticsData);
    const memberIds = Array.from(memberDuration.keys());

    // Call universal-contact service to get contact details

    // Step 1 : Divide member ids in batches of 200 ids and create its filter string
    const contactMap = new Map();
    for (let i = 0; i < memberIds.length; i += BATCH_SIZE) {
      const batch = memberIds.slice(i, i + BATCH_SIZE);
      const filter = batch.map(id => `id eq "${id}"`).join(' or ');

      // Step 2 : Call universal-contact service
      // eslint-disable-next-line no-await-in-loop
      const contactResponse = await universalContactClient.filterContacts(filter, undefined, BATCH_SIZE);
      if (contactResponse?.data) {
        contactResponse.data.forEach(contact => {
          contactMap.set(contact.id.toLowerCase(), contact);
        });
      }
    }

    // Step 3 : Create response
    const analyticsResponse: MemberVideoWatchData[] = [];
    for (const [_key, value] of contactMap) {
      const actualDuration = memberDuration.get(value.id.toLowerCase());
      analyticsResponse.push({
        id: value.id.toLowerCase(),
        duration: actualDuration > videoDuration ? videoDuration : actualDuration,
        percentage: actualDuration > videoDuration ? 100 : (actualDuration / videoDuration) * 100,
        firstName: value?.firstName,
        lastName: value?.lastName,
        email: value?.email
      });
    }

    // Sort in ascending order of last name
    analyticsResponse.sort((a, b) => a.lastName.localeCompare(b.lastName));

    return {
      data: analyticsResponse,
      serverError: false
    };
  } catch (error) {
    LOG.error(`getMemberVideoWatchDurationByHubId() - ${error.message}`);
    return {
      serverError: true
    };
  }
};
