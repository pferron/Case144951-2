// RED
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  fetch,
  Request,
  Response,
  Headers,
  Body,
  BodyInit,
  HeadersInit,
  URL,
  URLSearchParams
} from 'apollo-server-env';

interface FetchMock extends jest.MockedFunction<typeof fetch> {
  mockResponseOnce(data?: any, headers?: HeadersInit, status?: number): this;
  mockJSONResponseOnce(headers?: HeadersInit, status?: number, data?: object): this;
}

const mockFetch = jest.fn(fetch) as unknown as FetchMock;

mockFetch.mockResponseOnce = (data?: BodyInit, headers?: any, status = 200): any => {
  return mockFetch.mockImplementationOnce(async () => {
    return new Response(data, {
      status,
      headers
    });
  });
};

mockFetch.mockJSONResponseOnce = (headers?: any, status?: number, data = {}): any => {
  return mockFetch.mockResponseOnce(JSON.stringify(data), { 'Content-Type': 'application/json', ...headers }, status);
};

const env = {
  Body,
  URL,
  URLSearchParams,
  fetch: mockFetch,
  Request,
  Response,
  Headers
};

jest.doMock('apollo-server-env', () => env);

export { mockFetch as fetch, Request, Response, Body, Headers, URL, URLSearchParams };
