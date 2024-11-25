import { IdentityMappingClient } from '@dataSources/identityMappingService/client';

export const getAccountId = async (
  identityMappingClient: IdentityMappingClient,
  accountMappingId: string,
  environment: string
): Promise<string> => {
  return identityMappingClient.getAccountId(accountMappingId, environment);
};
