import { ApolloError } from 'apollo-server-errors';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { v4 as uuidv4 } from 'uuid';
import { GraphQLError, GraphQLFormattedError } from 'graphql/error';

const LOG = LoggerFactory.create('PlannerEventHubError');

class ErrorInfo {
  readonly code?: string;

  readonly requestId?: string;

  readonly pageLoadId?: string;

  readonly response?: string | object;

  constructor(code, requestId = uuidv4(), pageLoadId = uuidv4(), response = '') {
    this.code = code;
    this.requestId = requestId;
    this.pageLoadId = pageLoadId;
    this.response = response;
  }
}

export class PlannerEventHubError extends ApolloError {
  readonly info: ErrorInfo;

  constructor(message: string, errorInfo?: ErrorInfo) {
    super(message, errorInfo?.code, errorInfo);
    this.info = this.extensions;
  }
}

/**
 * Copied from @cvent/apollo-server and modified to avoid always logging ERROR when enableRequestResponseLogging is false.
 *
 * In @cvent/apollo-server, enableRequestResponseLogging is used only by LoggingPlugin and defaultFormatError during server init,
 * both of which are defined locally here and can be modified or replaced in the options provided to graphqlApiRoute.
 *
 * @param err GraphQLError
 * @returns GraphQLFormattedError
 */
export const defaultFormatError = (err: GraphQLError): GraphQLFormattedError => {
  // Don't give the specific error to the client if error code is INTERNAL_SERVER_ERROR
  if (err.extensions?.code === 'INTERNAL_SERVER_ERROR') {
    LOG.error('Internal server error', err);
    return new Error('Internal server error');
  }
  // Don't return verbose validation failure output in prod mode
  if (process.env.NODE_ENV === 'production' && err.extensions?.code === 'GRAPHQL_VALIDATION_FAILED') {
    LOG.error('GraphQL request failed schema validation', err);
    return new Error('GraphQL request failed schema validation');
  }
  return err;
};
