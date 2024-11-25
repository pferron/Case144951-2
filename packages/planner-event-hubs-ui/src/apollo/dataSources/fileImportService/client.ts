// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { FileImportSummary, FileImportSummaryInput } from '@dataSources/fileImportService/types';
import { CvestDataSource } from '../CvestDataSource';

const LOG = LoggerFactory.create('file-import-service');

export class FileImportClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.FILE_IMPORT_SERVICE_URL}/v1`;
  }

  public async getFileImportSummary(input: FileImportSummaryInput): Promise<FileImportSummary> {
    LOG.debug('getFileImportSummary()', input.hubId, input.importId);
    return this.get(`/events/${input.hubId}/imports/${input.importId}/import-summary`, {
      environment: input.environment,
      locale: input.locale
    });
  }
}
