import { FileImportClient } from '@dataSources/fileImportService/client';
import { FileImportSummaryInput } from '@dataSources/fileImportService/types';

export type FailedImportRow = {
  id: string;
  type: string;
  defaultValue: string;
  translatedValue: string;
  errorMessage: string;
};

export async function getSkippedRows(
  client: FileImportClient,
  input: FileImportSummaryInput
): Promise<FailedImportRow[]> {
  const importRowErrors = [];
  const response = await client.getFileImportSummary(input);
  if (!response.importRowErrors) {
    return [];
  }
  response.importRowErrors.forEach(row => {
    let id = '';
    let type = '';
    let defaultValue = '';
    let translatedValue = '';
    for (const column of row.row.columns) {
      if (column.name === 'item_id') {
        id = column.value;
      } else if (column.name === 'type') {
        type = column.value;
      } else if (column.name === 'original_text') {
        defaultValue = column.value;
      } else if (column.name === 'item_translation') {
        translatedValue = column.value;
      }
    }
    importRowErrors.push({
      id,
      type,
      defaultValue,
      translatedValue,
      errorMessage: row.error
    });
  });
  return importRowErrors;
}
