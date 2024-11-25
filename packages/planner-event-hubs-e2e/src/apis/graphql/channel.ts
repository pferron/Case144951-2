import { ApolloClient, FetchResult, NormalizedCacheObject } from '@apollo/client';
import {
  createCatalogMutation,
  createChannelMutation,
  deleteChannelMutation,
  updateCatalogMutation,
  updateChannelMutation,
  uploadChannelImageMutation
} from '@cvent/planner-event-hubs-model/operations/channel';
import {
  Catalog,
  CatalogInput,
  CatalogOwnerType,
  CatalogType,
  Channel,
  ChannelImage,
  ChannelInput,
  ChannelStatus,
  ImageInput,
  SectionType
} from '@cvent/planner-event-hubs-model/src/types';
import { v4 as uuidV4 } from 'uuid';
import { connectToApiAsPlanner } from '../../utils/authUtils';
import { getConfigs } from '../../../configs/testConfig';
import { uploadFileToS3 } from '../../utils/uploadFileToS3';

const configs = getConfigs();

export const createChannel = async (
  title: string,
  description: string,
  hubId: string
): Promise<FetchResult<Channel>> => {
  const client = await connectToApiAsPlanner();
  return (
    await client.mutate({
      mutation: createChannelMutation,
      variables: {
        hubId,
        title,
        description
      }
    })
  ).data.createChannel;
};

export const uploadChannelImage = async (
  channelId: string,
  imageInput: ImageInput
): Promise<FetchResult<ChannelImage>> => {
  const client = await connectToApiAsPlanner();
  return client.mutate({
    mutation: uploadChannelImageMutation,
    variables: {
      channelId,
      imageInput
    }
  });
};

export const associateCatalogToChannel = async (
  channelId: string,
  catalogInput: CatalogInput
): Promise<FetchResult<Catalog>> => {
  const client = await connectToApiAsPlanner();
  return client.mutate({
    mutation: createCatalogMutation,
    variables: {
      channelId,
      catalogInput
    }
  });
};
export const updateCataloge2e = async (
  channelId: string,
  catalogId: string,
  catalogInput: CatalogInput
): Promise<Catalog> => {
  const client: ApolloClient<NormalizedCacheObject> = await connectToApiAsPlanner();
  const response = await client.mutate({
    mutation: updateCatalogMutation,
    variables: {
      channelId,
      catalogId,
      catalogInput
    }
  });
  expect(response).toBeTruthy();
  expect(response.data).toBeTruthy();
  return response.data.updateCatalog;
};

export const updateChannel = async (channelInput: ChannelInput): Promise<FetchResult<Channel>> => {
  const client = await connectToApiAsPlanner();
  return (
    await client.mutate({
      mutation: updateChannelMutation,
      variables: {
        channelInput
      }
    })
  ).data.createChannel;
};

export const deleteChannel = async (channelId: string): Promise<FetchResult<ChannelImage>> => {
  const client = await connectToApiAsPlanner();
  return client.mutate({
    mutation: deleteChannelMutation,
    variables: {
      channelId
    }
  });
};

export const activateChannel = async (channel: ChannelInput): Promise<void> => {
  const uploadedImage = await uploadFileToS3(channel.id);
  const imageInput = {
    filename: 'channelImage.jpeg',
    size: uploadedImage.data.size,
    url: uploadedImage.data.location
  };
  await uploadChannelImage(channel.id, imageInput);

  const catalogInputData = {
    sections: [
      {
        id: uuidV4(),
        title: 'section 1',
        videos: [{ videoId: configs.videoId }],
        sectionType: SectionType.Default
      }
    ],
    catalogType: CatalogType.List,
    catalogOwner: CatalogOwnerType.VideoHub
  };
  await associateCatalogToChannel(channel.id, catalogInputData);
  await updateChannel({ ...channel, status: ChannelStatus.Active });
};

export const convertChannelToChannelInput = (channel: Channel): ChannelInput => {
  return {
    id: channel?.id,
    title: channel?.title,
    description: channel?.description,
    status: channel?.status
  };
};
