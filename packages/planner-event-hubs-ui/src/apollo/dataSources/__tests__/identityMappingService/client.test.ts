import { IdentityMappingClient } from '@dataSources/identityMappingService/client';
import { mockDataSource, mockDataSourceError } from '@resolvers/common/testUtils/mockRequestData';

const identityMappingServiceClient = new IdentityMappingClient();
const params = {
  environment: 'T2'
};
const testAccount = {
  id: 'test-mapping-id',
  accounts: [
    {
      type: 'CORE',
      id: 'account-id'
    }
  ]
};

describe('Test Identity Mapping Service client', () => {
  it('gets the CORE account ID', async () => {
    mockDataSource(identityMappingServiceClient, 'get', testAccount);
    identityMappingServiceClient.getAccountId(testAccount.id, params.environment);
    expect(identityMappingServiceClient.get).toHaveBeenCalledWith(`accountmapping/${testAccount.id}`, params);
  });

  it('defaults to process.env.EXPERIMENT_ENVIRONMENT when provided environment is blank', async () => {
    mockDataSource(identityMappingServiceClient, 'get', testAccount);
    identityMappingServiceClient.getAccountId(testAccount.id, '');
    expect(identityMappingServiceClient.get).toHaveBeenCalledWith(`accountmapping/${testAccount.id}`, {
      environment: process.env.EXPERIMENT_ENVIRONMENT
    });
  });

  it('throws an error when no accountId is returned', async () => {
    mockDataSourceError(identityMappingServiceClient, 'get', 'Bad Request', '400');
    await expect(async () => {
      await identityMappingServiceClient.getAccountId(testAccount.id, params.environment);
    }).rejects.toThrow('Bad Request');
  });
});
