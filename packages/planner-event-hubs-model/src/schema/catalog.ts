import gql from 'graphql-tag';

export default gql`
  type Query {
    getCatalog(catalogId: ID!): Catalog @auth(methods: [BEARER], roles: [])
  }
  type Mutation {
    createCatalog(channelId: ID!, catalogInput: CatalogInput!): Catalog @auth(methods: [BEARER], roles: [])
    updateCatalog(channelId: ID!, catalogId: ID!, catalogInput: CatalogInput!): Catalog
      @auth(methods: [BEARER], roles: [])
  }
  enum SectionType {
    DEFAULT
    CUSTOM
  }
  enum CatalogType {
    LIST
    SECTIONS
  }
  enum CatalogOwnerType {
    ON_DEMAND
    VIDEO_HUB
  }

  input VideoInput {
    videoId: ID!
  }

  enum VideoStatus {
    Started
    Uploaded
    Scanning
    Scanned
    Syncing
    Rejected
    Error
    Available
    Upcoming
    ReSyncing
  }

  type CatalogVideo {
    id: ID!
    displayName: String!
    duration: Int!
    thumbnail: String
    sessionId: ID
    status: VideoStatus
    order: Int
    videoId: ID!
    webcastId: ID
  }

  input SectionInput {
    id: ID!
    title: String!
    sectionType: SectionType!
    videos: [VideoInput]
  }

  type CatalogSection {
    id: ID!
    title: String!
    videoCount: Int!
    sectionType: SectionType!
    order: Int!
    videos: [CatalogVideo]
  }

  input CatalogInput {
    catalogType: CatalogType!
    sections: [SectionInput]!
    catalogOwner: CatalogOwnerType!
  }
  type Catalog {
    id: ID!
    sectionCount: Int!
    catalogType: CatalogType!
    sections: [CatalogSection]!
    events: [ID]
    catalogOwner: CatalogOwnerType!
    created: String
    lastModified: String
  }
`;
