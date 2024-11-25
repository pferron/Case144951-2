import { Catalog, Resolvers } from '@cvent/planner-event-hubs-model/types';
import { createCatalog, getCatalog, updateCatalog } from '@resolvers/common/dataAccess/catalog';

const resolver: Resolvers = {
  Mutation: {
    createCatalog: async (_parent, args, { dataSources }): Promise<Catalog> => {
      return createCatalog(
        dataSources.channelServiceClient,
        dataSources.universalVideoServiceClient,
        args.channelId,
        args.catalogInput
      );
    },
    updateCatalog: async (_parent, args, { dataSources }): Promise<Catalog> => {
      return updateCatalog(
        dataSources.channelServiceClient,
        dataSources.universalVideoServiceClient,
        args.channelId,
        args.catalogId,
        args.catalogInput
      );
    }
  },
  Query: {
    getCatalog: async (_parent, args, { dataSources }): Promise<Catalog> => {
      return getCatalog(dataSources.universalVideoServiceClient, args.catalogId);
    }
  }
};

export default resolver;
