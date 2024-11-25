import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { FileImportHistory } from '@cvent/planner-event-hubs-model/types';
import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import resolver from '@resolvers/fileImport';
import { getMockResolverRequestWithDataSources, mockDataSource } from '@resolvers/common/testUtils/mockRequestData';

describe('resolvers/fileImport/index', () => {
  let dataSources;

  const fileImportHistoryResponse: FileImportHistory[] = [
    {
      accountId: 12345,
      createdAt: 'now',
      createdBy: 'test user',
      errorCount: 3,
      fileName: 'fileName',
      locale: 'en-US',
      successCount: 1,
      totalCount: 4,
      userId: 'userId',
      status: 'COMPLETE'
    }
  ];

  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient()
    };
  });

  it('should get File Import History', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', fileImportHistoryResponse);

    const response = await resolveQueryResponse(
      resolver,
      'fileImportHistory',
      getMockResolverRequestWithDataSources('Query.fileImportHistory', dataSources, {
        hubId: 'hubId',
        fileImportHistoryInput: {
          locale: 'en-US',
          schemaName: 'video-hub-translation-import'
        }
      })
    );
    expect(response).toBeTruthy();
    expect(response.length).toBe(1);
    expect(response[0].accountId).toBe(fileImportHistoryResponse[0].accountId);
    expect(response[0].createdAt).toBe(fileImportHistoryResponse[0].createdAt);
    expect(response[0].createdBy).toBe(fileImportHistoryResponse[0].createdBy);
    expect(response[0].createdAt).toBe(fileImportHistoryResponse[0].createdAt);
    expect(response[0].errorCount).toBe(fileImportHistoryResponse[0].errorCount);
    expect(response[0].fileName).toBe(fileImportHistoryResponse[0].fileName);
    expect(response[0].locale).toBe(fileImportHistoryResponse[0].locale);
    expect(response[0].successCount).toBe(fileImportHistoryResponse[0].successCount);
    expect(response[0].totalCount).toBe(fileImportHistoryResponse[0].totalCount);
    expect(response[0].userId).toBe(fileImportHistoryResponse[0].userId);
    expect(response[0].status).toBe(fileImportHistoryResponse[0].status);
  });
});
