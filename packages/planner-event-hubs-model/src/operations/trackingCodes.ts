import { gql } from '@apollo/client';

export const saveCodeSnippet = gql`
  mutation saveCodeSnippet($input: CodeSnippetInput!) {
    saveCodeSnippet(input: $input) {
      codeSnippetId
      applicableOn
      addToAllPages
      addToLoginPage
      addToSingleVideoPage
    }
  }
`;

export const updateCodeSnippet = gql`
  mutation updateCodeSnippet($input: CodeSnippetInput!) {
    updateCodeSnippet(input: $input) {
      codeSnippetId
      applicableOn
      addToAllPages
      addToLoginPage
      addToSingleVideoPage
    }
  }
`;

export const removeCodeSnippet = gql`
  mutation removeCodeSnippet($input: RemoveCodeSnippetInput!) {
    removeCodeSnippet(input: $input) {
      success
    }
  }
`;

export const getGoogleMeasurementQuery = gql`
  query getGoogleMeasurementId($hubId: String!) {
    getGoogleMeasurementId(hubId: $hubId) {
      measurementId
    }
  }
`;

export const saveGoogleMeasurementMutation = gql`
  mutation saveGoogleMeasurementId($input: MeasurementIdInput!) {
    saveGoogleMeasurementId(input: $input) {
      measurementId
    }
  }
`;
