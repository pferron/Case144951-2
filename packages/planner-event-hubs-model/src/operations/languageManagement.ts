import { gql } from '@apollo/client';

export const GET_TRANSLATIONS = gql`
  query getTranslations($input: TranslationSearch!) {
    getTranslations(input: $input) {
      paging {
        limit
        currentToken
        nextToken
        previousToken
        totalCount
      }
      data {
        type
        locale
        id
        translatedValue
        defaultValue
      }
    }
  }
`;

export const SET_TRANSLATIONS = gql`
  mutation setTranslations($input: HubSearch!, $locale: String!, $data: [TranslationInput]) {
    setTranslations(input: $input, locale: $locale, data: $data) {
      Failure {
        type
        locale
        id
        translatedValue
      }
      Success {
        type
        locale
        id
        translatedValue
      }
    }
  }
`;

export const RESET_TRANSLATIONS = gql`
  mutation resetTranslations($input: ResetTranslationSearch!) {
    resetTranslations(input: $input)
  }
`;
