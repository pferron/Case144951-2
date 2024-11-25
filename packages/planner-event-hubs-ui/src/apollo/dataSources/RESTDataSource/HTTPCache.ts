import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { fetch, Request, Response } from 'apollo-server-env';
import CachePolicy from 'http-cache-semantics';
import { KeyValueCache, InMemoryLRUCache, PrefixingKeyValueCache } from 'apollo-server-caching';
import type { CacheOptions, CacheRefreshOptions } from './RESTDataSource';

const LOG = LoggerFactory.create('httpcache');

function headersToObject(headers) {
  const object = Object.create(null);
  for (const [name, value] of headers) {
    object[name] = value;
  }
  return object;
}

function canBeRevalidated(response): boolean {
  return response.headers.has('etag');
}

function policyRequestFrom(request) {
  return {
    url: request.url,
    method: request.method,
    headers: headersToObject(request.headers)
  };
}

function policyResponseFrom(response) {
  return {
    status: response.status,
    headers: headersToObject(response.headers)
  };
}

export class HTTPCache {
  public keyValueCache: KeyValueCache;

  private httpFetch: typeof fetch;

  constructor(keyValueCache: KeyValueCache = new InMemoryLRUCache(), httpFetch: typeof fetch = fetch) {
    this.keyValueCache = new PrefixingKeyValueCache(keyValueCache, 'httpcache:');
    this.httpFetch = httpFetch;
  }

  public async fetch(
    request: Request,
    options: {
      cacheKey?: string;
      cacheOptions?: CacheOptions | ((response: Response, request: Request) => CacheOptions | undefined);
      cacheRefreshOptions?: CacheRefreshOptions;
    } = {}
  ): Promise<Response> {
    LOG.debug('fetch called for ', request.method, request.url);

    if (request.headers.has('x-skip-cache')) {
      return this.httpFetch(request);
    }

    let cacheError = false;
    let cacheKey = options.cacheKey ? options.cacheKey : request.url;
    cacheKey = options.cacheRefreshOptions?.keyResolver ? options.cacheRefreshOptions.keyResolver(cacheKey) : cacheKey;

    const entry = await this.keyValueCache.get(cacheKey).catch(async reason => {
      LOG.error('Attempt to load from cache failed because', reason);
      cacheError = true;
    });

    if (cacheError) {
      return this.httpFetch(request);
    }

    if (!entry) {
      LOG.debug('no cached entry', cacheKey);
      const response = await this.httpFetch(request);

      const policy = new CachePolicy(policyRequestFrom(request), policyResponseFrom(response));
      // When not cached and processing non-GET requests
      // - storeResponseAndReturnClone will not cache the response
      // - there is no cache entry to update
      return this.storeResponseAndReturnClone(response, request, policy, cacheKey, options.cacheOptions);
    }
    LOG.debug('Found cached entry', entry, request.method, request.url);
    const { policy: policyRaw, ttlOverride, body } = JSON.parse(entry);

    const policy = CachePolicy.fromObject(policyRaw);
    // Remove url from the policy, because otherwise it would never match a request with a custom cache key
    policy._url = undefined;

    if (request.method !== 'GET' && (options.cacheRefreshOptions?.update || options.cacheRefreshOptions?.evict)) {
      // A cache entry was found for cacheKey
      // TODO: consider removing the request.method conditional... We don't support caching non-GET
      // Skip revalidation in these cases
      // We will update the existing cache entry body and then return a clone of the original response
      // Subsequent GET requests will do any revalidation necessary and update the CachePolicy accordingly
      const response = await this.httpFetch(request);
      LOG.debug('Processing request', request.method, request.url);
      return this.updateCacheEntryAndReturnCloneResponse(response, policy, cacheKey, options.cacheRefreshOptions);
    }

    if (
      (ttlOverride && policy.age() < ttlOverride) ||
      (!ttlOverride && policy.satisfiesWithoutRevalidation(policyRequestFrom(request)))
    ) {
      const headers = policy.responseHeaders();
      LOG.debug(
        'Returning cached response',
        policy._url,
        policy._status,
        policy.age(),
        ttlOverride,
        headers,
        policyRequestFrom(request)
      );
      return new Response(body, {
        url: policy._url,
        status: policy._status,
        headers
      });
    }
    const revalidationHeaders = policy.revalidationHeaders(policyRequestFrom(request));
    const revalidationRequest = new Request(request, {
      headers: revalidationHeaders
    });
    LOG.debug('Revalidating cache content', revalidationHeaders, revalidationRequest);
    const revalidationResponse = await this.httpFetch(revalidationRequest);

    const { policy: revalidatedPolicy, modified } = policy.revalidatedPolicy(
      policyRequestFrom(revalidationRequest),
      policyResponseFrom(revalidationResponse)
    );

    return this.storeResponseAndReturnClone(
      new Response(modified ? await revalidationResponse.text() : body, {
        url: revalidatedPolicy._url,
        status: revalidatedPolicy._status,
        headers: revalidatedPolicy.responseHeaders()
      }),
      request,
      revalidatedPolicy,
      cacheKey,
      options.cacheOptions
    );
  }

  private async updateCacheEntryAndReturnCloneResponse(
    response: Response,
    policy: CachePolicy,
    cacheKey: string,
    cacheRefreshOptions: CacheRefreshOptions
  ): Promise<Response> {
    LOG.debug('updateCacheEntryAndReturnCloneResponse called', cacheKey);

    const body = await response.text();
    const ttl = Math.ceil(policy.timeToLive() / 1000);
    if (cacheRefreshOptions.update && ttl > 0) {
      const entry = JSON.stringify({
        policy: policy.toObject(),
        ttl,
        body
      });

      LOG.debug('ttl', ttl);
      LOG.debug('policy.timeToLive()', policy.timeToLive());
      LOG.debug('policy.age()', policy.age());
      LOG.debug('Updating cache', cacheKey, entry, ttl);

      await this.keyValueCache
        .set(cacheKey, entry, {
          ttl: ttl * 2
        })
        .catch(reason => {
          LOG.error('Cache update failed because', reason, cacheKey);
        });
    } else if (cacheRefreshOptions.evict) {
      LOG.debug('Evicting cacheKey', cacheKey);
      await this.keyValueCache.delete(cacheKey).catch(reason => {
        LOG.error('Cache eviction failed because', reason);
      });
    }

    // We have to clone the response before returning it because the
    // body can only be used once.
    // To avoid https://github.com/bitinn/node-fetch/issues/151, we don't use
    // response.clone() but create a new response from the consumed body
    return new Response(body, {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }

  private async storeResponseAndReturnClone(
    response: Response,
    request: Request,
    policy: CachePolicy,
    cacheKey: string,
    cacheOptions?: CacheOptions | ((response: Response, request: Request) => CacheOptions | undefined)
  ): Promise<Response> {
    LOG.debug('storeResponseAndReturnClone called');
    let options;
    if (typeof cacheOptions === 'function') {
      options = cacheOptions(response, request);
    } else {
      options = cacheOptions;
    }
    const ttlOverride = options?.ttl;

    if (
      // With a TTL override, only cache successful responses but otherwise ignore method and response headers
      !(ttlOverride && policy._status >= 200 && policy._status <= 299) &&
      // Without an override, we only cache GET requests and respect standard HTTP cache semantics
      !(request.method === 'GET' && policy.storable())
    ) {
      LOG.debug('Not caching, returning live response', ttlOverride, policy._status, request.method, policy.storable());
      return response;
    }

    let ttl = ttlOverride === undefined ? Math.round(policy.timeToLive() / 1000) : ttlOverride;
    LOG.debug('ttl (when <= 0, returning response immediately)', ttl, policy.timeToLive());
    if (ttl <= 0) return response;

    // If a response can be revalidated, we don't want to remove it from the cache right after it expires.
    // We may be able to use better heuristics here, but for now we'll take the max-age times 2.
    if (canBeRevalidated(response)) {
      ttl *= 2;
    }

    const body = await response.text();
    const entry = JSON.stringify({
      policy: policy.toObject(),
      ttlOverride,
      body
    });

    LOG.debug('Caching', cacheKey, entry, ttl);
    await this.keyValueCache
      .set(cacheKey, entry, {
        ttl
      })
      .catch(reason => {
        LOG.error('Cache failed to store response because', reason, cacheKey);
      });

    // We have to clone the response before returning it because the
    // body can only be used once.
    // To avoid https://github.com/bitinn/node-fetch/issues/151, we don't use
    // response.clone() but create a new response from the consumed body
    return new Response(body, {
      url: response.url,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers
    });
  }
}
