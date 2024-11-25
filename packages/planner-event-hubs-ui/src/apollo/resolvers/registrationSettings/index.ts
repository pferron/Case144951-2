import { AllowedDomains, Resolvers } from '@cvent/planner-event-hubs-model/types';

const resolver: Resolvers = {
  Mutation: {
    saveEmailDomains: async (_parent, { input }, { dataSources }): Promise<AllowedDomains> => {
      return dataSources.videoCenterClient.saveEmailDomains(input);
    }
  },
  Query: {
    getEmailDomains: async (_parent, { input }, { dataSources }): Promise<AllowedDomains> => {
      return dataSources.videoCenterClient.getEmailDomains(input);
    }
  }
};

export default resolver;
