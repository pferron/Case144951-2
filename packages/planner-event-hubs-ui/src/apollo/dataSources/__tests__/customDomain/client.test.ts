import { mockDataSource, mockDataSourceError } from '@resolvers/common/testUtils/mockRequestData';
import { CustomDomainServiceClient } from '@dataSources/customDomain/client';
import { CustomDomainMapping } from '@cvent/planner-event-hubs-model/types';

describe('CustomDomainServiceClient', () => {
  let dataSource: CustomDomainServiceClient;
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

  beforeEach(() => {
    dataSource = new CustomDomainServiceClient();
    dataSource.context = {
      headers: { AccountId: 'account-id' },
      auth: {
        authorization: {
          metadata: {
            environment: 'unit-test',
            accountId: 'account-Id'
          }
        }
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Get custom domain for hub successfully', async () => {
    const customDomainResponse = {
      id: '474469db-abbb-4a50-bfb0-fb2c34b26f02',
      created: '2023-09-26T13:19:24.360Z',
      createdBy: 'ABC',
      lastModified: '2023-09-26T13:19:24.360Z',
      lastModifiedBy: 'XYZ',
      accountDomain: {
        id: '993f6087-9e95-4073-8641-bfcf580b6729'
      },
      landingPageId: 1,
      customUrlName: 'Testing',
      urlPath: 'test1234567'
    };
    mockDataSource(dataSource, 'get', customDomainResponse);
    await expect(dataSource.getCustomDomainForHub('hubId')).resolves.toStrictEqual({
      entityId: '474469db-abbb-4a50-bfb0-fb2c34b26f02',
      customDomainId: '993f6087-9e95-4073-8641-bfcf580b6729',
      trailingName: 'Testing'
    });
  });

  it('Get custom domain for hub throws error', async () => {
    mockDataSourceError(dataSource, 'get', 'unauthorized', '401');
    await expect(dataSource.getCustomDomainForHub('hubId')).rejects.toThrow('unauthorized');
  });

  it('Get custom domain for hub returns null if mot found', async () => {
    mockDataSourceError(dataSource, 'get', 'Not Found', '404');
    await expect(dataSource.getCustomDomainForHub('hubId')).resolves.toBe(null);
  });

  it('Get custom domains for an account successfully', async () => {
    const accountDomainResponse = [
      {
        customDomainId: '7a1f98ec-79e6-4443-9b63-adc61c3c9dd6',
        domainName: 'graphItTrailingName'
      },
      {
        customDomainId: '993f6087-9e95-4073-8641-bfcf580b6729',
        domainName: 't2-penguin.seevent.com'
      }
    ];
    mockDataSource(dataSource, 'get', accountDomainResponse);
    await expect(dataSource.getCustomDomainForAccount()).resolves.toBe(accountDomainResponse);
  });

  it('Get custom domains for an account throws error', async () => {
    mockDataSourceError(dataSource, 'get', 'unauthorized', '401');
    await expect(dataSource.getCustomDomainForAccount()).rejects.toThrow('unauthorized');
  });
  describe('createCustomDomain endpoint', () => {
    it('Return success response', async () => {
      mockDataSource(dataSource, 'post', hubCustomDomainResponseApiResponse);
      const response = await dataSource.createCustomDomainMapping(hubCustomDomain);
      expect(response).toStrictEqual(hubCustomDomain);
    });
    it('throw unauthorized error', async () => {
      mockDataSourceError(dataSource, 'post', 'unauthorized', '401');

      await expect(async () => {
        await dataSource.createCustomDomainMapping(hubCustomDomain);
      }).rejects.toThrow('unauthorized');
    });
  });

  describe('updateCustomDomain endpoint', () => {
    it('Return success response', async () => {
      mockDataSource(dataSource, 'put', hubCustomDomainResponseApiResponse);
      const response = await dataSource.updateCustomDomainMapping(hubCustomDomain);
      expect(response).toStrictEqual(hubCustomDomain);
    });
    it('throw unauthorized error', async () => {
      mockDataSourceError(dataSource, 'put', 'unauthorized', '401');
      await expect(async () => {
        await dataSource.updateCustomDomainMapping(hubCustomDomain);
      }).rejects.toThrow('unauthorized');
    });
  });

  describe('deleteCustomDomain endpoint', () => {
    it('Return success response', async () => {
      mockDataSource(dataSource, 'delete', true);
      const response = await dataSource.deleteCustomDomainMapping(hubCustomDomain.entityId);
      expect(response).toBeTruthy();
    });
    it('throw unauthorized error', async () => {
      mockDataSourceError(dataSource, 'delete', 'unauthorized', '401');
      await expect(async () => {
        await dataSource.deleteCustomDomainMapping(hubCustomDomain.entityId);
      }).rejects.toThrow('unauthorized');
    });
  });
});
