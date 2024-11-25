import { AppFeature, Resolvers } from '@cvent/planner-event-hubs-model/types';
import { getAppFeatures } from '@server/getAppfeatures';

const resolver: Resolvers = {
  Query: {
    getAppFeatures: async (_parent, args, { auth }): Promise<Array<AppFeature>> => {
      const accountId = auth?.authorization?.metadata?.AccountId;
      return getAppFeatures(accountId, args.appFeatures);
    }
  }
};

export default resolver;
