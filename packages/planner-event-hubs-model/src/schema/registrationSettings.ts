import gql from 'graphql-tag';

export default gql`
  type Mutation {
    saveEmailDomains(input: EmailDomainsInput!): AllowedDomains
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
  }

  type Query {
    getEmailDomains(input: GetEmailDomainsInput!): AllowedDomains @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  input EmailDomainsInput {
    id: ID!
    emailDomains: [String]!
  }

  type AllowedDomains {
    emailDomains: [String]!
  }

  input GetEmailDomainsInput {
    id: ID!
  }
`;
