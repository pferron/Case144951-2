import FakeTimers from '@sinonjs/fake-timers';
import { fetch, Request } from '../../__TestUtils__/mock-apollo-server-env';

import { HTTPCache } from '../../RESTDataSource/HTTPCache';
import { MapKeyValueCache } from '../../__TestUtils__/MapKeyValueCache';

describe('HTTPCache', () => {
  let store: MapKeyValueCache<string>;
  let httpCache: HTTPCache;
  let clock: FakeTimers.InstalledClock;

  beforeAll(() => {
    clock = FakeTimers.install();
  });

  beforeEach(() => {
    fetch.mockReset();

    store = new MapKeyValueCache<string>();
    httpCache = new HTTPCache(store);
  });

  afterAll(() => {
    clock.uninstall();
  });

  it('fetches a response from the origin when not cached', async () => {
    fetch.mockJSONResponseOnce(undefined, undefined, { name: 'Ada Lovelace' });
    const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(fetch.mock.calls.length).toEqual(1);
    expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
  });

  it('returns a cached response when not expired', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    clock.tick(10000);

    const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(fetch.mock.calls.length).toEqual(1);
    expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
    expect(response.headers.get('Age')).toEqual('10');
  });

  it('fetches a fresh response from the origin when expired', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    clock.tick(30000);

    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Alan Turing' });

    const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(fetch.mock.calls.length).toEqual(2);

    expect(await response.json()).toEqual({ name: 'Alan Turing' });
    expect(response.headers.get('Age')).toEqual('0');
  });

  it('fetches a fresh response, skipping all cache logic when "x-skip-cache" header is present in request', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });
    await httpCache.fetch(new Request('https://api.example.com/people/1'));
    const cachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));
    expect(await cachedResponse.json()).toEqual({ name: 'Ada Lovelace' });
    expect(cachedResponse.headers.get('Age')).toEqual('0');

    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=45' }, undefined, { name: 'Alan Turing' });
    const skipCacheResponse = await httpCache.fetch(
      new Request('https://api.example.com/people/1', { headers: { 'x-skip-cache': 'anything' } })
    );
    const cachedResponseCheck = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    // Verify the request with x-skip-cache header does not return cached data
    expect(await skipCacheResponse.json()).toEqual({ name: 'Alan Turing' });
    expect(skipCacheResponse.headers.get('Age')).toBeNull();
    // Verify cached entry still exists in order to prove above assertions work as expected
    expect(await cachedResponseCheck.json()).toEqual({ name: 'Ada Lovelace' });
    expect(cachedResponseCheck.headers.get('Age')).toEqual('0');
  });

  describe('graceful handling of remote cache store errors', () => {
    it('returns live response if cache.get fails', async () => {
      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

      await httpCache.fetch(new Request('https://api.example.com/people/1'));

      clock.tick(10000);
      httpCache.keyValueCache.get = jest.fn().mockImplementation(async (): Promise<string> => {
        throw Error('Redis went away');
      });

      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });
      const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(fetch.mock.calls.length).toEqual(2);
      expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
      expect(response.headers.get('Age')).toBeNull(); // verify 'live' response
    });

    it('returns live response if cache.set fails', async () => {
      httpCache.keyValueCache.set = jest.fn().mockImplementation(async (): Promise<void> => {
        throw Error('Redis went away');
      });
      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });
      const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
      expect(response.headers.get('Age')).toBeNull(); // verify 'live' response
    });
  });

  describe('overriding TTL', () => {
    it('returns a cached response when the overridden TTL is not expired', async () => {
      fetch.mockJSONResponseOnce(
        {
          'Cache-Control': 'private, no-cache',
          'Set-Cookie': 'foo'
        },
        undefined,
        { name: 'Ada Lovelace' }
      );

      await httpCache.fetch(new Request('https://api.example.com/people/1'), {
        cacheOptions: {
          ttl: 30
        }
      });

      clock.tick(10000);

      const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(fetch.mock.calls.length).toEqual(1);
      expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
      expect(response.headers.get('Age')).toEqual('10');
    });

    it('fetches a fresh response from the origin when the overridden TTL expired', async () => {
      fetch.mockJSONResponseOnce(
        {
          'Cache-Control': 'private, no-cache',
          'Set-Cookie': 'foo'
        },
        undefined,
        { name: 'Ada Lovelace' }
      );

      await httpCache.fetch(new Request('https://api.example.com/people/1'), {
        cacheOptions: {
          ttl: 30
        }
      });

      clock.tick(30000);

      fetch.mockJSONResponseOnce(
        {
          'Cache-Control': 'private, no-cache',
          'Set-Cookie': 'foo'
        },
        undefined,
        { name: 'Alan Turing' }
      );

      const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(fetch.mock.calls.length).toEqual(2);

      expect(await response.json()).toEqual({ name: 'Alan Turing' });
      expect(response.headers.get('Age')).toEqual('0');
    });

    it('fetches a fresh response from the origin when the overridden TTL expired even if a longer max-age has been specified', async () => {
      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

      await httpCache.fetch(new Request('https://api.example.com/people/1'), {
        cacheOptions: {
          ttl: 10
        }
      });

      clock.tick(10000);

      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Alan Turing' });

      const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(fetch.mock.calls.length).toEqual(2);

      expect(await response.json()).toEqual({ name: 'Alan Turing' });
      expect(response.headers.get('Age')).toEqual('0');
    });

    it('does not store a response with an overridden TTL and a non-success status code', async () => {
      fetch.mockResponseOnce('Internal server error', { 'Cache-Control': 'max-age=30' }, 500);

      await httpCache.fetch(new Request('https://api.example.com/people/1'), {
        cacheOptions: {
          ttl: 30
        }
      });

      expect(store.size).toEqual(0);
    });

    it('allows overriding the TTL dynamically', async () => {
      fetch.mockJSONResponseOnce(
        {
          'Cache-Control': 'private, no-cache',
          'Set-Cookie': 'foo'
        },
        undefined,
        { name: 'Ada Lovelace' }
      );

      await httpCache.fetch(new Request('https://api.example.com/people/1'), {
        cacheOptions: () => ({
          ttl: 30
        })
      });

      clock.tick(10000);

      const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(fetch.mock.calls.length).toEqual(1);
      expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
      expect(response.headers.get('Age')).toEqual('10');
    });

    it('allows disabling caching when the TTL is 0 (falsy)', async () => {
      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

      await httpCache.fetch(new Request('https://api.example.com/people/1'), {
        cacheOptions: () => ({
          ttl: 0
        })
      });

      expect(store.size).toEqual(0);
    });
  });

  it('allows specifying a custom cache key', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

    await httpCache.fetch(new Request('https://api.example.com/people/1?foo=bar'), {
      cacheKey: 'https://api.example.com/people/1'
    });

    const response = await httpCache.fetch(new Request('https://api.example.com/people/1?foo=baz'), {
      cacheKey: 'https://api.example.com/people/1'
    });

    expect(fetch.mock.calls.length).toEqual(1);
    expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
  });

  it('does not store a response to a non-GET request', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

    await httpCache.fetch(new Request('https://api.example.com/people/1', { method: 'POST' }));

    expect(store.size).toEqual(0);
  });

  it('does not store a response with a non-success status code', async () => {
    fetch.mockResponseOnce('Internal server error', { 'Cache-Control': 'max-age=30' }, 500);

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(store.size).toEqual(0);
  });

  it('does not store a response without Cache-Control header', async () => {
    fetch.mockJSONResponseOnce({ name: 'Ada Lovelace' });

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(store.size).toEqual(0);
  });

  it('does not store a private response', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'private, max-age: 60' }, undefined, { name: 'Ada Lovelace' });

    await httpCache.fetch(new Request('https://api.example.com/me'));

    expect(store.size).toEqual(0);
  });

  it('returns a cached response when Vary header fields match', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30', Vary: 'Accept-Language' }, undefined, {
      name: 'Ada Lovelace'
    });

    await httpCache.fetch(
      new Request('https://api.example.com/people/1', {
        headers: { 'Accept-Language': 'en' }
      })
    );

    const response = await httpCache.fetch(
      new Request('https://api.example.com/people/1', {
        headers: { 'Accept-Language': 'en' }
      })
    );

    expect(fetch.mock.calls.length).toEqual(1);
    expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
  });

  it("does not return a cached response when Vary header fields don't match", async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30', Vary: 'Accept-Language' }, undefined, {
      name: 'Ada Lovelace'
    });

    await httpCache.fetch(
      new Request('https://api.example.com/people/1', {
        headers: { 'Accept-Language': 'en' }
      })
    );

    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Alan Turing' });

    const response = await httpCache.fetch(
      new Request('https://api.example.com/people/1', {
        headers: { 'Accept-Language': 'fr' }
      })
    );

    expect(fetch.mock.calls.length).toEqual(2);
    expect(await response.json()).toEqual({ name: 'Alan Turing' });
  });

  it('sets the TTL as max-age when the response does not contain revalidation headers', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });

    const storeSet = jest.spyOn(store, 'set');

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(storeSet.mock.calls[0][2]).toEqual({ ttl: 30 });

    storeSet.mockRestore();
  });

  it('sets the TTL as 2 * max-age when the response contains an ETag header', async () => {
    fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30', ETag: 'foo' }, undefined, { name: 'Ada Lovelace' });

    const storeSet = jest.spyOn(store, 'set');

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(storeSet.mock.calls[0][2]).toEqual({ ttl: 60 });

    storeSet.mockRestore();
  });

  it('revalidates a cached response when expired and returns the cached response when not modified', async () => {
    fetch.mockJSONResponseOnce(
      {
        'Cache-Control': 'public, max-age=30',
        ETag: 'foo'
      },
      undefined,
      { name: 'Ada Lovelace' }
    );

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    clock.tick(30000);

    fetch.mockResponseOnce(
      null,
      {
        'Cache-Control': 'public, max-age=30',
        ETag: 'foo'
      },
      304
    );

    const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(fetch.mock.calls.length).toEqual(2);
    expect((fetch.mock.calls[1][0] as Request).headers.get('If-None-Match')).toEqual('foo');

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
    expect(response.headers.get('Age')).toEqual('0');

    clock.tick(10000);

    const response2 = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(fetch.mock.calls.length).toEqual(2);

    expect(response2.status).toEqual(200);
    expect(await response2.json()).toEqual({ name: 'Ada Lovelace' });
    expect(response2.headers.get('Age')).toEqual('10');
  });

  it('revalidates a cached response when expired and returns and caches a fresh response when modified', async () => {
    fetch.mockJSONResponseOnce(
      {
        'Cache-Control': 'public, max-age=30',
        ETag: 'foo'
      },
      undefined,
      { name: 'Ada Lovelace' }
    );

    await httpCache.fetch(new Request('https://api.example.com/people/1'));

    clock.tick(30000);

    fetch.mockJSONResponseOnce(
      {
        'Cache-Control': 'public, max-age=30',
        ETag: 'bar'
      },
      undefined,
      { name: 'Alan Turing' }
    );

    const response = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(fetch.mock.calls.length).toEqual(2);
    expect((fetch.mock.calls[1][0] as Request).headers.get('If-None-Match')).toEqual('foo');

    expect(response.status).toEqual(200);
    expect(await response.json()).toEqual({ name: 'Alan Turing' });

    clock.tick(10000);

    const response2 = await httpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(fetch.mock.calls.length).toEqual(2);

    expect(response2.status).toEqual(200);
    expect(await response2.json()).toEqual({ name: 'Alan Turing' });
    expect(response2.headers.get('Age')).toEqual('10');
  });

  it('fetches a response from the origin with a custom fetch function', async () => {
    fetch.mockJSONResponseOnce(undefined, undefined, { name: 'Ada Lovelace' });

    const customFetch = jest.fn(fetch);
    const customHttpCache = new HTTPCache(store, customFetch);

    const response = await customHttpCache.fetch(new Request('https://api.example.com/people/1'));

    expect(customFetch.mock.calls.length).toEqual(1);
    expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
  });

  describe('when options.cacheRefreshOptions.update is truthy', () => {
    beforeEach(async () => {
      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });
      await httpCache.fetch(new Request('https://api.example.com/people/1'));
      clock.tick(10000);
      const cachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));
      if (fetch.mock.calls.length !== 1 || cachedResponse.headers.get('Age') !== '10') {
        throw Error('Error setting up cached data');
      }
    });

    it('updates the cached entry', async () => {
      fetch.mockJSONResponseOnce(undefined, undefined, { name: 'Alan Turing' });
      const updateResponse = await httpCache.fetch(
        new Request('https://api.example.com/people/1', {
          method: 'PUT',
          body: '{"name": "Alan Turing"}'
        }),
        {
          cacheRefreshOptions: { update: true }
        }
      );
      expect(await updateResponse.json()).toEqual({ name: 'Alan Turing' });

      const updatedCachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(await updatedCachedResponse.json()).toEqual({ name: 'Alan Turing' });
      expect(updatedCachedResponse.headers.get('Age')).toEqual('10');
    });

    it('ignores options.cacheRefreshOptions.evict', async () => {
      fetch.mockJSONResponseOnce(undefined, undefined, { name: 'Alan Turing' });
      await httpCache.fetch(
        new Request('https://api.example.com/people/1', {
          method: 'PUT',
          body: '{"name": "Alan Turing"}'
        }),
        {
          cacheRefreshOptions: { update: true, evict: true }
        }
      );
      const updatedCachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(await updatedCachedResponse.json()).toEqual({ name: 'Alan Turing' });
      expect(updatedCachedResponse.headers.get('Age')).toEqual('10');
    });

    it('can resolve a cacheKey when options.cacheRefreshOptions.cacheKeyResolver is a Function', async () => {
      fetch.mockJSONResponseOnce(undefined, undefined, { name: 'Alan Turing', status: 'busy' });
      const updateResponse = await httpCache.fetch(
        new Request('https://api.example.com/people/1/rpc-endpoint-with-full-entity-response', {
          method: 'POST',
          body: '{"name": "Alan Turing", "status": "busy"}'
        }),
        {
          cacheRefreshOptions: {
            update: true,
            keyResolver: (cacheKey: string): string => {
              return cacheKey.replace('/rpc-endpoint-with-full-entity-response', '');
            }
          }
        }
      );
      expect(await updateResponse.json()).toEqual({ name: 'Alan Turing', status: 'busy' });

      const updatedCachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));

      expect(await updatedCachedResponse.json()).toEqual({ name: 'Alan Turing', status: 'busy' });
      expect(updatedCachedResponse.headers.get('Age')).toEqual('10');
    });

    it('gracefully handles remote cache store errors', async () => {
      fetch.mockJSONResponseOnce(undefined, undefined, { name: 'Ada Lovelace' });
      httpCache.keyValueCache.set = jest.fn().mockImplementation(async (): Promise<void> => {
        throw Error('Redis went away');
      });

      const response = await httpCache.fetch(
        new Request('https://api.example.com/people/1', {
          method: 'PUT'
        }),
        {
          cacheRefreshOptions: { update: true }
        }
      );
      expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
    });

    describe('when options.cacheRefreshOptions.update is truthy', () => {
      beforeEach(async () => {
        clock.tick(20000);
      });
      it('skips updating cache when ttl is <= 0', async () => {
        fetch.mockJSONResponseOnce(undefined, undefined, { name: 'Ada Lovelace' });
        httpCache.keyValueCache.set = jest.fn().mockImplementation(async (): Promise<void> => {
          return Promise.reject(new Error('Should not be called'));
        });

        const response = await httpCache.fetch(
          new Request('https://api.example.com/people/1', {
            method: 'PUT'
          }),
          {
            cacheRefreshOptions: { update: true }
          }
        );
        expect(await response.json()).toEqual({ name: 'Ada Lovelace' });
        expect(httpCache.keyValueCache.set).not.toHaveBeenCalled();
      });
    });
  });

  describe('when options.cacheRefreshOptions.evict is truthy', () => {
    beforeEach(async () => {
      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Ada Lovelace' });
      await httpCache.fetch(new Request('https://api.example.com/people/1'));
      clock.tick(10000);
      const cachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));
      if (fetch.mock.calls.length !== 1 || cachedResponse.headers.get('Age') !== '10') {
        throw Error('Error setting up cached data');
      }
    });

    it('deletes the cached entry', async () => {
      fetch.mockResponseOnce({}, { 'Cache-Control': 'no-cache;' }, 204);
      await httpCache.fetch(
        new Request('https://api.example.com/people/1', {
          method: 'DELETE'
        }),
        {
          cacheRefreshOptions: { evict: true }
        }
      );

      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, { name: 'Alan Lovelace' });
      const updatedCachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));
      expect(fetch.mock.calls.length).toEqual(3); // 1 to GET Ada Lovelace, 1 to DELETE Ada Lovelace, 1 to GET Alan Lovelace
      expect(await updatedCachedResponse.json()).toEqual({ name: 'Alan Lovelace' });
      expect(updatedCachedResponse.headers.get('Age')).toBeNull(); // validate is 'live' response
    });

    it('can resolve a cacheKey when options.cacheRefreshOptions.cacheKeyResolver is a Function', async () => {
      fetch.mockResponseOnce({ id: 2, status: 'banned' }, { 'Cache-Control': 'no-cache;' }, 200);
      await httpCache.fetch(
        new Request('https://api.example.com/people/1/blacklist', {
          method: 'POST'
        }),
        {
          cacheRefreshOptions: {
            evict: true,
            keyResolver: (cacheKey: string): string => {
              return cacheKey.replace('/blacklist', '');
            }
          }
        }
      );

      fetch.mockJSONResponseOnce({ 'Cache-Control': 'max-age=30' }, undefined, {
        name: 'Woody Guthry',
        status: 'banned'
      });
      const updatedCachedResponse = await httpCache.fetch(new Request('https://api.example.com/people/1'));
      expect(fetch.mock.calls.length).toEqual(3); // 1 to GET Ada Lovelace, 1 to ban Woody, 1 to GET Woody
      expect(await updatedCachedResponse.json()).toEqual({ name: 'Woody Guthry', status: 'banned' });
      expect(updatedCachedResponse.headers.get('Age')).toBeNull(); // validate is 'live' response
    });

    it('gracefully handles remote cache store errors', async () => {
      fetch.mockResponseOnce({}, { 'Cache-Control': 'no-cache;' }, 204);
      httpCache.keyValueCache.delete = jest.fn().mockImplementation(async (): Promise<boolean | void> => {
        throw Error('Redis went away');
      });
      const response = await httpCache.fetch(
        new Request('https://api.example.com/people/1', {
          method: 'DELETE'
        }),
        {
          cacheRefreshOptions: { evict: true }
        }
      );
      expect(response.status).toEqual(204);
    });
  });
});
