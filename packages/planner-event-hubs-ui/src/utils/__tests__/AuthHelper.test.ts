import { isAuthorizationError } from '@utils/AuthHelper';
import { ApolloError } from '@apollo/client';
import { GraphQLError } from 'graphql/error/GraphQLError';

describe('authHelper tests', () => {
  it('returns authentication error', async () => {
    const err = new ApolloError({
      graphQLErrors: [new GraphQLError('Unauthorized')]
    });
    const result = isAuthorizationError(err);
    expect(result).toBe(true);
  });

  it('not authentication error', async () => {
    const err = new ApolloError({
      graphQLErrors: [new GraphQLError('Internal Server Error')]
    });
    const result = isAuthorizationError(err);
    expect(result).toBe(false);
  });
});
