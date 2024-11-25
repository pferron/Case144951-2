import { EntityImage, Resolvers } from '@cvent/planner-event-hubs-model/types';
import { deleteEntityImage, uploadEntityImage, getEntityImage } from '@resolvers/common/dataAccess/entityMedia';

const resolver: Resolvers = {
  Query: {
    getEntityImage: async (_parent, args, { dataSources }): Promise<EntityImage> => {
      return getEntityImage(dataSources.entityImagesServiceClient, args.entity);
    }
  },
  Mutation: {
    deleteEntityImage: async (_parent, args, { dataSources }): Promise<boolean> => {
      return deleteEntityImage(dataSources.entityImagesServiceClient, args.imageId);
    },
    uploadEntityImage: async (_parent, args, { dataSources }): Promise<EntityImage> => {
      return uploadEntityImage(dataSources.entityImagesServiceClient, args.imageInput);
    }
  }
};

export default resolver;
