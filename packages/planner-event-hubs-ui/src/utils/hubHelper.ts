import type { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { Hub } from '@cvent/planner-event-hubs-model/types';
import { GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';

export const getHub = async (client: ApolloClient<NormalizedCacheObject>, id: string): Promise<Hub> => {
  const response = await client.query({
    query: GET_VIDEO_HUB,
    variables: {
      hubID: {
        id
      }
    }
  });
  return response?.data?.hub;
};
