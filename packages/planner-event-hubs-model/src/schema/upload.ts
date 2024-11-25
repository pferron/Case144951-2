import gql from 'graphql-tag';

export default gql`
  type Query {
    checkScanStatus(input: ScanStatusInput!): S3ProxyCallbackPayload
      @auth(methods: [BEARER], roles: ["video-center:write"])
    generatePreSignedUrl(input: PreSignedInput!): PreSignedResponse
      @auth(methods: [BEARER], roles: ["video-center:write"])
  }

  input ScanStatusInput {
    filePath: String!
  }

  type ScanStatusResponse {
    status: ScanStatus!
    failureReason: String
  }

  type S3ProxyCallbackPayload {
    fileId: String
    fullFilePath: String
    location: String
    status: ScanStatus
    failureReason: String
  }

  enum ScanStatus {
    INITIALIZED
    SCAN_IN_PROGRESS
    SCAN_SUCCESS
    SCAN_FAILED
    ERROR
  }

  input PreSignedInput {
    centerId: ID!
    entityId: ID!
    entityType: EntityType!
    fileName: String!
    fileExtension: String!
  }

  input PublishImageInput {
    accountMappingId: String!
    centerId: ID!
    entityId: ID!
    entityType: EntityType!
    fileName: String
    fileExtension: String
  }

  input ImageFieldDelta {
    newImageUrl: String
    imageUrl: String
    newOriginalImageUrl: String
    originalImageUrl: String
  }

  type PreSignedResponse {
    uploadUrl: String!
    fileId: ID!
    fullFilePath: String!
  }

  enum EntityType {
    Banner
    Logo
    Temp
    Favicon
    BackgroundImage
    Section
  }
`;
