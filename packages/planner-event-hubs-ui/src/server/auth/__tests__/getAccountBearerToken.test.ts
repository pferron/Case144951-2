/**
 * @jest-environment node
 */
import { getAccountBearerToken } from '@server/auth/getAccountBearerToken';
import verifyResponse from '@server/auth/__tests__/fixtures/verifyResponse.json';
import verifyPlannerResponse from '@server/auth/__tests__/fixtures/verifyPlannerResponse.json';
import metadataNotPresentResponse from '@server/auth/__tests__/fixtures/metadataNotPresentResponse.json';
import { mockFunction } from '@resolvers/common/testUtils/mockFunction';
import { verifyAccessToken } from '@server/verifyAccessToken';
import { verifyToken } from '@server/auth/verifyToken';
import { RedisCache } from '@server/cache/RedisCache';

const originalEnv = { ...process.env };
const receivedBearerToken = 'mock123';

jest.mock('@server/verifyAccessToken', () => {
  return { ...jest.requireActual('@server/verifyAccessToken'), verifyAccessToken: jest.fn() };
});

jest.mock('@server/auth/verifyToken', () => {
  return { ...jest.requireActual('@server/auth/verifyToken'), verifyToken: jest.fn() };
});

const mockVerifyToken = mockFunction(verifyAccessToken);
const mockVerifyTokenWithAuthClient = mockFunction(verifyToken);
mockVerifyToken.mockImplementation(() => {
  return Promise.resolve(verifyResponse);
});

mockVerifyTokenWithAuthClient.mockImplementation(() => {
  return Promise.resolve(verifyResponse);
});

describe('Account Bearer Token', () => {
  afterEach(() => {
    jest.clearAllMocks();
    process.env = originalEnv;
  });

  it('should return original token for planner', async () => {
    jest.spyOn(RedisCache.prototype, 'get').mockImplementation(() => null);
    jest.spyOn(RedisCache.prototype, 'set').mockImplementation(() => null);
    mockVerifyToken.mockImplementation(() => {
      return Promise.resolve(verifyPlannerResponse);
    });
    const token = await getAccountBearerToken(receivedBearerToken);
    expect(token).toEqual('mock123');
  });

  it('should return original token when metadata is not present', async () => {
    jest.spyOn(RedisCache.prototype, 'get').mockImplementation(() => null);
    jest.spyOn(RedisCache.prototype, 'set').mockImplementation(() => null);
    mockVerifyToken.mockImplementation(() => {
      return Promise.resolve(metadataNotPresentResponse);
    });
    const token = await getAccountBearerToken(receivedBearerToken);
    expect(token).toEqual('mock123');
  });

  it('should throw error when metadata is not present and received token is null', async () => {
    mockVerifyToken.mockImplementation(() => {
      return Promise.resolve(verifyResponse);
    });

    jest.spyOn(RedisCache.prototype, 'get').mockImplementation(() => null);
    jest.spyOn(RedisCache.prototype, 'set').mockImplementation(() => null);
    mockVerifyToken.mockImplementation(() => {
      return Promise.resolve(metadataNotPresentResponse);
    });
    await expect(getAccountBearerToken(null)).rejects.toThrow(
      'Could not create accountBearerToken and no valid receivedToken to return either.'
    );
  });
});
