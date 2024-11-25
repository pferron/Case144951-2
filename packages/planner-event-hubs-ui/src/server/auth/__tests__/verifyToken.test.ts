/**
 * @jest-environment node
 */
import { enableFetchMocks } from 'jest-fetch-mock';
import { AuthClient, GrantedAccessToken, GrantedApiKey } from '@cvent/auth-client';
import { verifyToken } from '../verifyToken';

enableFetchMocks();

const authClient = new AuthClient({
  endpoint: 'endpoint',
  apiKey: 'api-key'
});
const grantedAccessToken: GrantedAccessToken = {
  accessToken: '',
  csrfToken: '',
  appId: 1,
  apiKey: '',
  authorization: {},
  accessTokenTTL: 1,
  created: 1
};
jest.spyOn(authClient, 'verifyAccessToken').mockResolvedValue(grantedAccessToken);
const grantedApiKey: GrantedApiKey = {
  appId: 1,
  apiKey: '',
  authorization: {},
  created: 1
};
jest.spyOn(authClient, 'verifyApiKey').mockResolvedValue(grantedApiKey);

describe('verifyToken', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call verifyAccessToken for bearer', async () => {
    const authMethod = 'BEARER';
    const authToken = 'tokenToVerify';

    await verifyToken(authClient, authMethod, authToken);

    expect(jest.spyOn(authClient, 'verifyAccessToken')).toHaveBeenCalledWith({
      accessToken: authToken
    });
  });

  it('should call verifyAccessToken for no authMethod', async () => {
    const authToken = 'tokenToVerify';
    await verifyToken(authClient, '', authToken);

    expect(jest.spyOn(authClient, 'verifyAccessToken')).toHaveBeenCalledWith({
      accessToken: authToken
    });
  });

  it('should call verifyApiKey for bearer', async () => {
    const authMethod = 'API_KEY';
    const authToken = 'tokenToVerify';
    await verifyToken(authClient, authMethod, authToken);

    expect(jest.spyOn(authClient, 'verifyApiKey')).toHaveBeenCalledWith({
      apiKey: authToken
    });
  });

  it('should throw error when auth token is not provided', async () => {
    const authMethod = 'API_KEY';

    await expect(() => verifyToken(authClient, authMethod, '')).rejects.toThrow(
      Error('authorization is required but not provided.')
    );
  });

  it('should throw error when verification throws an error', async () => {
    const authMethod = 'API_KEY';
    const authToken = 'tokenToVerify';
    jest.spyOn(authClient, 'verifyApiKey').mockRejectedValueOnce({});

    await expect(() => verifyToken(authClient, authMethod, authToken)).rejects.toThrow(
      Error('Not authorized: method: API_KEY')
    );
  });
});
