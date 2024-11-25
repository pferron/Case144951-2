import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { Authorization } from '@cvent/auth-client';
import { verifyAccessToken } from '@server/verifyAccessToken';

const LOG = LoggerFactory.create('getAccountBearerToken');

export type AccountTokenDetails = {
  accessToken: string;
  authorization?: Authorization;
};

export const getAccountBearerToken = async (receivedToken: string): Promise<string> => {
  const accountTokenDetail = await getAccountTokenDetails(receivedToken);
  return accountTokenDetail.accessToken;
};

export const getAccountTokenDetails = async (receivedToken: string): Promise<AccountTokenDetails> => {
  if (!receivedToken) {
    throw new Error('Could not create accountBearerToken and no valid receivedToken to return either.');
  }
  try {
    // Verify the received token
    const grantedAccessToken = await verifyAccessToken(receivedToken);

    LOG.debug('Returning original received token');
    return { accessToken: receivedToken, authorization: grantedAccessToken?.authorization };
  } catch (e) {
    LOG.error('Failed to getAccountTokenDetails', e);
    return { accessToken: null, authorization: {} };
  }
};
