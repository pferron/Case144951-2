import { AuthMethod } from '@cvent/auth-client';
import type { IncomingHttpHeaders } from 'http';
import { constants } from '@cvent/nextjs/auth';
import cookie from 'cookie';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('auth/readAuthToken');

function getAccessTokenFromAuthCookie(headers: IncomingHttpHeaders): string {
  if (!headers.cookie) {
    return '';
  }
  const requestCookie = cookie.parse(headers.cookie);

  return requestCookie[constants.AUTH_COOKIE_NAME];
}

export const readAuthToken = (
  headers: IncomingHttpHeaders
): {
  authMethod?: string;
  authToken?: string;
} => {
  let authToken;
  let authMethod;

  try {
    if (headers) {
      const lowerCasedHeader = Object.fromEntries(Object.entries(headers).map(([k, v]) => [k.toLowerCase(), v]));

      if (lowerCasedHeader.authorization) {
        [authMethod, authToken] = String(lowerCasedHeader.authorization).split(' ');
      } else if (lowerCasedHeader.cookie) {
        authMethod = AuthMethod.BEARER;
        authToken = getAccessTokenFromAuthCookie(lowerCasedHeader);
      } else {
        LOG.debug('Received request w/o any access token');
      }
    }
  } catch (error) {
    LOG.error('An error was thrown attempting to read auth token', error);
  }

  return { authMethod, authToken };
};
