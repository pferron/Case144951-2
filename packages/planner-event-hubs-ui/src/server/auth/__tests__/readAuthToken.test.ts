/**
 * @jest-environment node
 */
import { readAuthToken } from '../readAuthToken';

describe('readAuthToken', () => {
  it('should return empty token if no headers provided', async () => {
    const response = readAuthToken({});
    expect(response).toMatchObject({});
  });

  it('should read capitalized authorization successfully', async () => {
    const response = readAuthToken({
      AUTHORIZATION: 'BEARER mockToken'
    });

    expect(response).toBeDefined();
    expect(response.authMethod).toEqual('BEARER');
    expect(response.authToken).toEqual('mockToken');
  });

  it('should read lowercase authorization successfully', async () => {
    const response = readAuthToken({
      authorization: 'BEARER mockToken'
    });

    expect(response).toBeDefined();
    expect(response.authMethod).toEqual('BEARER');
    expect(response.authToken).toEqual('mockToken');
  });

  it('should read funny cased authorization successfully', async () => {
    const response = readAuthToken({
      aUThORIzATION: 'BEARER mockToken'
    });

    expect(response).toBeDefined();
    expect(response.authMethod).toEqual('BEARER');
    expect(response.authToken).toEqual('mockToken');
  });

  it('should read capitalized cookie successfully', async () => {
    const response = readAuthToken({
      COOKIE: 'cvent-auth=mockToken;'
    });

    expect(response).toBeDefined();
    expect(response.authMethod).toEqual('BEARER');
    expect(response.authToken).toEqual('mockToken');
  });

  it('should read lowercase cookie successfully', async () => {
    const response = readAuthToken({
      cookie: 'cvent-auth=mockToken;'
    });

    expect(response).toBeDefined();
    expect(response.authMethod).toEqual('BEARER');
    expect(response.authToken).toEqual('mockToken');
  });

  it('should read funny cased cookie successfully', async () => {
    const response = readAuthToken({
      cOoKie: 'cvent-auth=mockToken;'
    });

    expect(response).toBeDefined();
    expect(response.authMethod).toEqual('BEARER');
    expect(response.authToken).toEqual('mockToken');
  });
});
