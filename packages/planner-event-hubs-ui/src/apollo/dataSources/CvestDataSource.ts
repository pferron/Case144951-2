import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { Request, Response } from 'apollo-server-env';
import { getEnvironment, getAccessToken, getAccountMappingId } from '@resolvers/common/utils/authMetadataUtils';
import { isEmpty } from 'lodash';
import { PlannerEventHubError } from '@server/error/PlannerEventHubError';
import { ApolloError } from 'apollo-server-errors';
import { RESTDataSource, RequestOptions, CacheOptions } from './RESTDataSource/RESTDataSource';

const LOG = LoggerFactory.create('cvent-datasource');

/**
 * For those familiar with AttendeeHub patterns,
 * this class replaces the lower-level fetch* family of functions such as `fetchDataWithOptions` and `getRequestBuilder`.
 * The fetch* patterns were established in code-bases from the good ole days pre-dating ApolloServer. Under the hood, these DataSource classes
 * use the same low-level fetch libraries for http interactions.
 * DataSources provide more advanced features like request de-duplication and caching (RESTDataSource uses HttpCache). They come with a consistent API to override
 * behaviors when sending, receiving and caching requests or handling errors.
 * DataSources also have access to the request context via `this.context` and are themselves, attached to the same context object.
 *
 * The CvestDataSource is intended to provide common request pre-processing and error handling logic so that various REST clients can focus on their specific business concern.
 * In cases the logic used in this class does not fit the needs of a given REST client or this class cannot be updated and maintain backward-compatibility,
 * then there are two options, and which option to choose depends on the use-case. The use-cases can be summarized as
 * 1. multiple REST clients will share the same logic and CvestDataSource does not meet those requirements
 * 2. a single REST client will need its own logic
 *
 * In UC-1, the recommendation is to create a new class, extending RESTDataSource and overriding necessary functions to achieve desired behaviors
 * BUT do not attempt to define end-point calls in this class and instead define those in separate REST clients that extend the new class.
 *
 * In UC-2, the recommendation is similar, create a new class and extend RESTDataSource, overriding needed functions.
 * However, since this behavior-set will be only for one client, define the end-point calls in the same class.
 *
 * References:
 * - https://www.apollographql.com/docs/apollo-server/v2/data/data-sources/
 * - https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/
 * - https://github.com/apollographql/apollo-server/blob/main/packages/apollo-datasource-rest/src/RESTDataSource.ts
 */
export class CvestDataSource extends RESTDataSource {
  public setStandardParams(request: RequestOptions): void {
    // Set environment param from context.environment for initial anonymous requests, otherwise use auth object
    if (isEmpty(request.params.get('environment')) && (this.context.environment || this.context.auth)) {
      request.params.set('environment', this.context.environment || getEnvironment(this.context.auth));
    }
  }

  public setStandardHeaders(request: RequestOptions): void {
    // If a request provides its own Authorization header, leave it alone. For example, VideoCenterClient.getHubByApiKey().
    // If no Authorization header is set AND the auth context is set, populate with the bearer.
    if (isEmpty(request.headers.get('Authorization')) && (this.context.accountToken || this.context.auth)) {
      request.headers.set('Authorization', this.context.accountToken || `BEARER ${getAccessToken(this.context.auth)}`);
    }
    const { accountId } = this.context.headers;
    if (accountId) {
      request.headers.set('AccountId', accountId);
    }
    this.setLoggingHeaders(request);
  }

  public setLoggingHeaders(request: RequestOptions): void {
    request.headers.set(
      'HttpLogPageLoadId',
      this.context.headers.HttpLogPageLoadId || this.context.headers.httplogpageloadid
    );
    request.headers.set(
      'HttpLogRequestId',
      this.context.headers.HttpLogRequestId || this.context.headers.httplogrequestid
    );
  }

  /**
   * Override willSendRequest to set any parameters and headers needed to satisfy the request.
   * Apollo calls this before every request.
   *
   * For those familiar with the patterns established in AttendeeHub, this function replaces `getRequestBuilder`.
   *
   * @param request
   */
  public willSendRequest(request: RequestOptions): void {
    LOG.debug('willSendRequest', request.headers, this.context?.headers);
    this.setStandardParams(request);
    this.setStandardHeaders(request);
  }

  /**
   * Override didEncounterError to translate the generic Server Error according to response code from the service.
   * Apollo calls this whenever the service returns a non-success code (effectively anything >=400) OR if an error occurs in processing the response.
   *
   * For those familiar with the patterns established in AttendeeHub, this function replaces `fetchDataWithOptions`.
   *
   * This is necessary in order to apply any custom logic to ApolloServer's error handling.
   * This approach seems to be the best option from various attempts in the community.
   *  * https://github.com/apollographql/apollo-feature-requests/issues/129
   *  * https://github.com/apollographql/apollo-server/issues/1311
   * The error returned will have an extensions object with the following properties
   *  * code (unknown/undefined)
   *  * response (object)
   * The response object has the following properties
   *  * url (requested url)
   *  * status (numeric http response status)
   *  * statusText (error message associated with the status)
   *  * body (the response body object)
   *
   * @param error
   * @param request
   */
  public didEncounterError(error: ApolloError, request: Request): void {
    const response = error.extensions?.response;
    const errorsToPassThrough = [404, 422, 400];
    const errorMetadata = {
      code: `${response?.status}`,
      requestId: request.headers.get('HttpLogRequestId'),
      pageLoadId: request.headers.get('HttpLogPageLoadId'),
      response: response?.body
    };
    LOG.debug('didEncounterError', error, response?.statusText, errorMetadata, request.headers);
    const message = response && errorsToPassThrough.includes(response?.status) ? response?.statusText : error.message;
    throw new PlannerEventHubError(message, errorMetadata);
  }

  /**
   * WARNING
   * If you need to change the cache key for a specific data source, override this method in that data source
   * DO NOT MODIFY THIS METHOD unless you are 100% confident about the impact to every child data source.
   * END WARNING
   *
   * By default, Apollo uses the full request URL as the cache key.
   * We are overriding this to compute a cache key that includes the AccountMappingID in order to
   * prevent unexpected cross-account access to cached data.
   *
   * ref: https://github.com/apollographql/apollo-server/blob/2706fc2e2/packages/apollo-datasource-rest/src/RESTDataSource.ts#L64-L71
   */
  public cacheKeyFor(request: Request): string {
    return `AccountMappingId:${getAccountMappingId(this.context.auth)}:${request.url}`;
  }

  /**
   * Override cache hints from the service to ensure
   * - only cache GET requests
   * - do not cache requests with no AccountMappingId
   * - do not cache requests that return non-200 status
   *
   * In order to avoid caching responses, return { ttl: 0 }.
   * In order to respect cache hints from remote service, return undefined.
   *
   * @param response
   * @param request
   * @returns CacheOptions | undefined
   */
  public cacheOptionsFor(response: Response, request: Request): CacheOptions | undefined {
    if (
      request.method !== 'GET' ||
      !getAccountMappingId(this.context.auth) ||
      response.status < 200 ||
      response.status > 299
    ) {
      return { ttl: 0 };
    }

    return undefined;
  }
}
