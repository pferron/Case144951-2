// For backward compatibility with legacy AppSync behavior
import { ApolloError } from '@apollo/client';
import type { GraphQLError } from 'graphql';

type VideoCenterError = GraphQLError & { errorInfo: Record<string, unknown> };

/**
 * Helper function to check if the ApolloError is due to expired token
 * @param error The error
 */
export const isAuthorizationError = (error?: ApolloError): boolean => {
  return Boolean(
    error?.graphQLErrors &&
      (error.graphQLErrors as Array<VideoCenterError>).some(
        i =>
          i?.errorInfo?.code === '401' ||
          i?.extensions?.code === 'UNAUTHENTICATED' ||
          i?.message === 'Unauthorized' ||
          i?.message === 'Not authorized'
        // i?.extensions?.code === 'FORBIDDEN' Mauve to see if needed here
      )
  );
};
