import { FileImportHistory, Resolvers } from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('file-import');

const resolver: Resolvers = {
  Query: {
    fileImportHistory: async (_parent, args, { dataSources }, _info): Promise<FileImportHistory[]> => {
      LOG.debug('Get fileImportHistory', args.hubId);
      const response = await dataSources.videoCenterClient.getFileImportHistory(
        args.hubId,
        args.fileImportHistoryInput
      );
      const fileImportHistory = response.map(fileImportHistoryRecord => ({
        ...fileImportHistoryRecord,
        totalCount: fileImportHistoryRecord.successCount + fileImportHistoryRecord.errorCount
      }));

      return fileImportHistory;
    }
  }
};

export default resolver;
