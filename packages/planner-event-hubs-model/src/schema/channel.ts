import gql from 'graphql-tag';

export default gql`
  type Query {
    getChannelInformation(channelId: String): ChannelInformation @auth(methods: [BEARER], roles: [])
    getPlannerPaginatedChannels(hubId: String!, filterInput: FilterInput): PlannerPaginatedChannels
      @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  type Mutation {
    deleteChannelImage(channelId: String!, imageId: String!): Boolean @auth(methods: [BEARER], roles: [])
    createChannel(hubId: ID!, title: String!, description: String!, customDomain: String): Channel
      @auth(methods: [BEARER], roles: [])
    deleteChannel(channelId: String!): Boolean @auth(methods: [BEARER], roles: [])
    uploadChannelImage(channelId: String!, imageInput: ImageInput!): ChannelImage @auth(methods: [BEARER], roles: [])
    updateChannel(channelInput: ChannelInput!): Channel @auth(methods: [BEARER], roles: [])
    createChannelBannerAssociation(input: ChannelBannerInput!): ChannelBannerOutput @auth(methods: [BEARER], roles: [])
    deleteChannelBannerAssociation(input: ChannelBannerInput!): ChannelBannerOutput @auth(methods: [BEARER], roles: [])
    updateChannelOrder(hubId: ID!, channelOrderInputList: [ChannelOrderInput]): [ChannelOrder]
      @auth(methods: [BEARER], roles: [])
  }

  input ChannelOrderInput {
    id: ID!
    existingOrder: Int!
    order: Int!
  }

  type ChannelOrder {
    id: ID!
    order: Int!
  }

  input ChannelInput {
    id: ID!
    title: String!
    description: String!
    status: ChannelStatus!
  }

  input ImageInput {
    filename: String!
    size: Int!
    url: String!
  }

  enum ChannelStatus {
    ACTIVE
    INACTIVE
  }

  type ChannelImage {
    imageId: ID!
    url: String!
    filename: String!
    size: Int!
    createdAt: String!
  }
  type ChannelInformation {
    id: ID!
    title: String!
    description: String!
    status: ChannelStatus!
    catalogId: ID
    image: ChannelImage
  }
  type Channel {
    id: ID!
    title: String!
    description: String!
    status: ChannelStatus!
    catalogId: ID
    imageUrl: String
    banners: [String]
  }
  type PlannerChannelListObject {
    id: ID!
    title: String!
    description: String!
    status: ChannelStatus!
    catalogId: ID
    imageUrl: String
    videoCount: Int!
    order: Int!
  }
  type VideoHubChannel {
    id: ID!
    title: String!
    description: String!
    status: ChannelStatus!
    catalogId: ID
    imageUrl: String
    shortUrl: String
    order: Int!
    banners: [String]!
  }
  type PlannerPaginatedChannels {
    paging: Paging!
    data: [PlannerChannelListObject]!
  }
  type MemberPaginatedChannels {
    paging: Paging!
    data: [VideoHubChannel]!
  }
  type Paging {
    limit: Int
    currentToken: String!
    nextToken: String
  }
  input FilterInput {
    filter: String
    sort: String
    limit: Int
    token: String
  }
  input ChannelBannerInput {
    channel: String!
    banner: String!
    order: Int
  }
  type ChannelBannerOutput {
    channel: String!
    banner: String!
  }
`;
