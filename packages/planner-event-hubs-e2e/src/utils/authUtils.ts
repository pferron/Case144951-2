import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AuthClient } from '@cvent/auth-client';
import logger from '@wdio/logger';
import { GrantedAccessToken } from '@cvent/auth-client/src/types';
import type { AccessTokenOptions } from '@cvent/auth-client';
import { getConfigs } from '../../configs/testConfig';
import { buildApolloClient } from './buildApolloClient';
import { loginVideosUsingUI } from './loginVideosUsingUI';

const LOG = logger('test-config');

export async function getAuthOptions() {
  const { grantedAuthorizations, roles, getMetadata } = await import('../../configs/authConfigs');
  return {
    authorization: {
      roles,
      metadata: getMetadata(),
      grantedAuthorizations
    }
  };
}

export type AuthOptions = AccessTokenOptions;

interface TokenProps {
  accessToken: string;
  csrfToken: string;
}
const getTokenFromAuthCookie = async (): Promise<string> => {
  const authCookie = await browser.getNamedCookie('cvent-auth');
  return authCookie.value;
};

const getCSRFForAuthToken = async (authToken: string): Promise<GrantedAccessToken> => {
  const authClient = new AuthClient({
    endpoint: process.env.AUTH_SERVICE as string,
    apiKey: process.env.API_KEY as string
  });
  return authClient.verifyAccessToken({ accessToken: authToken });
};

export const getAuthFromCookie = async (): Promise<TokenProps> => {
  const accessToken = await getTokenFromAuthCookie();
  const grantedAccessToken = await getCSRFForAuthToken(accessToken);
  return {
    accessToken,
    csrfToken: grantedAccessToken.csrfToken
  };
};

export const getBearerToken = async (authDetails: AuthOptions): Promise<TokenProps> => {
  if (process.env.bearerToken && process.env.csrfToken) {
    return {
      accessToken: process.env.bearerToken,
      csrfToken: process.env.csrfToken
    };
  }
  const authClient = new AuthClient({
    endpoint: process.env.AUTH_SERVICE as string,
    apiKey: process.env.NORMANDY_API_KEY as string
  });
  const { accessToken, csrfToken } = await authClient.createAccessToken(authDetails);

  process.env.bearerToken = accessToken;
  process.env.csrfToken = csrfToken;
  return {
    accessToken,
    csrfToken
  };
};

export const connectToApiAsPlanner = async (
  authDetails?: AuthOptions
): Promise<ApolloClient<NormalizedCacheObject>> => {
  const authOptions = authDetails || (await getAuthOptions());
  const configs = getConfigs();
  const authClient = new AuthClient({
    endpoint: process.env.AUTH_SERVICE as string,
    apiKey: process.env.NORMANDY_API_KEY as string
  });
  const { accessToken, csrfToken } = await authClient.createAccessToken(authOptions);

  LOG.info('CONFIGS IN CONNECTTOAPI', configs);
  return buildApolloClient({
    Cookie: `cvent-auth=${accessToken}; Path=/; HttpOnly;${configs.routeCookie}`,
    'X-Cvent-CSRF': csrfToken,
    HttpLogRequestId: 'http-log-request-id-planner-e2e'
  });
};

export const loginUsingCookie = async (): Promise<void> => {
  const configs = getConfigs();
  await browser.url(`${configs.baseUrl}/login`);
  await browser.deleteCookies();
  // deleteCookies is sometimes interferring with the login.
  // It is supposed to wait but a small delay fixes the login issues.
  await browser.pause(500);
  const { accessToken } = await getBearerToken(await getAuthOptions());
  await browser.setCookies({
    name: 'cvent-auth',
    value: accessToken,
    path: '/',
    secure: true,
    httpOnly: true
  });

  if (process.env.CVENT_VERSION) {
    await browser.setCookies({
      name: 'CVENT_VERSION',
      value: process.env.CVENT_VERSION
    });
  }
  LOG.info('ACCESS TOKEN GENERATED', accessToken);
  await browser.url(configs.baseUrl);
  await browser.pause(500);
  expect(await browser.getUrl()).not.toContain('/login');
};

export const loginAsPlanner = async (): Promise<void> => {
  if (process.env.ENV === 'ci' || process.env.ENV === 'dev') return loginUsingCookie();
  return loginVideosUsingUI();
};
