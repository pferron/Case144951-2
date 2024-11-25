import { generateAccessToken } from '@cvent/nextjs/server/routes/devLoginApiRoute';
import { constants } from '@cvent/nextjs/auth';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  roles,
  metadata,
  metadataATestAccount,
  grantedAuthorizations,
  ROUTE_COOKIE,
  universalVideoAppId,
  videoHubServiceAppId,
  eventHubsAppId,
  customDomainServiceAppId
} from '@fixtures/authData';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { buildApolloClient } from './buildApolloClient';
import { healthCheck } from './healthCheck';

const { AUTH_COOKIE_NAME, CSRF_HEADER } = constants;

const LOG = LoggerFactory.create('connect-to-api');

export const authOptions = {
  authorization: {
    roles,
    metadata,
    grantedAuthorizations
  }
};

export const authATestAccountOptions = {
  authorization: {
    roles,
    metadata: metadataATestAccount,
    grantedAuthorizations
  }
};

export const unauthOptions = {
  authorization: {
    roles,
    metadata,
    grantedAuthorizations: grantedAuthorizations.map(app => {
      return {
        appId: app.appId,
        roles:
          app.appId === eventHubsAppId ||
          app.appId === universalVideoAppId ||
          app.appId === videoHubServiceAppId ||
          app.appId === customDomainServiceAppId
            ? []
            : app.roles
      };
    })
  }
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAccessToken = async (authDetails: Record<string, any>): Promise<string> => {
  const { accessToken } = await generateAccessToken(
    process.env.AUTH_SERVICE,
    process.env.NORMANDY_API_KEY,
    authDetails
  );
  return accessToken;
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateContext = (accessToken: string): Record<string, any> => {
  return {
    headers: {
      HttpLogRequestId: 'http-log-request-id-planner',
      HttpLogPageLoadId: 'http-log-request-id-planner',
      'Content-Type': 'application/json',
      Cookie: `${constants.AUTH_COOKIE_NAME}=${accessToken}; Path=/; HttpOnly;${ROUTE_COOKIE}`
    }
  };
};

export const connectToApiAsPlanner = async (authDetails): Promise<ApolloClient<NormalizedCacheObject>> => {
  // Run health check to warm up graphql server, helpful for local
  await healthCheck();
  LOG.debug('Auth details', authDetails);
  const { accessToken, csrfToken } = await generateAccessToken(
    process.env.AUTH_SERVICE,
    process.env.NORMANDY_API_KEY,
    authDetails
  );

  LOG.debug(`Generated AccessToken: ${accessToken}`);

  return buildApolloClient({
    Cookie: `${AUTH_COOKIE_NAME}=${accessToken}; Path=/; HttpOnly;${ROUTE_COOKIE}`,
    [CSRF_HEADER]: csrfToken,
    HttpLogRequestId: 'http-log-request-id-planner-event-hubs',
    'x-skip-cache': '1'
  });
};

export const connectToApiAsPlannerWithCaching = async (authDetails): Promise<ApolloClient<NormalizedCacheObject>> => {
  // Run health check to warm up graphql server, helpful for local
  await healthCheck();

  const { accessToken, csrfToken } = await generateAccessToken(
    process.env.AUTH_SERVICE,
    process.env.NORMANDY_API_KEY,
    authDetails
  );

  return buildApolloClient({
    Cookie: `${AUTH_COOKIE_NAME}=${accessToken}; Path=/; HttpOnly;${ROUTE_COOKIE}`,
    [CSRF_HEADER]: csrfToken,
    HttpLogRequestId: 'http-log-request-id-planner'
  });
};

export const clientWithApiKey = async (apiKey: string): Promise<ApolloClient<NormalizedCacheObject>> => {
  await healthCheck();
  const graphUrl = `${process.env.BASE_URL}/api/graphql`;
  return buildApolloClient(
    {
      Authorization: `API_KEY ${apiKey}`,
      HttpLogRequestId: 'http-log-request-id-planner'
    },
    graphUrl
  );
};
