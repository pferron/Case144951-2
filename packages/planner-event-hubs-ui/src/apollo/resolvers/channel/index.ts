import {
  Channel,
  ChannelInformation,
  PlannerPaginatedChannels,
  Resolvers,
  ChannelImage,
  ChannelBannerOutput,
  ChannelOrder
} from '@cvent/planner-event-hubs-model/types';
import {
  getChannelInformation,
  createChannel,
  getPlannerPaginatedChannels,
  deleteChannelImage,
  deleteChannel,
  uploadChannelImage,
  updateChannel,
  createChannelBannerAssociation,
  deleteChannelBannerAssociation,
  updateChannelOrder
} from '@resolvers/common/dataAccess/channel';
import { getEnvironment } from '@resolvers/common/utils/authMetadataUtils';

const resolver: Resolvers = {
  Query: {
    getChannelInformation: async (_parent, args, { dataSources }): Promise<ChannelInformation> => {
      return getChannelInformation(dataSources.channelServiceClient, args.channelId);
    },
    getPlannerPaginatedChannels: async (_parent, args, { dataSources }): Promise<PlannerPaginatedChannels> => {
      return getPlannerPaginatedChannels(dataSources.videoCenterClient, args.hubId, args.filterInput);
    }
  },
  Mutation: {
    createChannel: async (_parent, args, { auth, dataSources }): Promise<Channel> => {
      return createChannel(
        dataSources.channelServiceClient,
        dataSources.weeClient,
        args.hubId,
        args.title,
        args.description,
        args.customDomain,
        getEnvironment(auth)
      );
    },
    deleteChannelImage: async (_parent, args, { dataSources }): Promise<boolean> => {
      return deleteChannelImage(dataSources.channelServiceClient, args.channelId, args.imageId);
    },
    deleteChannel: async (_parent, args, { dataSources }): Promise<boolean> => {
      return deleteChannel(dataSources.channelServiceClient, args.channelId);
    },
    uploadChannelImage: async (_parent, args, { dataSources }): Promise<ChannelImage> => {
      return uploadChannelImage(dataSources.channelServiceClient, args.channelId, args.imageInput);
    },
    updateChannel: async (_parent, args, { dataSources }): Promise<Channel> => {
      return updateChannel(dataSources.channelServiceClient, args.channelInput);
    },
    createChannelBannerAssociation: async (_parent, args, { dataSources }): Promise<ChannelBannerOutput> => {
      return createChannelBannerAssociation(dataSources.channelServiceClient, args.input);
    },
    deleteChannelBannerAssociation: async (_parent, args, { dataSources }): Promise<ChannelBannerOutput> => {
      return deleteChannelBannerAssociation(dataSources.channelServiceClient, args.input);
    },
    updateChannelOrder: async (_parent, args, { dataSources }): Promise<Array<ChannelOrder>> => {
      return updateChannelOrder(dataSources.videoCenterClient, args.hubId, args.channelOrderInputList);
    }
  }
};

export default resolver;
