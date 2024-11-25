import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import logger from '@wdio/logger';
import { onError } from '@apollo/client/link/error';
// import { configs } from '../../configs/testConfig';
import { getConfigs } from '../../configs/testConfig';

const LOG = logger('apollo-client-e2e');

export async function buildApolloClient(headers: Record<string, string>): Promise<ApolloClient<NormalizedCacheObject>> {
  const configs = getConfigs();
  const httpLink = new HttpLink({
    uri: `${configs.baseUrl}${configs.basePath}/api/graphql`,
    headers
  });

  const createErrorLink = async (): Promise<ApolloLink> => {
    return onError(({ graphQLErrors, operation }) => {
      LOG.error('Some error occurred in graph call', graphQLErrors, operation);
    });
  };

  return new ApolloClient({
    link: ApolloLink.from([await createErrorLink(), httpLink]),
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'network-only'
      }
    }
  });
}
