/**
 * Casts a mocked function to the correct type so jest methods can be called without the compiler complaining.
 * See https://instil.co/blog/typescript-testing-tips-mocking-functions-with-jest/
 *
 * @param fn The mocked function
 */
// FIREBALL
/* eslint-disable  @typescript-eslint/no-explicit-any */
import { Resolvers } from '@cvent/planner-event-hubs-model/types';
// FIREBALL
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
  return fn as jest.MockedFunction<T>;
}
export const resolveQueryResponse = async (
  resolver: Resolvers<any>,
  queryName: string,
  input: any,
  info?: any
): Promise<any> => {
  const resolverFn = resolver.Query[queryName];
  return resolverFn(null, input.args, input.context, info);
};
export const resolveMutationResponse = async (
  resolver: Resolvers<any>,
  mutationName: string,
  input: any,
  info?: any
): Promise<any> => {
  const resolverFn = resolver.Mutation[mutationName];
  return resolverFn(null, input.args, input.context, info);
};
