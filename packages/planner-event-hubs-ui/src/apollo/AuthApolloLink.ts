import { setContext } from '@apollo/client/link/context';
import { ApolloLink } from '@apollo/client/link/core';
import { getItem, setItem } from '@cvent/nextjs/utils/storage';
import { v4 } from 'uuid';
import { onError } from '@apollo/client/link/error';
import { Observable } from '@apollo/client';
import { CSRF_TOKEN, REFRESH_COOKIE_NAME } from '@utils/constants';
// FIREBALL
// eslint-disable-next-line no-restricted-imports
import { RequestBuilder } from '@cvent/nucleus-networking';
import getConfig from 'next/config';
import { httpLogPageLoadId } from '@cvent/nucleus-networking/lib';

const { publicRuntimeConfig } = getConfig();

interface Tokens {
  csrfToken: string;
  newRefreshToken: string;
}

function getCsrfToken(): string | null {
  const token = process.env.NX_CSRF_TOKEN_NAME ?? 'csrfToken';
  return getItem(token);
}

function getBrowserCookieValue(cookieName: string): string {
  let result = '';
  document.cookie.split(';').forEach(cookie => {
    const [key, value] = cookie.split('=');
    if (key.trim() === cookieName) {
      result = value;
    }
  });
  return result;
}

const getRefreshTokenPromise = async (centerId, refreshToken, contactId, environment): Promise<Tokens> => {
  const request = new RequestBuilder()
    .url(`${publicRuntimeConfig.BASE_PATH}/api/refresh`)
    .queries({ centerId, refreshToken, contactId, environment })
    .post()
    .build();

  const response = await fetch(request);
  return response.json();
};

export const createAuthLink = (centerId: string, contactId: string): ApolloLink => {
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        'X-Cvent-CSRF': getCsrfToken(),
        HttpLogPageLoadId: httpLogPageLoadId,
        httpLogRequestId: v4(),
        ...{ credentials: 'include' }
      }
    };
  });

  const redirectLink = onError(({ graphQLErrors, operation, forward }) => {
    if (
      graphQLErrors &&
      graphQLErrors.length > 0 &&
      graphQLErrors[0] &&
      graphQLErrors[0].extensions &&
      (graphQLErrors[0].extensions.code === 'UNAUTHENTICATED' || graphQLErrors[0].extensions.code === 'FORBIDDEN')
    ) {
      if (typeof window === 'undefined') {
        return undefined;
      }
      const refreshToken = getBrowserCookieValue(REFRESH_COOKIE_NAME);
      const currentURL = new URL(document.URL);
      const environment = currentURL.searchParams.get('env') || process.env.ENVIRONMENT_NAME;

      // Create a new Observerable
      return new Observable(observer => {
        let basePath = `${publicRuntimeConfig.BASE_PATH}/${centerId}` as string;
        if (currentURL.searchParams.get('env')) {
          basePath = basePath.concat(`?env=${environment}`);
        }
        if (contactId && !refreshToken) {
          // logout user when log in session is expired
          window.location.href = basePath;
        } else {
          // Refresh the auth token
          getRefreshTokenPromise(centerId, refreshToken, contactId, environment)
            .then(result => {
              setItem(CSRF_TOKEN, result.csrfToken);
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  'X-Cvent-CSRF': result.csrfToken
                }
              });
              // Bind observable subscribers
              const subscriber = {
                next: observer.next.bind(observer),
                error: observer.error.bind(observer),
                complete: observer.complete.bind(observer)
              };
              if (result.newRefreshToken || !refreshToken) {
                // Retry last failed request
                return forward(operation).subscribe(subscriber);
              }
              // logout user since new refresh token could not be generated
              window.location.href = basePath;
              return undefined;
            })
            // Force user to login if refresh fails
            .catch(error => {
              observer.error(error);
            });
        }
      });
    }
    return undefined;
  });

  const links = [authLink, redirectLink];
  return ApolloLink.from(links);
};
