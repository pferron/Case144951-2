import { CvestDataSource } from '@dataSources/CvestDataSource';
import { ChannelBannerInput, ChannelInput, ChannelStatus, ImageInput } from '@cvent/planner-event-hubs-model/types';
import { getRequestOptionsWithCacheOptions } from '@utils/util';
import { NOT_FOUND_ERROR_CODE } from '@utils/constants';

export interface ChannelResponse {
  id: string;
  status: ChannelStatus;
  catalogId: string;
  title: string;
  description: string;
  imageUrl: string;
  banners: string[];
}

export interface ImageResponse {
  id: string;
  relativePath: string;
  optimizedUrl: string;
  createdAt: string;
  filename: string;
  size: number;
}

export class ChannelServiceClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.VIDEO_HUB_SERVICE}/v1/`;
  }

  getChannel = async (channelId: string): Promise<ChannelResponse> => {
    return this.get(`channels/${channelId}`, {}, getRequestOptionsWithCacheOptions(false, {}));
  };

  getChannelImage = async (channelId: string): Promise<ImageResponse> => {
    // We don't want to throw error if no image is added to a channel
    try {
      return await this.get(`channels/${channelId}/images`, {}, getRequestOptionsWithCacheOptions(false, {}));
    } catch (e) {
      if (e.code === NOT_FOUND_ERROR_CODE) {
        return null;
      }
      throw e;
    }
  };

  createChannel = async (title: string, description: string): Promise<ChannelResponse> => {
    return this.post('channels', { title, description });
  };

  deleteChannelImage = async (channelId: string, imageId: string): Promise<void> => {
    return this.delete(`channels/${channelId}/images/${imageId}`);
  };

  associateChannelHub = async (hubId: string, channelId: string, shortUrl: string): Promise<void> => {
    return this.post(`channels/${channelId}/video-hubs/${hubId}`, { shortUrl });
  };

  deleteChannel = async (channelId: string): Promise<void> => {
    return this.delete(`channels/${channelId}`);
  };

  uploadChannelImage = async (channelId: string, image: ImageInput): Promise<ImageResponse> => {
    return this.post(`channels/${channelId}/images`, image);
  };

  updateChannel = async (channelInput: ChannelInput): Promise<ChannelResponse> => {
    return this.put(`channels/${channelInput.id}`, channelInput);
  };

  associateChannelCatalog = async (channelId: string, catalogId: string): Promise<void> => {
    return this.post(`channels/${channelId}/catalogs/${catalogId}`);
  };

  disassociateChannelCatalog = async (channelId: string, catalogId: string): Promise<void> => {
    return this.delete(`channels/${channelId}/catalogs/${catalogId}`);
  };

  createChannelBannerAssociation = async (channelBannerInput: ChannelBannerInput): Promise<void> => {
    return this.put(`channels/${channelBannerInput.channel}/banners/${channelBannerInput.banner}`, {
      channel: { id: channelBannerInput.channel },
      banner: { id: channelBannerInput.banner },
      order: channelBannerInput.order
    });
  };

  deleteChannelBannerAssociation = async (channelBannerInput: ChannelBannerInput): Promise<void> => {
    return this.delete(`channels/${channelBannerInput.channel}/banners/${channelBannerInput.banner}`);
  };
}
