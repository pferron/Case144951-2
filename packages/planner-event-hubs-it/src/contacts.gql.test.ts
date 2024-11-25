import {
  searchContactsQuery,
  searchContactGroupsQuery,
  saveContactTypesMutation,
  saveBlockedContactsMutation,
  saveBlockedContactGroupsMutation
} from '@cvent/planner-event-hubs-model/operations/contacts';
import {
  BlockedContactGroupsInput,
  BlockedContactsInput,
  ContactTypesInput
} from '@cvent/planner-event-hubs-model/types';
import { newHubData } from '@fixtures/hubData';
import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { createHub, rawDeleteHub } from '@helpers/hubFunctions';
import { isProductionEnv } from '@utils/commonUtils';
import { UUID, randomUUID } from 'crypto';

const isProduction = isProductionEnv(process.env.ENV);
let client;
let noAuthClient;

describe('Contacts graph IT', () => {
  beforeAll(async () => {
    client = await connectToApiAsPlanner(authOptions);
    noAuthClient = await connectToApiAsPlanner(unauthOptions);
  });

  describe('saveContactTypes', () => {
    let contactTypes: ContactTypesInput;
    let testHubId: UUID;

    beforeEach(async () => {
      testHubId = (await createHub(client, newHubData)) as UUID;
    });

    afterEach(async () => {
      await rawDeleteHub(client, { id: testHubId });
    });

    if (!isProduction) {
      it('requires video-center:write', async () => {
        await expect(
          noAuthClient.mutate({
            mutation: saveContactTypesMutation,
            variables: {
              saveInput: { id: testHubId, contactTypes: [randomUUID()] },
              deleteInput: { id: testHubId, contactTypes: [randomUUID()] }
            }
          })
        ).rejects.toThrow('Not authorized');
      });
    }

    it('adds contactTypes provided in saveInput', async () => {
      contactTypes = {
        id: testHubId,
        contactTypes: [randomUUID()]
      };

      const response = await client.mutate({
        mutation: saveContactTypesMutation,
        variables: {
          saveInput: contactTypes,
          deleteInput: { id: testHubId, contactTypes: [] }
        }
      });

      expect(response.data?.saveContactTypes?.contactTypes).toEqual(contactTypes.contactTypes);
      expect(response.data?.deleteContactTypes?.deleteContactTypes).toBeTruthy();
    });
  });

  describe('saveBlockedContacts', () => {
    let blockedContacts: BlockedContactsInput;
    let testHubId: UUID;

    beforeEach(async () => {
      testHubId = (await createHub(client, newHubData)) as UUID;
    });

    afterEach(async () => {
      await rawDeleteHub(client, { id: testHubId });
    });

    if (!isProduction) {
      it('requires video-center:write', async () => {
        await expect(
          noAuthClient.mutate({
            mutation: saveBlockedContactsMutation,
            variables: {
              saveInput: { id: testHubId, blockedContacts: [randomUUID()] },
              deleteInput: { id: testHubId, blockedContacts: [randomUUID()] }
            }
          })
        ).rejects.toThrow('Not authorized');
      });
    }

    it('adds blockedContacts provided in saveInput', async () => {
      const availableContacts = await client.query({
        query: searchContactsQuery,
        variables: {
          input: {
            searchTerm: 'test',
            limit: 1
          }
        }
      });

      blockedContacts = {
        id: testHubId,
        blockedContacts: [availableContacts.data.searchContacts.data[0].id]
      };

      const response = await client.mutate({
        mutation: saveBlockedContactsMutation,
        variables: {
          saveInput: blockedContacts,
          deleteInput: { id: testHubId, blockedContacts: [] }
        }
      });

      expect(response.data?.saveBlockedContacts?.blockedContacts).toEqual([
        blockedContacts.blockedContacts[0]?.toLowerCase()
      ]);
      expect(response.data?.deleteBlockedContacts.success).toBeTruthy();
    });
  });

  describe('saveBlockedContactGroups', () => {
    let blockedContactGroups: BlockedContactGroupsInput;
    let testHubId: UUID;

    beforeEach(async () => {
      testHubId = (await createHub(client, newHubData)) as UUID;
    });

    afterEach(async () => {
      await rawDeleteHub(client, { id: testHubId });
    });

    if (!isProduction) {
      it('requires video-center:write', async () => {
        await expect(
          noAuthClient.mutate({
            mutation: saveBlockedContactGroupsMutation,
            variables: {
              saveInput: { id: testHubId, blockedContactGroups: [randomUUID()] },
              deleteInput: { id: testHubId, blockedContactGroups: [randomUUID()] }
            }
          })
        ).rejects.toThrow('Not authorized');
      });
    }

    it('adds blockedContactGroups provided in saveInput', async () => {
      const availableContactGroups = await client.query({
        query: searchContactGroupsQuery,
        variables: {
          input: {
            searchTerm: 'Standard Contact Group SG1',
            limit: 1
          }
        }
      });

      blockedContactGroups = {
        id: testHubId,
        blockedContactGroups: [availableContactGroups.data.searchContactGroups.data[0].id]
      };

      const response = await client.mutate({
        mutation: saveBlockedContactGroupsMutation,
        variables: {
          saveInput: blockedContactGroups,
          deleteInput: { id: testHubId, blockedContactGroups: [] }
        }
      });

      expect(response.data?.saveBlockedContactGroups?.contactGroups).toEqual([
        blockedContactGroups.blockedContactGroups[0]?.toLowerCase()
      ]);
      expect(response.data?.deleteBlockedContactGroups.success).toBeTruthy();
    });
  });

  describe('searchContacts', () => {
    it('should throw error searching contacts if required role in missing', async () => {
      await expect(
        noAuthClient.query({
          query: searchContactsQuery,
          variables: {
            input: {
              searchTerm: 'test',
              limit: 10
            }
          }
        })
      ).rejects.toThrow('Not authorized');
    });

    it('should list contacts for given account and searchCriteria', async () => {
      const { data: response } = await client.query({
        query: searchContactsQuery,
        variables: {
          input: {
            searchTerm: 'test',
            limit: 10
          }
        }
      });

      expect(response).toBeTruthy();
      expect(response.searchContacts).toBeTruthy();
      expect(response.searchContacts.data).toBeTruthy();
      expect(response.searchContacts.data[0].firstName).toMatch(/.*test.*/i);
    });
  });

  describe('searchContactGroups', () => {
    it('should throw error searching contact groups if required role in missing', async () => {
      await expect(
        noAuthClient.query({
          query: searchContactGroupsQuery,
          variables: {
            input: {
              searchTerm: 'cvent',
              limit: 10
            }
          }
        })
      ).rejects.toThrow('Not authorized');
    });

    it('should list contact groups for given account and searchCriteria', async () => {
      const { data: response } = await client.query({
        query: searchContactGroupsQuery,
        variables: {
          input: {
            searchTerm: 'Standard Contact Group SG1',
            limit: 10
          }
        }
      });

      expect(response).toBeTruthy();
      expect(response.searchContactGroups).toBeTruthy();
      expect(response.searchContactGroups.data).toBeTruthy();
      expect(response.searchContactGroups.data[0].name).toEqual('Standard Contact Group SG1');
    });
  });
});
