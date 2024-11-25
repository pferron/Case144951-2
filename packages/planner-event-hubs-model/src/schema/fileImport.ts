import gql from 'graphql-tag';

export default gql`
  extend type Query {
    fileImportHistory(hubId: String!, fileImportHistoryInput: FileImportHistoryInput): [FileImportHistory]
      @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  """
  FileImportHistory
  """
  type FileImportHistory {
    successCount: Int!
    errorCount: Int!
    totalCount: Int!
    createdBy: String!
    createdAt: String!
    userId: String!
    fileName: String!
    accountId: Int!
    locale: String
    status: String
  }

  type FileImportHistoryParams {
    locale: String
  }

  input FileImportHistoryInput {
    schemaName: String!
    locale: String
  }
`;
