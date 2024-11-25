import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { gqlBasePath } from '@fixtures/authData';
import { onError } from '@apollo/client/link/error';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import util from 'util';
import { GraphQLErrors } from '@apollo/client/errors';

const LOG = LoggerFactory.create('apollo-client');

function logGraphAllErrors(operation: string, errors: GraphQLErrors | undefined): void {
  errors?.forEach(error => {
    LOG.error(
      `${operation} Error: ${error.message}`,
      error?.extensions?.exception?.stacktrace?.filter(line => {
        return !line.match(/node_module/); // filter out stacktrace items from dependencies
      })
    );
  });
}

export function buildApolloClient(
  headers: Record<string, string>,
  graphUri?: string
): ApolloClient<NormalizedCacheObject> {
  const httpLink = new HttpLink({
    uri: graphUri ?? `${gqlBasePath}/api/graphql`,
    headers
  });

  const createErrorLink = (): ApolloLink => {
    return onError(error => {
      const { operation, networkError } = error;
      LOG.error(`${operation.operationName} NetworkError: ${networkError?.message}`);
      logGraphAllErrors(operation.operationName, error.graphQLErrors);
      LOG.debug(util.inspect(error, false, null, false));
    });
  };

  return new ApolloClient({
    link: ApolloLink.from([createErrorLink(), httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only'
      }
    }
  });
}
