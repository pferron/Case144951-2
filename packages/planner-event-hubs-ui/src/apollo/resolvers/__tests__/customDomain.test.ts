import { CustomDomainServiceClient } from '@dataSources/customDomain/client';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import customDomainResolver from '@resolvers/customDomain';
import { CustomDomainMapping } from '@cvent/planner-event-hubs-model/types';

let dataSources;

beforeEach(() => {
  dataSources = {
    customDomainClient: new CustomDomainServiceClient()
  };
});
describe('Test get custom domain for account and hubId resolver', () => {
  it('Should get all custom domains for the account', async () => {
    const accountDomainsResponse = [
      {
        accountId: 801539179,
        customDomainId: '993f6087-9e95-4073-8641-bfcf580b6729',
        domainName: 't2-penguin.seevent.com',
        apiGatewayAware: true
      },
      {
        accountId: 801539179,
        customDomainId: '993f6087-9e95-4073-8641-bfcf580b6730',
        domainName: 'hello-world.seevent.com',
        apiGatewayAware: false
      }
    ];
    mockDataSource(dataSources.customDomainClient, 'getCustomDomainForAccount', accountDomainsResponse);

    const accountDomains = await resolveQueryResponse(
      customDomainResolver,
      'getCustomDomainForAccount',
      getMockResolverRequestWithDataSources('Query.getCustomDomainForAccount', dataSources)
    );

    expect(accountDomains).toBeTruthy();
    expect(accountDomains.length).toBe(2);
    expect(accountDomains[0].customDomainId).toBe(accountDomainsResponse[0].customDomainId);
    expect(accountDomains[0].domainName).toBe(accountDomainsResponse[0].domainName);
  });

  it('Should return empty array when no custom domains for the account', async () => {
    const accountDomainsResponse = [];
    mockDataSource(dataSources.customDomainClient, 'getCustomDomainForAccount', accountDomainsResponse);

    const accountDomains = await resolveQueryResponse(
      customDomainResolver,
      'getCustomDomainForAccount',
      getMockResolverRequestWithDataSources('Query.getCustomDomainForAccount', dataSources)
    );

    expect(accountDomains).toBeTruthy();
    expect(accountDomains.length).toBe(0);
  });

  it('Should get custom domain for the hubId', async () => {
    const hubDomainResponse = {
      customDomainId: '993f6087-9e95-4073-8641-bfcf580b6729',
      entityId: '474469db-abbb-4a50-bfb0-fb2c34b26f02',
      trailingName: 'test123'
    };

    mockDataSource(dataSources.customDomainClient, 'getCustomDomainForHub', hubDomainResponse);

    const hubDomain = await resolveQueryResponse(
      customDomainResolver,
      'getCustomDomainForHub',
      getMockResolverRequestWithDataSources('Query.getCustomDomainForHub', dataSources)
    );

    expect(hubDomain).toBeTruthy();
    expect(hubDomain.customDomainId).toBe(hubDomainResponse.customDomainId);
    expect(hubDomain.entityId).toBe(hubDomainResponse.entityId);
    expect(hubDomain.trailingName).toBe(hubDomainResponse.trailingName);
  });

  it('Should return null when no custom domain is for the hubId', async () => {
    const hubDomainResponse = null;
    mockDataSource(dataSources.customDomainClient, 'getCustomDomainForHub', hubDomainResponse);

    const hubDomain = await resolveQueryResponse(
      customDomainResolver,
      'getCustomDomainForHub',
      getMockResolverRequestWithDataSources('Query.getCustomDomainForHub', dataSources)
    );

    expect(hubDomain).toBe(null);
  });
});

describe('createCustomDomainMapping', () => {
  const hubCustomDomain: CustomDomainMapping = {
    entityId: 'de4d0b00-8653-411e-bf45-085ac75bc6dc',
    customDomainId: '297002E5-D953-403E-A38F-E4DD46C6DEAA',
    trailingName: 'goodTrailingName'
  };

  const hubCustomDomainResponseApiResponse = {
    accountDomain: {
      id: '297002E5-D953-403E-A38F-E4DD46C6DEAA'
    },
    id: 'de4d0b00-8653-411e-bf45-085ac75bc6dc',
    customUrlName: 'goodTrailingName'
  };
  it('Should create hub custom domain mapping', async () => {
    mockDataSource(dataSources.customDomainClient, 'post', hubCustomDomainResponseApiResponse);
    const resolverRequest = getMockResolverRequestWithDataSources('createHubCustomDomainMapping', dataSources, {
      input: hubCustomDomain
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    const response = await resolveMutationResponse(
      customDomainResolver,
      'createHubCustomDomainMapping',
      resolverRequest
    );
    expect(response).toStrictEqual(hubCustomDomain);
  });

  it('Should not create hub custom domain mapping: Unauthorized request', async () => {
    mockDataSourceError(dataSources.customDomainClient, 'post', 'Unauthorised', '401');
    const resolverRequest = getMockResolverRequestWithDataSources('createHubCustomDomainMapping', dataSources, {
      input: hubCustomDomain
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveMutationResponse(customDomainResolver, 'createHubCustomDomainMapping', resolverRequest);
    }).rejects.toThrow('Unauthorised');
  });
  it('Should not create hub custom domain mapping: Account domain not found', async () => {
    mockDataSourceError(dataSources.customDomainClient, 'post', 'Not Found', '404');
    const resolverRequest = getMockResolverRequestWithDataSources('createHubCustomDomainMapping', dataSources, {
      input: hubCustomDomain
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveMutationResponse(customDomainResolver, 'createHubCustomDomainMapping', resolverRequest);
    }).rejects.toThrow('Not Found');
  });
});

describe('updateCustomDomainMapping', () => {
  const hubCustomDomain: CustomDomainMapping = {
    entityId: 'de4d0b00-8653-411e-bf45-085ac75bc6dc',
    customDomainId: '297002E5-D953-403E-A38F-E4DD46C6DEAA',
    trailingName: 'goodTrailingName'
  };

  const hubCustomDomainResponseApiResponse = {
    accountDomain: {
      id: '297002E5-D953-403E-A38F-E4DD46C6DEAA'
    },
    id: 'de4d0b00-8653-411e-bf45-085ac75bc6dc',
    customUrlName: 'goodTrailingName'
  };
  it('Should update hub custom domain mapping', async () => {
    mockDataSource(dataSources.customDomainClient, 'put', hubCustomDomainResponseApiResponse);
    const resolverRequest = getMockResolverRequestWithDataSources('updateHubCustomDomainMapping', dataSources, {
      input: hubCustomDomain
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    const response = await resolveMutationResponse(
      customDomainResolver,
      'updateHubCustomDomainMapping',
      resolverRequest
    );
    expect(response).toStrictEqual(hubCustomDomain);
  });

  it('Should not create hub custom domain mapping: Unauthorized request', async () => {
    mockDataSourceError(dataSources.customDomainClient, 'put', 'Unauthorised', '401');
    const resolverRequest = getMockResolverRequestWithDataSources('updateHubCustomDomainMapping', dataSources, {
      input: hubCustomDomain
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveMutationResponse(customDomainResolver, 'updateHubCustomDomainMapping', resolverRequest);
    }).rejects.toThrow('Unauthorised');
  });
  it('Should not create hub custom domain mapping: Account domain not found', async () => {
    mockDataSourceError(dataSources.customDomainClient, 'put', 'Not Found', '404');
    const resolverRequest = getMockResolverRequestWithDataSources('updateHubCustomDomainMapping', dataSources, {
      input: hubCustomDomain
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveMutationResponse(customDomainResolver, 'updateHubCustomDomainMapping', resolverRequest);
    }).rejects.toThrow('Not Found');
  });
});

describe('deleteCustomDomainMapping', () => {
  it('Should delete hub custom domain mapping', async () => {
    mockDataSource(dataSources.customDomainClient, 'delete', true);
    const resolverRequest = getMockResolverRequestWithDataSources('deleteHubCustomDomainMapping', dataSources, {
      hubId: 'de4d0b00-8653-411e-bf45-085ac75bc6dc'
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    const response = await resolveMutationResponse(
      customDomainResolver,
      'deleteHubCustomDomainMapping',
      resolverRequest
    );
    expect(response).toStrictEqual(true);
  });

  it('Should not delete hub custom domain mapping: Unauthorized request', async () => {
    mockDataSourceError(dataSources.customDomainClient, 'delete', 'Unauthorised', '401');
    const resolverRequest = getMockResolverRequestWithDataSources('deleteHubCustomDomainMapping', dataSources, {
      hubId: 'de4d0b00-8653-411e-bf45-085ac75bc6dc'
    });
    dataSources.customDomainClient.context = resolverRequest.context;
    await expect(async () => {
      await resolveMutationResponse(customDomainResolver, 'deleteHubCustomDomainMapping', resolverRequest);
    }).rejects.toThrow('Unauthorised');
  });
});
