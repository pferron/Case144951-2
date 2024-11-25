import gql from 'graphql-tag';

export default gql`
  type Query {
    user: UserDetails @auth(methods: [BEARER], roles: [])
  }

  type UserDetails {
    firstName: String
    lastName: String
    email: String
    company: String
    url: Url
    viewProfileText: String
  }
`;
