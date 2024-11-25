import { ApolloClientOptions, createHttpLink, from, InMemoryCache, NormalizedCacheObject } from '@apollo/client';
import { useMemo } from 'react';
import { createAuthLink } from '@cvent/apollo-client';
import { createErrorLink } from '../apollo/ErrorApolloLink';

const terminatingLink = createHttpLink({
  uri: '/api/graphql',
  credentials: 'include'
});

export function useApolloClientOptions(): ApolloClientOptions<NormalizedCacheObject> {
  return useMemo(() => {
    const cache = new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            getPlannerPaginatedChannels: {
              keyArgs: ['hubId']
            }
          }
        },
        Translation: {
          keyFields: ['id', 'type']
        }
      }
    });
    return {
      cache,
      link: from([createErrorLink(), createAuthLink(), terminatingLink])
    };
  }, []);
}
