import { Resolvers, ShortUrlByTag } from '@cvent/planner-event-hubs-model/types';
import { fetchAndCreateShortUrlByTag } from '@resolvers/common/dataAccess/shortUrl';

const resolver: Resolvers = {
  Query: {
    fetchAndCreateShortUrlByTag: async (_parent, args, { dataSources }): Promise<Array<ShortUrlByTag>> => {
      return fetchAndCreateShortUrlByTag(args.videoCenterId, dataSources.weeClient, dataSources.videoCenterClient);
    }
  }
};

export default resolver;
