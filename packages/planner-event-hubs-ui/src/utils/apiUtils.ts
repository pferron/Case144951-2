import { ApolloError } from 'apollo-server-errors';
import { Logger } from '@cvent/logging/types';
// RED
// eslint-disable-next-line no-restricted-imports
import { RequestBuilder, fetchWithOptions } from '@cvent/nucleus-networking-node';
import { Request, Response } from '@cvent/nucleus-networking-node/externals';

export const customFetch = fetchWithOptions({
  retry: {
    initialDelay: 1000,
    multiplicationFactor: 2,
    retryStatuses: [429, 502, 503]
  }
});

export interface LogHeader {
  HttpLogPageLoadId: string;
  HttpLogRequestId: string;
}

const getLogIds = (headers: Record<string, string | string[]>): LogHeader => {
  const { HttpLogPageLoadId, httplogpageloadid, HttpLogRequestId, httplogrequestid } = headers;
  const pageLoadId = HttpLogPageLoadId || httplogpageloadid;
  const requestId = HttpLogRequestId || httplogrequestid;
  return {
    HttpLogPageLoadId: pageLoadId as string,
    HttpLogRequestId: requestId as string
  };
};

const getRequestBuilder = (
  url: string,
  headers: Record<string, string>,
  environment: string,
  logIds: LogHeader,
  logger: Logger,
  queryMap = undefined
): RequestBuilder => {
  const { authorization } = headers;
  const { HttpLogPageLoadId, HttpLogRequestId } = logIds;
  logger.debug('HttpLogPageLoadId:', HttpLogPageLoadId);
  logger.debug('HttpLogRequestId:', HttpLogRequestId);
  logger.debug('environment:', environment);
  logger.debug('authorization:', authorization);

  let request = new RequestBuilder({
    headers: {
      HttpLogPageLoadId,
      HttpLogRequestId
    }
  })
    .url(url)
    .auth(authorization);
  if (environment) {
    request = request.query('environment', environment);
  }
  if (queryMap) {
    // RED
    /* eslint-disable */
    Object.entries(queryMap).forEach(([key, value]) => (request = request.query(key, value)));
  }
  return request;
};

const parseResponse = (response: Response): Record<string, never> | Promise<any> => {
  /**
   * Conditional check for responseBody. When the status is 204 (No Content), then
   * we would return empty object, else return the json content from response.
   */
  return response.status === 204 || response.headers.get('content-length') === '0' ? {} : response.json();
};

const fetchDataWithOptions = async (request: Request): Promise<Response> => {
  const response = await customFetch(request);

  return parseResponse(response);
};

const unhandledError = (message: string, logIds: LogHeader, errorCode = ''): ApolloError => {
  return new ApolloError(message, errorCode || 'Unhandled Error', {
    code: errorCode || 'Unhandled',
    requestId: logIds.HttpLogRequestId,
    pageLoadId: logIds.HttpLogPageLoadId
  });
};

const fetchDataWithOptionsAndHandleError = async (
  request: Request,
  logIds: LogHeader,
  logger: Logger,
  logMessage: string
): Promise<any> => {
  try {
    const response = await customFetch(request);

    return parseResponse(response);
  } catch (error) {
    logger.error(logMessage, error);

    const { message, code } = error;
    const { HttpLogRequestId, HttpLogPageLoadId } = logIds || {};

    // Errors from api calls to underlying services
    if (error.response) {
      const { response } = error;
      throw new ApolloError(`${message}`, `${response.status} ${response.statusText}`, {
        code: `${response.status}`,
        requestId: HttpLogRequestId,
        pageLoadId: HttpLogPageLoadId,
        response: response.bodyUsed ? 'Response body used.' : await response.text()
      });
    }
    // Catch-all error handling
    throw unhandledError(message, logIds, code);
  }
};

/**
 * A set of common error handlers. Keys are HTTP codes, values are callbacks that take a reason/error object, a logger and return an ApolloError.
 *
 * The purpose of expanding error handling is to allow for logging 'errors' at levels other than ERROR.
 * For example, prod alerts firing for auth/n/z errors create noise so it is better to log these as INFO or DEBUG.
 */
const defaultHandlers: Record<number, (reason: Error, logger: Logger) => void> = {
  401: (reason, logger) => {
    logger.info(`Handled 401 error from service: ${reason.message}`);
    return new ApolloError(reason.message, '401');
  },
  403: (reason, logger) => {
    logger.info(`Handled 403 error from service: ${reason.message}`);
    return new ApolloError(reason.message, '403');
  }
};

/**
 * Forked from fetchDataWithOptionsAndHandleError; leaving original intact to keep blast radius low.
 * This method should provide parity to fetchDataWithOptionsAndHandleError with the exception that defaultHandlers will avoid logging auth/n/z 'errors' as ERROR.
 *
 * Callers can provide their own set of handlers as well. If they do then defaultHandlers will not be used at all.
 * If a caller wants to define their own handlers and leverage the defaultHandlers, it is expected that defaultHandlers would be exported and extended for that use-case in isolation.
 */
const fetchDataAndGranularlyHandleError = async (
  request: Request,
  logIds: LogHeader,
  logger: Logger,
  defaultErrorMessage: string,
  handlers?: Record<number, (response: Error, logger: Logger) => void>
): Promise<any> => {
  const activeHandlers = handlers || defaultHandlers;

  try {
    const response = await customFetch(request);

    return parseResponse(response);
  } catch (error) {
    if (activeHandlers[error.response.status]) {
      throw activeHandlers[error.response.status](error, logger);
    } else {
      logger.error(defaultErrorMessage, error);

      const { message, code } = error;
      const { HttpLogRequestId, HttpLogPageLoadId } = logIds || {};

      // Errors from api calls to underlying services
      if (error.response) {
        const { response } = error;
        throw new ApolloError(`${message}`, `${response.status} ${response.statusText}`, {
          code: `${response.status}`,
          requestId: HttpLogRequestId,
          pageLoadId: HttpLogPageLoadId,
          response: response.bodyUsed ? 'Response body used.' : await response.text()
        });
      }
      // Catch-all error handling
      throw unhandledError(defaultErrorMessage, logIds, code);
    }
  }
};

const extractFileExtension = (filename: string): string => {
  return filename.split('.').pop();
};

const extractFileBaseName = (filename: string): string => {
  const parts = filename.split('.');
  parts.pop(); // drop the extension
  return parts.join('.'); // re-join to support any dots in filenames before extension part
};

export {
  fetchDataWithOptions,
  fetchDataWithOptionsAndHandleError,
  fetchDataAndGranularlyHandleError,
  getRequestBuilder,
  getLogIds,
  extractFileExtension,
  extractFileBaseName,
  unhandledError
};
