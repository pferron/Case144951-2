import {
  Catalog,
  Channel,
  ChannelBannerOutput,
  ChannelImage,
  ChannelInformation,
  ChannelInput,
  ChannelOrder,
  ChannelOrderInput,
  FilterInput,
  ImageInput,
  MemberPaginatedChannels,
  PlannerPaginatedChannels,
  VideoHubChannel
} from '@cvent/planner-event-hubs-model/types';
import {
  getVideoCenterChannelPageShortUrlTag,
  getVideoCenterMemberChannelPageUrl
} from '@resolvers/common/utils/urlUtils';
import { PaginatedChannels, VideoCenterClient } from '@dataSources/videoCenterService/client';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { createFilterQuery, spliceIntoChunks } from '@resolvers/common/utils/filterCreationUtil';
import { ChannelServiceClient } from '@dataSources/channelService/client';
import { WeeClient } from '@dataSources/weeService/client';
import { isEmpty } from 'lodash';
import { isProduction } from '@utils/environmentUtil';
import { LoggerFactory } from '@cvent/auth-client';

const LOG = LoggerFactory.create('channels');

export const getChannelInformation = async (
  channelClient: ChannelServiceClient,
  channelId: string
): Promise<ChannelInformation> => {
  const channelDataPromise = channelClient.getChannel(channelId);
  const channelImageDataPromise = channelClient.getChannelImage(channelId);

  const [channelData, channelImageData] = await Promise.all([channelDataPromise, channelImageDataPromise]);

  return {
    id: channelData.id,
    title: channelData.title,
    description: channelData.description,
    status: channelData.status,
    catalogId: channelData.catalogId,
    image: channelImageData && {
      imageId: channelImageData.id,
      filename: channelImageData.filename,
      size: channelImageData.size,
      url: channelImageData.optimizedUrl,
      createdAt: channelImageData.createdAt
    }
  };
};

export const createChannel = async (
  channelClient: ChannelServiceClient,
  weeClient: WeeClient,
  hubId: string,
  title: string,
  description: string,
  customDomain: string,
  environment: string
): Promise<Channel> => {
  LOG.debug('custom domain:{}, hubId:{}', customDomain, hubId);
  const channelData = await channelClient.createChannel(title, description);
  let url = getVideoCenterMemberChannelPageUrl(hubId, channelData.id, customDomain);
  const tags = getVideoCenterChannelPageShortUrlTag(hubId, channelData.id);

  if (!isEmpty(environment) && !isProduction()) {
    url = `${url}?env=${environment}`;
  }
  LOG.debug('Custom Domain Url for hubId', url, hubId);

  const shortUrlResponse = await weeClient.createShortUrl(url, [tags], !!customDomain);

  await channelClient.associateChannelHub(hubId, channelData.id, shortUrlResponse.shortUrl);
  return {
    id: channelData.id,
    title: channelData.title,
    description: channelData.description,
    status: channelData.status,
    catalogId: channelData.catalogId,
    imageUrl: channelData.imageUrl
  };
};

/* As a video can be deleted from the Video Library/Manage Storage, there is a possibility
   that a catalog is associated with a channel but does not have any valid video in it.
   To cater to this scenario, we need to verify the video count as well. */
const filterChannelsWithVideos = async (
  channels: VideoHubChannel[],
  universalVideoCatalogClient: UniversalVideoServiceClient
): Promise<VideoHubChannel[]> => {
  const channelsWithCatalogId = channels.filter(item => item.catalogId != null);
  if (channelsWithCatalogId?.length > 0) {
    const chunksOf20CatalogIds = spliceIntoChunks(
      channelsWithCatalogId.map(channel => channel.catalogId),
      20
    );
    const catalogIdsWithVideos = [];
    for (const catalogIds of chunksOf20CatalogIds) {
      const catalogFilterQuery = createFilterQuery('id', catalogIds);
      // FIREBALL
      // eslint-disable-next-line no-await-in-loop
      const catalogs: Catalog[] = await universalVideoCatalogClient.listCatalogs(catalogFilterQuery);
      catalogs
        .filter(catalog => catalog.sectionCount > 0)
        .forEach(catalog => {
          for (let i = 0; i < catalog.sections.length; i++) {
            if (catalog.sections[i].videoCount > 0) {
              catalogIdsWithVideos.push(catalog.id);
              break;
            }
          }
        });
    }
    return channelsWithCatalogId.filter(channel => catalogIdsWithVideos.includes(channel.catalogId));
  }
  return [];
};

// Consider moving this to dataSources/channelUtils.ts or if unlikely to be re-used, directly to the resolver.
export const getMemberPaginatedChannels = async (
  videoCenterClient: VideoCenterClient,
  universalVideoCatalogClient: UniversalVideoServiceClient,
  hubId: string,
  filterInput: FilterInput
): Promise<MemberPaginatedChannels> => {
  let pagingResponse: PaginatedChannels;
  let filter: FilterInput = filterInput;
  const channelList: VideoHubChannel[] = [];
  // Step:01 Fetch list of channels for the hub
  // Step:02 Filter out channels having videos associated with it
  // Step:03 If the count is less than the filter input. Repeat Step:01, till
  // the count becomes more than the limit or no more channels are available in hub
  do {
    // FIREBALL
    // eslint-disable-next-line no-await-in-loop
    pagingResponse = await videoCenterClient.filterChannels(hubId, filter, false);
    // FIREBALL
    // eslint-disable-next-line no-await-in-loop
    channelList.push(...(await filterChannelsWithVideos(pagingResponse.data, universalVideoCatalogClient)));
    filter = {
      token: pagingResponse.paging.nextToken
    };
  } while (channelList.length < filterInput.limit && filter.token != null);
  return {
    paging: pagingResponse.paging,
    data: channelList
  };
};

export const getPlannerPaginatedChannels = async (
  videoCenterClient: VideoCenterClient,
  hubId: string,
  filterInput: FilterInput
): Promise<PlannerPaginatedChannels> => {
  const pagingResponse = await videoCenterClient.filterChannels(hubId, filterInput);
  const plannerChannels = pagingResponse.data.map(value => {
    return {
      id: value.id,
      title: value.title,
      description: value.description,
      status: value.status,
      catalogId: value.catalogId,
      imageUrl: value.imageUrl,
      order: value.order,
      videoCount: 0
    };
  });
  return {
    paging: pagingResponse.paging,
    data: plannerChannels
  };
};

export const deleteChannelImage = async (
  channelClient: ChannelServiceClient,
  channelId: string,
  imageId: string
): Promise<boolean> => {
  await channelClient.deleteChannelImage(channelId, imageId);
  return true;
};
export const deleteChannel = async (channelClient: ChannelServiceClient, channelId: string): Promise<boolean> => {
  await channelClient.deleteChannel(channelId);
  return true;
};

export const uploadChannelImage = async (
  channelClient: ChannelServiceClient,
  channelId: string,
  image: ImageInput
): Promise<ChannelImage> => {
  const channelImageData = await channelClient.uploadChannelImage(channelId, image);
  return {
    imageId: channelImageData.id,
    url: channelImageData.optimizedUrl,
    filename: channelImageData.filename,
    size: channelImageData.size,
    createdAt: channelImageData.createdAt
  };
};

export const updateChannel = async (
  channelClient: ChannelServiceClient,
  channelInput: ChannelInput
): Promise<Channel> => {
  const channelData = await channelClient.updateChannel(channelInput);
  return {
    id: channelData.id,
    title: channelData.title,
    description: channelData.description,
    status: channelData.status,
    catalogId: channelData.catalogId,
    imageUrl: channelData.imageUrl
  };
};

export const createChannelBannerAssociation = async (
  channelClient: ChannelServiceClient,
  channelBannerInput: ChannelBannerOutput
): Promise<ChannelBannerOutput> => {
  await channelClient.createChannelBannerAssociation(channelBannerInput);
  return channelBannerInput;
};

export const deleteChannelBannerAssociation = async (
  channelClient: ChannelServiceClient,
  channelBannerInput: ChannelBannerOutput
): Promise<ChannelBannerOutput> => {
  await channelClient.deleteChannelBannerAssociation(channelBannerInput);
  return channelBannerInput;
};

export const updateChannelOrder = async (
  videoCenterClient: VideoCenterClient,
  hubId: string,
  channelOrderInputList: Array<ChannelOrderInput>
): Promise<Array<ChannelOrder>> => {
  return videoCenterClient.updateChannelsOrder(hubId, channelOrderInputList);
};
