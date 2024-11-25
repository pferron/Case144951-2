/**
 * @jest-environment node
 */
import { getAccountTokenDetails } from '@server/auth/getAccountBearerToken';
import type { NextApiRequest, NextApiResponse } from 'next';
import { readAuthToken } from '@server/auth/readAuthToken';
import { getRequestContext } from '../getRequestContext';

jest.mock('@cvent/logging/LibraryLoggerFactory', () => ({
  __esModule: true,
  createLoggerFactory: jest.fn().mockImplementation(() => ({
    create: () => {
      return { warn: jest.fn(), error: jest.fn(), debug: jest.fn(), info: jest.fn() };
    }
  }))
}));

jest.mock('@server/auth/readAuthToken');
jest.mock('@server/auth/getAccountBearerToken', () => {
  const originalModule = jest.requireActual('@server/auth/getAccountBearerToken');
  return {
    __esModule: true,
    ...originalModule,
    getAccountTokenDetails: jest.fn()
  };
});

const accountTokenDetails = {
  authorization: {
    metadata: {
      accountMappingId: 'accountMappingId',
      VideoCenterId: 'videoCenterId',
      environment: 'T2',
      accountId: `1`,
      AccountId: `1`
    },
    roles: [],
    grantedAuthorizations: [
      {
        appId: 30,
        roles: ['videos:read']
      },
      {
        appId: 35,
        roles: ['video-center:anonymous']
      }
    ]
  },
  accessToken: '9a69a442-f0af-40ca-bdde-abc19f6a0a97'
};

describe('getRequestContext tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should getRequestContext successfully for automation account', async () => {
    const metadata = { ...accountTokenDetails.authorization.metadata, accountId: process.env.TEST_ACCOUNT_ID };
    const automationTokenDetails = {
      ...accountTokenDetails,
      authorization: { ...accountTokenDetails.authorization, metadata }
    };
    jest.mocked(getAccountTokenDetails).mockResolvedValueOnce(automationTokenDetails);
    jest.mocked(readAuthToken).mockReturnValue({ authMethod: 'BEARER', authToken: 'mockToken' });
    const requestContext = getRequestContext();
    const response = await requestContext({
      req: { headers: {} } as NextApiRequest,
      res: { setHeader: jest.fn() } as unknown as NextApiResponse
    });
    expect(response.isAutomationAccount).toBe(true);
    expect(response.authorization).toBe(automationTokenDetails.authorization);
    expect(response.accountToken).toBe(`Bearer ${automationTokenDetails.accessToken}`);
    expect(response.logIds.HttpLogRequestId).toBeTruthy();
    expect(response.logIds.HttpLogPageLoadId).toBeTruthy();
  });

  it('should getRequestContext return when no headers passed', async () => {
    const requestContext = getRequestContext();
    const response = await requestContext({
      req: {} as NextApiRequest,
      res: { setHeader: jest.fn() } as unknown as NextApiResponse
    });
    expect(response).not.toBeTruthy();
  });

  it('should getRequestContext return no account token  when readAuthToken cannot find authToken', async () => {
    jest.mocked(readAuthToken).mockReturnValue({ authMethod: 'BEARER' });
    const requestContext = getRequestContext();
    const response = await requestContext({
      req: { headers: {} } as NextApiRequest,
      res: { setHeader: jest.fn() } as unknown as NextApiResponse
    });
    expect(response.accountToken).not.toBeTruthy();
  });

  it('should getRequestContext return no account token when readAuthToken return auth method other than Bearer', async () => {
    jest.mocked(readAuthToken).mockReturnValue({ authMethod: 'API_KEY', authToken: 'mockToken' });
    const requestContext = getRequestContext();
    const response = await requestContext({
      req: { headers: {} } as NextApiRequest,
      res: { setHeader: jest.fn() } as unknown as NextApiResponse
    });
    expect(response.accountToken).not.toBeTruthy();
  });

  it('should getRequestContext return no account token when getAccountTokenDetails throws exception', async () => {
    jest.mocked(getAccountTokenDetails).mockImplementation(() => {
      throw new Error();
    });
    const requestContext = getRequestContext();
    const response = await requestContext({
      req: { headers: {} } as NextApiRequest,
      res: { setHeader: jest.fn() } as unknown as NextApiResponse
    });
    expect(response.accountToken).not.toBeTruthy();
  });
});
