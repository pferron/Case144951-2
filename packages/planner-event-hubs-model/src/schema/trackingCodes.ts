import { gql } from '@apollo/client';

export default gql`
  type Query {
    getHubCodeSnippets(hubId: String!): [HubCodeSnippets]! @auth(methods: [BEARER], roles: ["video-center:read"])
    getGoogleMeasurementId(hubId: String!): MeasurementIdResponse @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  type Mutation {
    saveCodeSnippet(input: CodeSnippetInput!): CodeSnippet
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])

    updateCodeSnippet(input: CodeSnippetInput!): CodeSnippet
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])

    saveGoogleMeasurementId(input: MeasurementIdInput!): MeasurementIdResponse
      @auth(methods: [BEARER], roles: ["video-center:write"])

    removeCodeSnippet(input: RemoveCodeSnippetInput!): Success @auth(methods: [BEARER], roles: ["video-center:write"])
  }

  input CodeSnippetInput {
    hubId: ID!
    codeSnippetId: ID!
    applicableOn: ApplicableOn!
    addToAllPages: Boolean
    addToLoginPage: Boolean
    addToSingleVideoPage: Boolean
  }

  type CodeSnippet {
    codeSnippetId: ID!
    applicableOn: ApplicableOn
    addToAllPages: Boolean
    addToLoginPage: Boolean
    addToSingleVideoPage: Boolean
  }

  enum ApplicableOn {
    INITIALIZATION
    ALL_PAGES
  }

  enum TargetWebPages {
    LOGIN
    ALL_VC_PAGES
    SINGLE_VIDEOS_PAGE
  }

  type HubCodeSnippets {
    codeSnippetId: String!
    applicableOn: ApplicableOn!
    targetWebPages: [TargetWebPages]!
  }

  input MeasurementIdInput {
    hubId: String!
    oldMeasurementId: String!
    newMeasurementId: String!
  }

  type MeasurementIdResponse {
    measurementId: String!
  }

  interface CodeSnippetHubRequest {
    codeSnippetId: String!
    applicableOn: ApplicableOn
    targetWebPages: [TargetWebPages]
  }

  interface CodeSnippetHubResponse {
    id: ID!
    applicableOn: ApplicableOn!
    targetWebpages: [TargetWebPages]
    created: String
    lastModified: String
    createdBy: String
    lastModifiedBy: String
  }

  input RemoveCodeSnippetInput {
    hubId: ID!
    codeSnippetId: ID!
  }

  type Success {
    success: Boolean
  }
`;
