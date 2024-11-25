import { Catalog, CatalogInput, VideoStatus } from '@cvent/planner-event-hubs-model/types';
import { spliceIntoChunks } from '@resolvers/common/utils/filterCreationUtil';
import { ChannelServiceClient } from '@dataSources/channelService/client';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';

const getUpdatedCatalog = async (
  universalVideoCatalogClient: UniversalVideoServiceClient,
  catalog: Catalog
): Promise<Catalog> => {
  const listOfVideos = [];

  const filteredSections = catalog?.sections?.map(section => {
    const videos = section?.videos
      ?.filter(video => video.status === VideoStatus.Available)
      .map(video => {
        listOfVideos.push(video.videoId);
        return video;
      });
    return {
      ...section,
      videoCount: videos?.length ?? 0,
      videos
    };
  });

  // fetch video name for catalog videos
  if (listOfVideos.length === 0) {
    return {
      ...catalog,
      sections: filteredSections
    };
  }
  const videoIdChunks: Array<Array<string>> = spliceIntoChunks(listOfVideos, 19);
  const videoDataMap: Map<string, { title: string; thumbnail: string; created: string }> = new Map();
  for (const videoIdChunk of videoIdChunks) {
    // FIREBALL
    // eslint-disable-next-line no-await-in-loop
    const result = await universalVideoCatalogClient.fetchVideos(videoIdChunk);
    result.forEach(res => {
      videoDataMap.set(res.id, {
        title: res.title,
        thumbnail: res.thumbnail?.url?.href || res.generatedThumbnail?.url?.href,
        created: res.created
      });
    });
  }

  // catalog updated with video name
  const updateSections = filteredSections?.map(section => {
    const videos = section.videos?.map(video => {
      return {
        ...video,
        displayName: videoDataMap.get(video.videoId)?.title || '',
        thumbnail: videoDataMap.get(video.videoId)?.thumbnail,
        created: videoDataMap.get(video.videoId)?.created
      };
    });

    return {
      ...section,
      videos
    };
  });

  return {
    ...catalog,
    sections: updateSections
  };
};

export const createCatalog = async (
  channelClient: ChannelServiceClient,
  universalVideoCatalogClient: UniversalVideoServiceClient,
  channelId: string,
  catalogInput: CatalogInput
): Promise<Catalog> => {
  const catalog = await universalVideoCatalogClient.createCatalog(catalogInput);
  await channelClient.associateChannelCatalog(channelId, catalog.id);
  return getUpdatedCatalog(universalVideoCatalogClient, catalog);
};

export const updateCatalog = async (
  channelClient: ChannelServiceClient,
  universalVideoCatalogClient: UniversalVideoServiceClient,
  channelId: string,
  catalogId: string,
  catalogInput: CatalogInput
): Promise<Catalog> => {
  // find any section which has at-least 1 video
  const isVideoPresent = !!catalogInput?.sections.find(section => section?.videos?.length > 0);
  if (!isVideoPresent) {
    await channelClient.disassociateChannelCatalog(channelId, catalogId);
    await universalVideoCatalogClient.deleteCatalog(catalogId);
    return null;
  }
  const catalog = await universalVideoCatalogClient.updateCatalog(catalogId, catalogInput);
  return getUpdatedCatalog(universalVideoCatalogClient, catalog);
};

export const getCatalog = async (
  universalVideoCatalogClient: UniversalVideoServiceClient,
  catalogId: string
): Promise<Catalog> => {
  const catalog = await universalVideoCatalogClient.getCatalog(catalogId);
  return getUpdatedCatalog(universalVideoCatalogClient, catalog);
};
