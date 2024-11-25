import gql from 'graphql-tag';

export default gql`
  type Query {
    getCustomDomainForHub(hubId: ID!): CustomDomainMapping @auth(methods: [BEARER])
    getCustomDomainForAccount: [CustomDomain] @auth(methods: [BEARER])
  }

  type Mutation {
    createHubCustomDomainMapping(input: CustomDomainMappingInput): CustomDomainMapping @auth(methods: [BEARER])
    updateHubCustomDomainMapping(input: CustomDomainMappingInput): CustomDomainMapping @auth(methods: [BEARER])
    deleteHubCustomDomainMapping(hubId: ID!): Boolean @auth(methods: [BEARER])
  }

  type CustomDomain {
    customDomainId: ID
    domainName: String
  }

  input CustomDomainMappingInput {
    entityId: ID!
    customDomainId: ID!
    trailingName: String
  }

  type CustomDomainMapping {
    entityId: ID!
    customDomainId: ID!
    trailingName: String
  }
`;
