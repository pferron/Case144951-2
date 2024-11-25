import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import registrationSettingsResolver from '@resolvers/registrationSettings';
import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { saveEmailDomainsData } from './fixtures/saveEmailDomainsData';
import { emailDomainsData } from './fixtures/emailDomainsData';

const saveEmailDomainsResponse = {
  emailDomains: ['a.c.in', 'hotmail.com', 'yahoo.com']
};

const getEmailDomainsResponse = {
  emailDomains: ['a.c.in', 'hotmail.com', 'yahoo.com']
};

const dataSources = {
  videoCenterClient: null
};

describe('Registration settings Resolver', () => {
  beforeEach(() => {
    dataSources.videoCenterClient = new VideoCenterClient();
  });

  it('resolves save email domains mutation', async () => {
    mockDataSource(dataSources.videoCenterClient, 'put', saveEmailDomainsData);
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveEmailDomains', dataSources, {
      input: {
        emailDomains: ['a.c.in', 'hotmail.com', 'yahoo.com'],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    const emailDomains = await resolveMutationResponse(
      registrationSettingsResolver,
      'saveEmailDomains',
      resolverRequest,
      null
    );
    expect(emailDomains).toBeTruthy();
    expect(emailDomains).toEqual(saveEmailDomainsResponse);
  });

  it('throws error if failed to save email domains', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'put', 'failed to save email domains', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveEmailDomains', dataSources, {
      input: {
        emailDomains: ['a.c.in', 'hotmail.com', 'yahoo.com'],
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    await expect(
      resolveMutationResponse(registrationSettingsResolver, 'saveEmailDomains', resolverRequest, null)
    ).rejects.toThrow('failed to save email domains');
  });

  it('resolves get email domains query', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', emailDomainsData);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getEmailDomains', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    const emailDomains = await resolveQueryResponse(
      registrationSettingsResolver,
      'getEmailDomains',
      resolverRequest,
      null
    );
    expect(emailDomains).toBeTruthy();
    expect(emailDomains).toEqual(getEmailDomainsResponse);
  });

  it('throws error if failed to get email domains', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'get', 'failed to get email domains', '400');
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getEmailDomains', dataSources, {
      input: {
        id: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      }
    });
    await expect(
      resolveQueryResponse(registrationSettingsResolver, 'getEmailDomains', resolverRequest, null)
    ).rejects.toThrow('failed to get email domains');
  });
});
