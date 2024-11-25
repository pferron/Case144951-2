import gql from 'graphql-tag';

export default gql`
  extend type Mutation {
    uploadEntityImage(imageInput: EntityImageInput!): EntityImage @auth(methods: [BEARER], roles: [])
    deleteEntityImage(imageId: String!): Boolean @auth(methods: [BEARER], roles: [])
  }

  extend type Query {
    getEntityImage(entity: EntityInput!): EntityImage @auth(methods: [BEARER], roles: [], validateCsrf: false)
  }

  input EntityImageInput {
    name: String!
    size: Int!
    url: String!
    entity: EntityInput!
    previousImageId: String
  }

  input EntityInput {
    id: String!
    type: String!
  }

  type EntityImage {
    id: ID!
    entityId: ID!
    entityType: String!
    filename: String!
    size: Int!
    url: String!
    createdAt: String!
  }
`;
