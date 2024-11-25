import {
  AnalyticsData,
  MemberWatchDurationData,
  Resolvers,
  TopVideosResponse,
  VideoCountData,
  ViewsBySourceResponse
} from '@cvent/planner-event-hubs-model/types';
import {
  averageViewDurationByHubId,
  getMemberVideoWatchDurationByHubId,
  getTopFiveVideosViewedByHubId,
  getTotalViewsByHubId,
  getVideosViewDetailsByHubId,
  viewsByDeviceType
} from '@resolvers/common/dataAccess/analytics';
import { getAccountMappingId } from '@utils/authUtils';

const resolver: Resolvers = {
  Query: {
    totalViewsByHubId: async (_parent, args, { dataSources }): Promise<AnalyticsData> => {
      const data = getTotalViewsByHubId({
        analyticsClient: dataSources.analyticsClient,
        hubId: args.input.hubId,
        startDateStr: args.input.startDate,
        endDateStr: args.input.endDate,
        pipeline: args.input?.pipeline
      });
      return data;
    },
    videosViewDetailsByHubId: async (_parent, args, { dataSources, auth }): Promise<VideoCountData> => {
      const accountMappingId = getAccountMappingId(auth);
      return getVideosViewDetailsByHubId(
        {
          analyticsClient: dataSources.analyticsClient,
          hubId: args.input.hubId,
          startDateStr: args.input.startDate,
          endDateStr: args.input.endDate
        },
        accountMappingId,
        dataSources.universalVideoServiceClient
      );
    },
    memberVideoWatchDurationByHubId: async (_parent, args, { dataSources, auth }): Promise<MemberWatchDurationData> => {
      const accountMappingId = getAccountMappingId(auth);
      return getMemberVideoWatchDurationByHubId(
        {
          analyticsClient: dataSources.analyticsClient,
          hubId: args.input.filter.hubId,
          startDateStr: args.input.filter.startDate,
          endDateStr: args.input.filter.endDate
        },
        args.input.videoId,
        args.input.videoDuration,
        accountMappingId,
        dataSources.universalContactsClient
      );
    },
    averageViewDurationByHubId: async (_parent, args, { dataSources }): Promise<AnalyticsData> => {
      const data = averageViewDurationByHubId({
        analyticsClient: dataSources.analyticsClient,
        hubId: args.input.hubId,
        startDateStr: args.input.startDate,
        endDateStr: args.input.endDate,
        pipeline: args.input?.pipeline
      });
      return data;
    },
    viewsByDeviceType: async (_parent, args, { dataSources }): Promise<ViewsBySourceResponse> => {
      const data = viewsByDeviceType({
        analyticsClient: dataSources.analyticsClient,
        hubId: args.input.hubId,
        startDateStr: args.input.startDate,
        endDateStr: args.input.endDate,
        pipeline: args.input?.pipeline
      });
      return data;
    },
    topFiveVideosViewedByHubId: async (_parent, args, { dataSources, auth }): Promise<TopVideosResponse> => {
      const accountMappingId = getAccountMappingId(auth);
      return getTopFiveVideosViewedByHubId(
        {
          analyticsClient: dataSources.analyticsClient,
          hubId: args.input.hubId,
          startDateStr: args.input.startDate,
          endDateStr: args.input.endDate,
          pipeline: args.input?.pipeline
        },
        dataSources.universalVideoServiceClient,
        accountMappingId
      );
    }
  }
};

export default resolver;
