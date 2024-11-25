import { CustomDomain, CustomDomainMapping, Resolvers } from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('custom-domain-resolver');

const resolver: Resolvers = {
  Query: {
    getCustomDomainForHub: async (_parent, { hubId }, { dataSources }, _info): Promise<CustomDomainMapping> => {
      LOG.debug('Getting custom domain for events plus hub with hub id =', hubId);
      return dataSources.customDomainClient.getCustomDomainForHub(hubId);
    },
    getCustomDomainForAccount: async (_parent, args, { dataSources }, _info): Promise<[CustomDomain]> => {
      LOG.debug('Getting custom domains for an account');
      return dataSources.customDomainClient.getCustomDomainForAccount();
    }
  },
  Mutation: {
    createHubCustomDomainMapping: async (_parent, { input }, { dataSources }): Promise<CustomDomainMapping> => {
      return dataSources.customDomainClient.createCustomDomainMapping(input);
    },
    updateHubCustomDomainMapping: async (_parent, { input }, { dataSources }): Promise<CustomDomainMapping> => {
      return dataSources.customDomainClient.updateCustomDomainMapping(input);
    },
    deleteHubCustomDomainMapping: async (_parent, { hubId }, { dataSources }): Promise<boolean> => {
      return dataSources.customDomainClient.deleteCustomDomainMapping(hubId);
    }
  }
};

export default resolver;
