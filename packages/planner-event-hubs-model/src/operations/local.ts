import gql from 'graphql-tag';

export const getLocaleQuery = gql`
  query getLocale {
    locale @client
  }
`;
