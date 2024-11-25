import { Channel, ChannelBannerInput } from '@cvent/planner-event-hubs-model/types';
import {
  deleteChannelMutation,
  createChannelMutation,
  createChannelBannerAssociationMutation,
  deleteChannelBannerAssociationMutation
} from '@cvent/planner-event-hubs-model/operations/channel';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

export const createChannel = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string,
  title: string,
  description: string,
  customDomain: string
): Promise<Channel> => {
  const response = await client.mutate({
    mutation: createChannelMutation,
    variables: {
      hubId,
      title,
      description,
      customDomain
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.createChannel;
};
export const deleteChannel = async (
  client: ApolloClient<NormalizedCacheObject>,
  channelId: string
): Promise<boolean> => {
  const response = await client.mutate({
    mutation: deleteChannelMutation,
    variables: {
      channelId
    }
  });
  expect(response).toBeTruthy();
  return response.data.deleteChannel;
};

export const createChannelBannerAssociation = async (
  client: ApolloClient<NormalizedCacheObject>,
  channelBannerInput: ChannelBannerInput
): Promise<string> => {
  const response = await client.mutate({
    mutation: createChannelBannerAssociationMutation,
    variables: {
      input: channelBannerInput
    }
  });

  return response.data;
};

export const deleteChannelBannerAssociation = async (
  client: ApolloClient<NormalizedCacheObject>,
  channelBannerInput: ChannelBannerInput
): Promise<string> => {
  const response = await client.mutate({
    mutation: deleteChannelBannerAssociationMutation,
    variables: {
      input: channelBannerInput
    }
  });

  return response.data;
};
