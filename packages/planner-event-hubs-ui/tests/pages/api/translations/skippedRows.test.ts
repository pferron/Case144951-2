import endpoint from '@pages/api/translations/skippedRows';
import type { PageConfig } from 'next';
import { testApiHandler } from 'next-test-api-route-handler';

import { FileImportClient } from '@dataSources/fileImportService/client';
import { FileImportSummary } from '@dataSources/fileImportService/types';
import { getAccessTokenFromAuthCookie } from '@cvent/nextjs/auth';
import { verifyAccessTokenHelper } from '@utils/authUtils';

const pagesHandler: typeof endpoint & { config?: PageConfig } = endpoint;

jest.mock('@dataSources/fileImportService/client');
jest.mock('ioredis');
jest.mock('@cvent/nextjs/auth');
jest.mock('@utils/authUtils');
const accessToken = 'testAccessToken';
const auth = { user: 'test-user' };

describe('/api/translations/skippedRows', () => {
  beforeEach(() => {
    (getAccessTokenFromAuthCookie as jest.Mock).mockReturnValue(accessToken);
    (verifyAccessTokenHelper as jest.Mock).mockResolvedValue(auth);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('request should fail with internal server error', async () => {
    jest.spyOn(FileImportClient.prototype, 'getFileImportSummary').mockImplementation(() => {
      throw new Error('Not found');
    });
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET', headers: { authorization: 'bearer 1234' } });
        expect(res.status).toEqual(500);
      },
      params: { hubId: 'test-hub-id', locale: 'en-US' }
    });
  });

  it('request should fail if the wrong method is given', async () => {
    jest
      .spyOn(FileImportClient.prototype, 'getFileImportSummary')
      .mockImplementation(async (): Promise<FileImportSummary> => {
        return {
          failedRowCount: 0,
          skippedRowCount: 0,
          successRowCount: 0,
          skippedRows: [],
          importRowErrors: [],
          totalRowCount: 0,
          totalErrorCount: 0,
          unknownErrorRowCount: 0,
          validationErrorRowCount: 0,
          importErrorRows: [],
          unknownErrorRows: [],
          validationErrorRows: []
        };
      });
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE', headers: { authorization: 'api_key 1234' } });
        expect(res.status).toEqual(400);
      },
      params: {}
    });
  });

  it('should return file', async () => {
    // jest.spyOn(AuthClient.prototype, 'verifyAccessToken').mockImplementation(jest.fn());
    jest
      .spyOn(FileImportClient.prototype, 'getFileImportSummary')
      .mockImplementation(async (): Promise<FileImportSummary> => {
        return {
          failedRowCount: 0,
          skippedRowCount: 0,
          successRowCount: 0,
          skippedRows: [],
          importRowErrors: [],
          totalRowCount: 0,
          totalErrorCount: 0,
          unknownErrorRowCount: 0,
          validationErrorRowCount: 0,
          importErrorRows: [],
          unknownErrorRows: [],
          validationErrorRows: []
        };
      });
    await testApiHandler({
      pagesHandler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'GET', headers: { authorization: 'BEARER 1234' } });
        expect(res.status).toEqual(200);
      },
      params: { hubId: 'test-hub-id', importId: 'test-import-id', environment: 'test-env', locale: 'en-US' }
    });
  });
});
