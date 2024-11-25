import { ApolloError } from 'apollo-server-errors';
// FIREBALL
// eslint-disable-next-line no-restricted-imports
import { RequestBuilder, fetchWithOptions, FetchError } from '@cvent/nucleus-networking-node';
import { Response } from '@cvent/nucleus-networking-node/externals';

const customFetch = fetchWithOptions({
  retry: {
    initialDelay: 1000,
    multiplicationFactor: 2,
    retryStatuses: [429, 502, 503]
  }
});

interface LogIds {
  HttpLogPageLoadId: string;
  HttpLogRequestId: string;
}
const getLogIds = (headers): LogIds => {
  const { HttpLogPageLoadId, httplogpageloadid, HttpLogRequestId, httplogrequestid } = headers;
  const pageLoadId = HttpLogPageLoadId || httplogpageloadid;
  const requestId = HttpLogRequestId || httplogrequestid;
  return {
    HttpLogPageLoadId: pageLoadId,
    HttpLogRequestId: requestId
  };
};

const unhandledError = (message, logIds, errorCode = ''): ApolloError => {
  return new ApolloError(message, errorCode || 'Unhandled Error', {
    code: errorCode || 'Unhandled',
    requestId: logIds.HttpLogRequestId,
    pageLoadId: logIds.HttpLogPageLoadId
  });
};

const getRequestBuilder = (url, headers, environment, logger, queryMap = undefined): RequestBuilder => {
  const { authorization, accountId, accountMappingId } = headers;
  const { HttpLogPageLoadId, HttpLogRequestId } = getLogIds(headers);
  logger.debug('HttpLogPageLoadId:', HttpLogPageLoadId);
  logger.debug('HttpLogRequestId:', HttpLogRequestId);
  logger.debug('authorization:', authorization);
  logger.debug('environment:', environment);

  let request = new RequestBuilder({
    headers: {
      HttpLogRequestId,
      HttpLogPageLoadId
    }
  }).url(url);

  if (authorization) {
    request = request.auth(`${authorization}`);
  }
  if (environment) {
    request = request.query('environment', environment);
  }
  if (accountId) {
    request = request.header('AccountId', accountId);
  }
  if (accountMappingId) {
    request = request.header('AccountMappingId', accountMappingId);
  }
  if (queryMap) {
    // FIREBALL
    // eslint-disable-next-line no-return-assign
    Object.entries(queryMap).forEach(([key, value]) => (request = request.query(key, value)));
  }
  return request;
};

/**
 * This method fetches the response from fetchWithOptions call and throws
 * the ApolloError containing Error Response Body.
 *
 * @param request
 * @param logIds
 * @param statusesNotToThrowOn The http status codes on which error should not be thrown
 */
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const fetchDataWithOptions = async (request, logIds): Promise<any> => {
  try {
    const response: Response = await customFetch(request);

    /**
     * Conditional check for responseBody. When the status is 204 (No Content), then
     * we would return empty object, else return the json content from response.
     */
    return response.status === 204 || response.headers.get('content-length') === '0' ? {} : await response.json();
  } catch (fetchError) {
    const error = fetchError as FetchError;
    const { message } = error;
    const { HttpLogRequestId, HttpLogPageLoadId } = logIds;

    // Errors from api calls to underlying services
    if (error.response) {
      const { response } = error;
      throw new ApolloError(message, `${response.status} ${response.statusText}`, {
        code: `${response.status}`,
        requestId: HttpLogRequestId,
        pageLoadId: HttpLogPageLoadId,
        response: response.bodyUsed ? 'Response body used.' : await response.text()
      });
    }

    // Catch-all error handling
    throw unhandledError(message, logIds, error.code);
  }
};

export { unhandledError, getRequestBuilder, getLogIds, fetchDataWithOptions };
