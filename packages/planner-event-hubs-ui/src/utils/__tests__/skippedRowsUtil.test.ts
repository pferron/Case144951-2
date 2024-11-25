import { mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { FileImportClient } from '@dataSources/fileImportService/client';
import { getSkippedRows } from '@utils/skippedRowsUtil';

describe('fileImportService/client', () => {
  let dataSource: FileImportClient;

  const fileImportSummaryResponse = {
    importRowErrors: [
      {
        row: {
          row: 1,
          columns: [
            {
              name: 'item_id',
              value: 'Test ID'
            },
            {
              name: 'type',
              value: 'Hub-Title'
            },
            {
              name: 'item_translation',
              value: 'The real translation'
            }
          ]
        },
        error: 'Test error message'
      }
    ]
  };

  beforeEach(() => {
    dataSource = new FileImportClient();
    dataSource.context = {};
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getSkippedRows', () => {
    it('gets empty rows', async () => {
      mockDataSource(dataSource, 'get', {});
      const input = {
        hubId: 'test-hub-id',
        importId: 'test-import-id',
        environment: 'test-env',
        locale: 'en-US'
      };
      const importRowErrors = await getSkippedRows(dataSource, input);
      expect(importRowErrors).toEqual([]);
    });

    it('gets full response', async () => {
      mockDataSource(dataSource, 'get', fileImportSummaryResponse);
      const input = {
        hubId: 'test-hub-id',
        importId: 'test-import-id',
        environment: 'test-env',
        locale: 'en-US'
      };
      const importRowErrors = await getSkippedRows(dataSource, input);
      expect(importRowErrors).toEqual([
        {
          id: 'Test ID',
          type: 'Hub-Title',
          defaultValue: '',
          translatedValue: 'The real translation',
          errorMessage: 'Test error message'
        }
      ]);
    });
  });
});
