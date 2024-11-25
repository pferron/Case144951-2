// RED
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import {
  Request,
  Response,
  fetch,
  Headers,
  RequestInit,
  BodyInit,
  URL,
  URLSearchParams,
  URLSearchParamsInit
} from 'apollo-server-env';
import type { ValueOrPromise } from 'apollo-server-types';
import { DataSource, DataSourceConfig } from 'apollo-datasource';
import { ApolloError, AuthenticationError, ForbiddenError } from 'apollo-server-errors';
import { HTTPCache } from './HTTPCache';

const LOG = LoggerFactory.create('RESTDataSource');

declare module 'apollo-server-env/dist/fetch' {
  interface RequestInit {
    cacheOptions?: CacheOptions | ((response: Response, request: Request) => CacheOptions | undefined);
    cacheRefreshOptions?: CacheRefreshOptions;
    url?: string;
  }
}

export type RequestOptions = RequestInit & {
  path: string;
  params: URLSearchParams;
  headers: Headers;
};

export interface CacheOptions {
  ttl?: number;
}

export interface CacheRefreshOptions {
  evict?: boolean;
  update?: boolean;
  keyResolver?: (string) => string;
}

export type Body = BodyInit | object;
export { Request, Response };

export abstract class RESTDataSource<TContext = any> extends DataSource {
  httpCache!: HTTPCache;

  context!: TContext;

  memoizedResults = new Map<string, Promise<any>>();

  constructor(private httpFetch?: typeof fetch) {
    super();
  }

  public initialize(config: DataSourceConfig<TContext>): void {
    this.context = config.context;
    this.httpCache = new HTTPCache(config.cache, this.httpFetch);
  }

  baseURL?: string;

  // By default, we use the full request URL as the cache key.
  // You can override this to remove query parameters or compute a cache key in any way that makes sense.
  // For example, you could use this to take Vary header fields into account.
  // Although we do validate header fields and don't serve responses from cache when they don't match,
  // new responses overwrite old ones with different vary header fields.
  protected cacheKeyFor(request: Request): string {
    return request.url;
  }

  protected willSendRequest?(request: RequestOptions): ValueOrPromise<void>;

  protected resolveURL(request: RequestOptions): ValueOrPromise<URL> {
    let { path } = request;
    if (path.startsWith('/')) {
      path = path.slice(1);
    }
    const { baseURL } = this;
    if (baseURL) {
      const normalizedBaseURL = baseURL.endsWith('/') ? baseURL : baseURL.concat('/');
      return new URL(path, normalizedBaseURL);
    }
    return new URL(path);
  }

  protected cacheOptionsFor?(response: Response, request: Request): CacheOptions | undefined;

  protected async didReceiveResponse<TResult = any>(response: Response, _request: Request): Promise<TResult> {
    if (response.ok) {
      return this.parseBody(response) as any as Promise<TResult>;
    }
    throw await this.errorFromResponse(response);
  }

  protected didEncounterError(error: Error, _request: Request): void {
    throw error;
  }

  protected parseBody(response: Response): Promise<object | string> {
    const contentType = response.headers.get('Content-Type');
    const contentLength = response.headers.get('Content-Length');
    if (
      // As one might expect, a "204 No Content" is empty! This means there
      // isn't enough to `JSON.parse`, and trying will result in an error.
      response.status !== 204 &&
      contentLength !== '0' &&
      contentType &&
      (contentType.startsWith('application/json') || contentType.endsWith('+json'))
    ) {
      return response.json();
    }
    return response.text();
  }

  protected async errorFromResponse(response: Response): Promise<ApolloError> {
    const message = `${response.status}: ${response.statusText}`;

    let error: ApolloError;
    if (response.status === 401) {
      error = new AuthenticationError(message);
    } else if (response.status === 403) {
      error = new ForbiddenError(message);
    } else {
      error = new ApolloError(message);
    }

    const body = await this.parseBody(response);

    Object.assign(error.extensions, {
      response: {
        url: response.url,
        status: response.status,
        statusText: response.statusText,
        body
      }
    });

    return error;
  }

  public async get<TResult = any>(path: string, params?: URLSearchParamsInit, init?: RequestInit): Promise<TResult> {
    return this.fetch<TResult>({ method: 'GET', path, params, ...init });
  }

  public async post<TResult = any>(path: string, inputBody?: Body, init?: RequestInit): Promise<TResult> {
    const body = inputBody;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.fetch<TResult>({ method: 'POST', path, body, ...init });
  }

  protected async patch<TResult = any>(path: string, inputBody?: Body, init?: RequestInit): Promise<TResult> {
    const body = inputBody;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.fetch<TResult>({ method: 'PATCH', path, body, ...init });
  }

  public async put<TResult = any>(path: string, inputBody?: Body, init?: RequestInit): Promise<TResult> {
    const body = inputBody;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.fetch<TResult>({ method: 'PUT', path, body, ...init });
  }

  public async delete<TResult = any>(path: string, params?: URLSearchParamsInit, init?: RequestInit): Promise<TResult> {
    return this.fetch<TResult>({ method: 'DELETE', path, params, ...init });
  }

  private async fetch<TResult>(
    init: RequestInit & {
      path: string;
      params?: URLSearchParamsInit;
    }
  ): Promise<TResult> {
    const req = init;
    if (!(init.params instanceof URLSearchParams)) {
      req.params = new URLSearchParams(init.params);
    }

    if (!(init.headers instanceof Headers)) {
      req.headers = new Headers(init.headers || Object.create(null));
    }

    const options = req as RequestOptions;

    if (this.willSendRequest) {
      await this.willSendRequest(options);
    }

    const url = await this.resolveURL(options);

    // Append params to existing params in the path
    for (const [name, value] of options.params) {
      url.searchParams.append(name, value);
    }

    // We accept arbitrary objects and arrays as body and serialize them as JSON
    if (
      options.body !== undefined &&
      options.body !== null &&
      (options.body.constructor === Object ||
        Array.isArray(options.body) ||
        ((options.body as any).toJSON && typeof (options.body as any).toJSON === 'function'))
    ) {
      options.body = JSON.stringify(options.body);
      // If Content-Type header has not been previously set, set to application/json
      if (!options.headers.get('Content-Type')) {
        options.headers.set('Content-Type', 'application/json');
      }
    }
    const request = new Request(String(url), options);

    const cacheKey = this.cacheKeyFor(request);

    const performRequest = async (): Promise<any> => {
      return this.trace(request, async () => {
        const cacheOptions = options.cacheOptions ? options.cacheOptions : this.cacheOptionsFor?.bind(this);
        try {
          const response = await this.httpCache.fetch(request, {
            cacheKey,
            cacheOptions,
            cacheRefreshOptions: options.cacheRefreshOptions
          });
          return await this.didReceiveResponse(response, request);
        } catch (error) {
          this.didEncounterError(error as Error, request);
        }
        return null;
      });
    };

    if (request.method === 'GET') {
      let promise = this.memoizedResults.get(cacheKey);
      if (promise) return promise;

      promise = performRequest();
      this.memoizedResults.set(cacheKey, promise);
      return promise;
    }
    this.memoizedResults.delete(cacheKey);
    return performRequest();
  }

  protected async trace<TResult>(request: Request, fn: () => Promise<TResult>): Promise<TResult> {
    if (process.env.NODE_ENV === 'development') {
      // We're not using console.time because that isn't supported on Cloudflare
      const startTime = Date.now();
      try {
        return await fn();
      } finally {
        const duration = Date.now() - startTime;
        const label = `${request.method || 'GET'} ${request.url}`;
        LOG.info(`${label} (${duration}ms)`);
      }
    } else {
      return fn();
    }
  }
}