import {
  AllowedContactGroups,
  AllowedContactTypes,
  DeleteContactTypesResponse,
  BlockedContacts,
  PaginatedContactGroups,
  PaginatedContactsResult,
  PaginatedContactTypes,
  Resolvers,
  Success,
  BlockedContactGroups,
  PagingResponse,
  ContactData,
  ContactGroupData,
  ContactTypesData
} from '@cvent/planner-event-hubs-model/types';

import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CONTACT_GROUP_TYPE } from '@utils/constants';

const LOG = LoggerFactory.create('resolvers/contacts');

const resolver: Resolvers = {
  Mutation: {
    saveContactGroups: async (_parent, { input }, { dataSources }): Promise<AllowedContactGroups> => {
      LOG.debug('saveContactGroups', input);
      return dataSources.videoCenterClient.saveAllowedContactGroups(input);
    },
    saveContactTypes: async (_parent, { input }, { dataSources }): Promise<AllowedContactTypes> => {
      LOG.debug('saveContactTypes', input);
      return dataSources.videoCenterClient.saveAllowedContactTypes(input);
    },
    deleteContactTypes: async (_parent, { input }, { dataSources }): Promise<DeleteContactTypesResponse> => {
      LOG.debug('deleteContactTypes', input);
      await dataSources.videoCenterClient.deleteAllowedContactTypes(input);
      return { deleteContactTypes: true };
    },
    saveBlockedContacts: async (_parent, { input }, { dataSources }): Promise<BlockedContacts> => {
      LOG.debug('saveBlockedContacts', input);
      return dataSources.videoCenterClient.saveBlockedContacts(input);
    },
    deleteBlockedContacts: async (_parent, { input }, { dataSources }): Promise<Success> => {
      LOG.debug('deleteBlockedContacts', input);
      return dataSources.videoCenterClient.deleteBlockedContacts(input);
    },
    saveBlockedContactGroups: async (_parent, { input }, { dataSources }): Promise<BlockedContactGroups> => {
      LOG.debug('saveBlockedContactGroups', input);
      return dataSources.videoCenterClient.saveBlockedContactGroups(input);
    },
    deleteBlockedContactGroups: async (_parent, { input }, { dataSources }): Promise<Success> => {
      LOG.debug('deleteBlockedContactGroups', input);
      return dataSources.videoCenterClient.deleteBlockedContactGroups(input);
    }
  },
  Query: {
    searchContacts: async (_, { input }, { dataSources }): Promise<PaginatedContactsResult> => {
      LOG.debug('searchContacts', input);

      const contactsNotFoundData = {
        paging: {
          currentToken: null,
          totalCount: 0,
          limit: 0
        },
        data: []
      };
      const { searchTerm, limit, token } = input;
      let filter = null;
      if (searchTerm) {
        filter = `firstName CONTAINS '${searchTerm}' OR lastName CONTAINS '${searchTerm}' OR email CONTAINS '${searchTerm}'`;
      }
      const contactsResponse = await dataSources.universalContactsClient.filterContacts(filter, token, limit);
      if (!contactsResponse || !contactsResponse.data) {
        return contactsNotFoundData;
      }
      const contactsData: ContactData[] = contactsResponse.data.map(contact => {
        return {
          id: contact.id.toLowerCase(),
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email
        };
      });

      let contactsPaging: PagingResponse = {
        totalCount: contactsResponse.paging.totalCount,
        currentToken: contactsResponse.paging.currentToken,
        limit: contactsResponse.paging.limit
      };

      if (contactsResponse.paging.nextToken) {
        contactsPaging = { ...contactsPaging, nextToken: contactsResponse.paging.nextToken };
      }

      return {
        paging: contactsPaging,
        data: contactsData
      };
    },
    searchContactGroups: async (_, { input }, { dataSources }): Promise<PaginatedContactGroups> => {
      LOG.debug('searchContactGroups', input);

      const { searchTerm, limit, token, type } = input;
      const contactGroupsNotFoundData = {
        paging: {
          currentToken: null,
          totalCount: 0,
          limit: 0
        },
        data: []
      };
      let filter = `type eq '${type === 'BLACKLIST' ? CONTACT_GROUP_TYPE.BLACKLIST : CONTACT_GROUP_TYPE.STANDARD}'`;
      if (searchTerm) {
        filter = `name CONTAINS '${searchTerm}' and type eq '${
          type === 'BLACKLIST' ? CONTACT_GROUP_TYPE.BLACKLIST : CONTACT_GROUP_TYPE.STANDARD
        }'`;
      }
      const response = await dataSources.universalContactsClient.filterContactGroups(filter, token, limit);
      if (!response || !response.data) {
        return contactGroupsNotFoundData;
      }
      const contactGroupsData: ContactGroupData[] = response.data.map(contactGroup => {
        return {
          id: contactGroup.id.toLowerCase(),
          name: contactGroup.name
        };
      });

      let contactsPaging: PagingResponse = {
        totalCount: response.paging.totalCount,
        currentToken: response.paging.currentToken,
        limit: response.paging.limit
      };

      if (response.paging.nextToken) {
        contactsPaging = { ...contactsPaging, nextToken: response.paging.nextToken };
      }

      return {
        paging: contactsPaging,
        data: contactGroupsData
      };
    },
    searchContactTypes: async (_, { input }, { dataSources }): Promise<PaginatedContactTypes> => {
      const contactTypesNotFoundData = {
        paging: {
          currentToken: null,
          totalCount: 0,
          limit: 0
        },
        data: []
      };
      const { searchTerm, limit, token } = input;
      let filter = null;
      if (searchTerm) {
        filter = `name CONTAINS '${searchTerm}'`;
      }
      const response = await dataSources.universalContactsClient.filterContactTypes(filter, token, limit);
      if (!response || !response.data) {
        return contactTypesNotFoundData;
      }
      const contactTypeData: ContactTypesData[] = response.data.map(contactType => {
        return {
          id: contactType.id.toLowerCase(),
          name: contactType.name
        };
      });

      let contactsPaging: PagingResponse = {
        totalCount: response.paging.totalCount,
        currentToken: response.paging.currentToken,
        limit: response.paging.limit
      };

      if (response.paging.nextToken) {
        contactsPaging = { ...contactsPaging, nextToken: response.paging.nextToken };
      }

      return {
        paging: contactsPaging,
        data: contactTypeData
      };
    },
    getAllowedContactGroups: async (_parent, { input }, { dataSources }): Promise<AllowedContactGroups> => {
      LOG.debug('getAllowedContactGroups', input);
      return dataSources.videoCenterClient.getAllowedContactGroups(input);
    },
    getAllowedContactTypes: async (_parent, { input }, { dataSources }): Promise<AllowedContactTypes> => {
      LOG.debug('getAllowedContactTypes', input);
      return dataSources.videoCenterClient.getAllowedContactTypes(input);
    },
    getBlockedContacts: async (_parent, { input }, { dataSources }): Promise<BlockedContacts> => {
      LOG.debug('getBlockedContacts', input);
      return dataSources.videoCenterClient.getBlockedContacts(input);
    },
    getBlockedContactGroups: async (_parent, { input }, { dataSources }): Promise<BlockedContactGroups> => {
      LOG.debug('getBlockedContactGroups', input);
      return dataSources.videoCenterClient.getBlockedContactGroups(input);
    }
  }
};

export default resolver;
