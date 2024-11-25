import gql from 'graphql-tag';

export default gql`
  type Mutation {
    subscriptionToken: OneTimeToken @auth(methods: [BEARER], roles: [])
  }

  type OneTimeToken {
    token: String!
  }
`;
