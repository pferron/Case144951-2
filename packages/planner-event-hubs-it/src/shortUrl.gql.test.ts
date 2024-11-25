import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { authATestAccountOptions, authOptions, connectToApiAsPlanner } from '@helpers/connectToApiAsPlanner';

import { ShortUrlByTag } from '@cvent/planner-event-hubs-model/types';
import { createHub, rawDeleteHub, rawUpdateHub } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';
import { fetchAndCreateShortUrlByTag } from '@cvent/planner-event-hubs-model/src/operations/shortUrl';
import { startsWith } from 'lodash';

let client: ApolloClient<NormalizedCacheObject>;
let clientFromOtherAccount: ApolloClient<NormalizedCacheObject>;
let hubId;
beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientFromOtherAccount = await connectToApiAsPlanner(authATestAccountOptions);
  hubId = await createHub(client, newHubData);
}, 10000);

const fetchAndCreateShortUrlByTagHelper = async (
  clientParam: ApolloClient<NormalizedCacheObject>,
  videoCenterId: string
): Promise<Array<ShortUrlByTag>> => {
  const response = await clientParam.query({
    query: fetchAndCreateShortUrlByTag,
    variables: {
      videoCenterId
    }
  });
  return response.data.fetchAndCreateShortUrlByTag;
};

afterAll(async () => {
  rawDeleteHub(client, { id: hubId });
});

describe('mutation: fetch and create short urls with tags', () => {
  it('Fetch short urls for new cvent domain hub', async () => {
    // Create
    const response = await fetchAndCreateShortUrlByTagHelper(client, hubId);
    expect(response).toBeTruthy();
    expect(response.length).toBe(5);
    expect(startsWith(response[0].shortUrl || '', 'https://staging.cvent.me')).toBeTruthy();

    // Update
    await rawUpdateHub(client, {
      ...newHubData,
      id: hubId,
      config: { ...newHubData.config, url: 'https://t2-penguin.seevent.com/demoint' }
    });
    const customDomainShortUrlResponse = await fetchAndCreateShortUrlByTagHelper(client, hubId);
    expect(customDomainShortUrlResponse).toBeTruthy();
    expect(customDomainShortUrlResponse.length).toBe(5);
    expect(customDomainShortUrlResponse[0].shortUrl).toBe('https://t2-penguin.seevent.com/demoint');
  });

  it('throws not found when called from token of some other account', async () => {
    await expect(async () => fetchAndCreateShortUrlByTagHelper(clientFromOtherAccount, hubId)).rejects.toThrow(
      'Not Found'
    );
  });
});
