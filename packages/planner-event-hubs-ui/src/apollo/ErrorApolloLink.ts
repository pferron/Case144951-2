import { ApolloError, ApolloLink, ServerError } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { Logger } from '@cvent/logging/types';
import { GraphQLError } from 'graphql';
import { AuthenticationError } from 'apollo-server-errors';
import getConfig from 'next/config';
import { Events, ObserverFactory } from '../tools/ObserverFactory';

const { publicRuntimeConfig } = getConfig();

const LOG = LoggerFactory.create('error-link-apollo');

/**
 * Copied from https://stash.cvent.net/projects/AX/repos/attendee-experience-web/browse/packages/attendee-experience-web/src/components/app/apolloClient.ts?at=9dc10f38#155-197.
 */
interface UnauthorizedError extends GraphQLError {
  errorInfo: {
    code: string;
  };
}

/**
 * Reusable method that logs the error messages for apollo graphql
 * @param apolloError
 * @param logger
 * */
export const logApolloError = (apolloError: ApolloError, logger: Logger): void => {
  logger.error(apolloError.networkError);
  logger.error(apolloError.graphQLErrors);
};

// List of operations for which redirection to error page is not required
const operationsWithNoErrorRedirection = [
  'deleteChannel',
  'deleteVideo',
  'bannerUpdate',
  'getVideoInUseVideoCenter',
  'getVideoInUseEvent',
  'updateChannelOrder',
  'createHubCustomDomainMapping',
  'updateHubCustomDomainMapping',
  'deleteHubCustomDomainMapping',
  'updateBrandingImages',
  'setTranslations',
  'hubUpdateSettings',
  'updateBackgroundImages',
  'saveEmailDomains',
  'saveContactGroups',
  'saveBlockedContacts',
  'saveContactTypes',
  'saveBlockedContactGroups',
  'hubUpdate',
  'saveCodeSnippet',
  'updateCodeSnippet',
  'removeCodeSnippet',
  'saveGoogleMeasurementId',
  'setUtmOverrides',
  'updateMemberStatus'
];

/**
 * Custom error link to handle 401 errors thrown by the graph. We've seen 401s at the component level that are
 * not handled and sometimes keep re-trying (i.e. subscriptions). This error link catches all graphQL errors
 * globally and handles 401s by redirecting the user to the login screen.
 * this redirects to an error link on GraphQL error
 * @return ApolloLink
 * */
export const createErrorLink = (): ApolloLink => {
  return onError(({ networkError, graphQLErrors, operation }) => {
    if (typeof window === 'undefined') {
      return;
    }

    if (networkError) {
      const networkServerError = networkError as ServerError;
      // 403 is returned if CRSF token is expired. A reload will trigger a new CSRF token to be generated
      // 401 is returned if CSRF token is invalid. Redirect to logout page if provided
      if (networkServerError.statusCode === 403) {
        window.location.reload();
      } else if (networkServerError.statusCode === 401) {
        window.location.reload();
      }
      // The AbortError is typically thrown by the AbortController when an ongoing fetch request is aborted.
      // This is an expected behavior when a request is intentionally aborted, such as when the user navigates
      // to a different URL before the GraphQL call completes.
      else if (networkServerError.name === 'AbortError') {
        return;
      }
    }

    const pageLoadId =
      graphQLErrors[0]?.extensions?.pageLoadId || operation.getContext()?.headers?.HttpLogPageLoadId || '';
    const requestId =
      graphQLErrors[0]?.extensions?.requestId || operation.getContext()?.headers?.HttpLogRequestId || '';
    const date = new Date(Date.now()).getTime().toString();

    const queryParams = new URLSearchParams();
    if (pageLoadId) {
      queryParams.set('httpLogPageLoadId', pageLoadId);
    }
    if (requestId) {
      queryParams.set('requestId', requestId);
    }
    queryParams.set('date', date);

    // This all seems relatively hacky because graphQLErrors is returning as at least 3 different types here
    // 1. An array that works with find
    // 2. Undefined (hence the ?.find)
    // 3. Some defined value which is not an array (hence the typeof check for find)
    // There must be a more organized pattern that can be used here.
    let unAuthorizedError = null;
    let unAuthenticatedError = null;
    if (typeof graphQLErrors?.find === 'function') {
      // The authorization lambda only returns a `Not authorized` message, so we use it here to check if any of the
      // errors returned by the graphQL operation is related to authorization.
      unAuthorizedError = graphQLErrors?.find(e => {
        const unauthorizedError = e as UnauthorizedError;
        return (
          unauthorizedError.errorInfo?.code === '401' ||
          unauthorizedError.message.includes('Not authorized') ||
          unauthorizedError.message.includes('Unauthorized') ||
          unauthorizedError.message.includes('Forbidden')
        );
      });

      // Additional auth error checks, should redirect to login in this scenario
      unAuthenticatedError = graphQLErrors?.find(e => {
        const unauthenticatedError = e as AuthenticationError;
        return unauthenticatedError?.extensions?.code?.toString()?.includes('UNAUTHENTICATED');
      });
    }

    if (unAuthorizedError || unAuthenticatedError) {
      ObserverFactory.getObserver(Events.GRAPHQL_UNAUTHORIZED).notify(operation);
      window.location.href = `/no-permissions`;
    } else if (graphQLErrors) {
      LOG.error(graphQLErrors);
      if (typeof window !== 'undefined') {
        if (
          operationsWithNoErrorRedirection.includes(operation.operationName) ||
          publicRuntimeConfig.IS_DEV === 'true'
        ) {
          return;
        }
        // This redirect can probably be removed. It's original intent isn't clear from reading.
        // If anyone knows why this must be here, please update this comment with a reason for it.
        // Otherwise, it will be removed in Feb 2024.
        window.location.href = `/error?${queryParams.toString()}`;
      }
    }
  });
};
