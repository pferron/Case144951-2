import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { FileImportClient } from '@dataSources/fileImportService/client';

describe('fileImportService/client', () => {
  let dataSource: FileImportClient;

  beforeEach(() => {
    dataSource = new FileImportClient();
    dataSource.context = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFileImportSummary', () => {
    it('calls GET fileImportSummary', () => {
      mockDataSource(dataSource, 'get', {});
      const input = {
        hubId: 'test-hub-id',
        importId: 'test-import-id',
        environment: 'test-env',
        locale: 'en-US'
      };
      dataSource.getFileImportSummary(input);
      expect(dataSource.get).toHaveBeenCalledWith('/events/test-hub-id/imports/test-import-id/import-summary', {
        environment: 'test-env',
        locale: 'en-US'
      });
    });
  });
});
