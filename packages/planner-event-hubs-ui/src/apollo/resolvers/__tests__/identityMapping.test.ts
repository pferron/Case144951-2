// RED
import { IdentityMappingClient } from '@dataSources/identityMappingService/client';
import { getAccountId } from '../common/dataAccess/identityMapping';

const identityMappingServiceClient = new IdentityMappingClient();
const params = {
  environment: 'T2'
};
const testAccount = {
  id: 'test-id',
  accounts: [
    {
      type: 'CORE',
      id: 'account-id'
    }
  ]
};

describe('Test Identity Mapping Service client', () => {
  it('gets the CORE account ID', async () => {
    identityMappingServiceClient.get = jest.fn().mockImplementation(async () => testAccount);
    const accountInfo = await getAccountId(identityMappingServiceClient, testAccount.id, params.environment);
    expect(identityMappingServiceClient.get).toHaveBeenCalledWith(`accountmapping/${testAccount.id}`, params);
    expect(accountInfo).toEqual(testAccount.accounts[0].id);
  });
});
