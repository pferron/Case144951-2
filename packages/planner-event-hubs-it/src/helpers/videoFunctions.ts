import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { PaginatedVideos, VideoFilterInput } from '@cvent/planner-event-hubs-model/types';
import { getVideosQuery } from '@cvent/planner-event-hubs-model/operations/video';

export const getVideos = async (
  client: ApolloClient<NormalizedCacheObject>,
  filterInput: VideoFilterInput
): Promise<PaginatedVideos> => {
  const response = await client.query({
    query: getVideosQuery,
    variables: {
      filterInput
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.getVideos;
};
