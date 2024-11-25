import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  authATestAccountOptions,
  authOptions,
  connectToApiAsPlanner,
  unauthOptions
} from '@helpers/connectToApiAsPlanner';
import {
  createHubCustomDomain,
  deleteHubCustomDomain,
  getCustomDomainForAccount,
  getCustomDomainForHub,
  updateHubCustomDomain
} from '@helpers/customDomainFunctions';
import {
  createHubCustomDomainMapping,
  deleteHubCustomDomainMapping,
  updateHubCustomDomainMapping
} from '@cvent/planner-event-hubs-model/operations/customDomain';
import { v4 as uuidV4 } from 'uuid';
import { CustomDomainMappingInput } from '@cvent/planner-event-hubs-model/types';
import { skipDescribeIfProdEnvironment } from '@utils/commonUtils';
import { createHub, rawDeleteHub } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';

let client: ApolloClient<NormalizedCacheObject>;
let clientWithIncorrectRole: ApolloClient<NormalizedCacheObject>;
let clientFromOtherAccount: ApolloClient<NormalizedCacheObject>;
let hubId;
let trailingName;
let hubCustomDomainInput: CustomDomainMappingInput;
beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientWithIncorrectRole = await connectToApiAsPlanner(unauthOptions);
  clientFromOtherAccount = await connectToApiAsPlanner(authATestAccountOptions);
  hubId = await createHub(client, newHubData);
  trailingName = uuidV4().toString();
  hubCustomDomainInput = {
    entityId: hubId,
    customDomainId: process.env.TEST_CUSTOM_DOMAIN_ID as string,
    trailingName
  };
}, 10000);

afterAll(async () => {
  rawDeleteHub(client, { id: hubId });
});

skipDescribeIfProdEnvironment()('mutation: create, get, update and delete hubCustomDomain mapping', () => {
  it('create, get, update, delete hub custom domain mapping', async () => {
    // Create
    const response = await createHubCustomDomain(client, hubCustomDomainInput);
    expect(response.data).toBeTruthy();
    expect(response?.data?.createHubCustomDomainMapping?.entityId).toBe(hubId);
    expect(response?.data?.createHubCustomDomainMapping?.customDomainId).toBe(
      process.env.TEST_CUSTOM_DOMAIN_ID as string
    );
    expect(response?.data?.createHubCustomDomainMapping?.trailingName).toBe(trailingName);

    // Get by hub
    let customDomain = await getCustomDomainForHub(client, hubId);
    expect(customDomain.trailingName).not.toBeNull();

    // Get by account
    const accountCustomDomains = await getCustomDomainForAccount(client);
    expect(accountCustomDomains.length).toBeGreaterThanOrEqual(1);

    // Update
    const updatedTrailingName = uuidV4().toString();
    const updateResponse = await updateHubCustomDomain(client, {
      ...hubCustomDomainInput,
      trailingName: updatedTrailingName
    });
    expect(updateResponse?.data).toBeTruthy();
    expect(updateResponse?.data?.updateHubCustomDomainMapping?.entityId).toBe(hubId);
    expect(updateResponse?.data?.updateHubCustomDomainMapping?.customDomainId).toBe(
      process.env.TEST_CUSTOM_DOMAIN_ID as string
    );

    // Delete
    expect(updateResponse?.data?.updateHubCustomDomainMapping?.trailingName).toBe(updatedTrailingName);
    expect(await deleteHubCustomDomain(client, hubId)).toBeTruthy();

    // Get
    customDomain = await getCustomDomainForHub(client, hubId);
    expect(customDomain).toBeNull();
  });
  it('throws Unauthorized when lacking custom domain roles in bearer', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: createHubCustomDomainMapping,
        variables: { input: hubCustomDomainInput }
      })
    ).rejects.toThrow('403: Forbidden');
  });
  it('throws not found when called from token of some other account', async () => {
    await expect(async () => createHubCustomDomain(clientFromOtherAccount, hubCustomDomainInput)).rejects.toThrow(
      'Not Found'
    );
  });
  it('throws not found when lacking custom domain roles in bearer for update endpoint', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: updateHubCustomDomainMapping,
        variables: { input: hubCustomDomainInput }
      })
    ).rejects.toThrow('403: Forbidden');
  });
  it('throws not found when update called from token of some other account', async () => {
    await expect(async () => updateHubCustomDomain(clientFromOtherAccount, hubCustomDomainInput)).rejects.toThrow(
      'Not Found'
    );
  });
  it('throws Unauthorized when lacking custom domain roles in bearer for delete endpoint', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: deleteHubCustomDomainMapping,
        variables: { hubId }
      })
    ).rejects.toThrow('403: Forbidden');
  });
  it('Should throw not authorized when DOMAIN_READ_WRITE role not present in token', async () => {
    // client does not have a DOMAIN_READ_WRITE role
    await expect(async () => getCustomDomainForHub(clientWithIncorrectRole, hubId)).rejects.toThrow('403: Forbidden');
  });
});
