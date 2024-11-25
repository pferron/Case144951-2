import { gql } from '@apollo/client';

export const getFileImportHistory = gql`
  query fileImportHistory($hubId: String!, $fileImportHistoryInput: FileImportHistoryInput!) {
    fileImportHistory(hubId: $hubId, fileImportHistoryInput: $fileImportHistoryInput) {
      successCount
      errorCount
      totalCount
      createdBy
      createdAt
      userId
      fileName
      accountId
      locale
      status
    }
  }
`;
