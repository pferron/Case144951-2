import {
  getEmailDomainsQuery,
  saveEmailDomainsMutation
} from '@cvent/planner-event-hubs-model/operations/registrationSettings';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { newHubData } from '@fixtures/hubData';
import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { createHub, rawDeleteHub } from '@helpers/hubFunctions';
import { isProductionEnv } from '@utils/commonUtils';
import { UUID } from 'crypto';

const isProduction = isProductionEnv(process.env.ENV);

let client: ApolloClient<NormalizedCacheObject>;
let noAuthClient: ApolloClient<NormalizedCacheObject>;

describe('registrationSettings graph IT', () => {
  let testHubId: UUID;

  beforeEach(async () => {
    testHubId = (await createHub(client, newHubData)) as UUID;
  });

  afterEach(async () => {
    await rawDeleteHub(client, { id: testHubId });
  });

  beforeAll(async () => {
    client = await connectToApiAsPlanner(authOptions);
    noAuthClient = await connectToApiAsPlanner(unauthOptions);
  });

  describe('mutation: saveEmailDomains', () => {
    if (!isProduction) {
      it('requires video-center:write', async () => {
        await expect(
          noAuthClient.mutate({
            mutation: saveEmailDomainsMutation,
            variables: {
              input: {
                id: testHubId,
                emailDomains: ['test.com']
              }
            }
          })
        ).rejects.toThrow('Not authorized');
      });
    }

    it('saves given email domains', async () => {
      const response = await client.mutate({
        mutation: saveEmailDomainsMutation,
        variables: {
          input: {
            id: testHubId,
            emailDomains: ['test.com']
          }
        }
      });

      expect(response?.data?.saveEmailDomains?.emailDomains).toEqual(['test.com']);
    });
  });

  describe('query: getEmailDomains', () => {
    it('fetches emailDomains', async () => {
      const response = await client.query({
        query: getEmailDomainsQuery,
        variables: {
          input: {
            id: testHubId
          }
        }
      });

      expect(response?.data?.getEmailDomains?.emailDomains).toEqual([]);
    });
  });
});
