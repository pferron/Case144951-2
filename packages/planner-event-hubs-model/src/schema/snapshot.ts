import gql from 'graphql-tag';

export default gql`
  type Query {
    getAccountCodeSnippets: CodeSnippetResponse @auth(methods: [BEARER], roles: ["video-center:read"])
    getAccountSnapshot: AccountSnapshot @auth(methods: [BEARER])
  }

  enum CodeSnippetStatus {
    PendingApproval
    Approved
  }

  type AccountCodeSnippet {
    codeSnippetId: String!
    codeSnippetDataTagCode: String!
    codeSnippetName: String!
    codeSnippetValue: String!
    codeSnippetStatus: CodeSnippetStatus!
    isDropCodeSnippetToCookieBannerTied: Boolean!
  }

  type CodeSnippetResponse {
    allowCodeSnippets: Boolean!
    accountCodeSnippets: [AccountCodeSnippet]
  }

  type AccountSnapshot {
    id: String
    name: String
    accountStub: String
    customFonts: [CustomFont]
  }

  type CustomFont {
    id: String
    fontFamily: String
    fallbackFontId: Int
    fallbackFont: String
    files: [FontFile]
    isActive: Boolean
  }

  type FontFile {
    url: String
    fontStyle: String
    fontWeight: Int
  }
`;
