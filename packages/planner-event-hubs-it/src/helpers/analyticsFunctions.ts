import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  memberVideoWatchDurationByHubId,
  videosViewDetailsByHubId
} from '@cvent/planner-event-hubs-model/operations/analytics';
import type { VideoCountData, MemberWatchDurationData } from '@cvent/planner-event-hubs-model/types';

export const videosViewByHubId = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string,
  startDate: string,
  endDate: string
): Promise<VideoCountData> => {
  const response = await client.query({
    query: videosViewDetailsByHubId,
    variables: {
      input: {
        hubId,
        startDate,
        endDate
      }
    }
  });
  return response.data.videosViewDetailsByHubId;
};

export const memberWatchDurationByHubId = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string,
  videoId: string,
  videoDuration: number,
  startDate: string,
  endDate: string
): Promise<MemberWatchDurationData> => {
  const response = await client.query({
    query: memberVideoWatchDurationByHubId,
    variables: {
      input: {
        videoId,
        videoDuration,
        filter: {
          hubId,
          startDate,
          endDate
        }
      }
    }
  });
  return response.data.memberVideoWatchDurationByHubId;
};
