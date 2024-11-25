import { gql } from '@apollo/client';

export const getAccountCodeSnippets = gql`
  query getAccountCodeSnippets {
    getAccountCodeSnippets {
      allowCodeSnippets
      accountCodeSnippets {
        codeSnippetId
        codeSnippetDataTagCode
        codeSnippetName
        codeSnippetValue
        codeSnippetStatus
        isDropCodeSnippetToCookieBannerTied
      }
    }
  }
`;

export const getAccountSnapshotQuery = gql`
  query getAccountSnapshot {
    getAccountSnapshot {
      id
      name
      accountStub
      customFonts {
        id
        fontFamily
        fallbackFontId
        fallbackFont
        files {
          url
          fontStyle
          fontWeight
        }
        isActive
      }
    }
  }
`;
