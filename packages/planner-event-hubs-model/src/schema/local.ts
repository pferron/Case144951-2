import gql from 'graphql-tag';

export default gql`
  directive @client on FIELD

  extend type Query {
    darkMode: Boolean
    locale: String
  }
`;
