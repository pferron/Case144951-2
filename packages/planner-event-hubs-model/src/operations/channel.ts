import { gql } from '@apollo/client';

export const getChannelQuery = gql`
  query channel($channelId: String!) {
    getChannelInformation(channelId: $channelId) {
      title
      description
      status
      id
      catalogId
      image {
        filename
        url
        size
        imageId
        createdAt
      }
    }
  }
`;

export const getPlannerPaginatedChannelsQuery = gql`
  query getPlannerPaginatedChannels($hubId: String!, $filterInput: FilterInput) {
    getPlannerPaginatedChannels(hubId: $hubId, filterInput: $filterInput) {
      data {
        id
        title
        description
        status
        catalogId
        imageUrl
        videoCount
        order
      }
      paging {
        currentToken
        nextToken
        limit
      }
    }
  }
`;

export const getCatalogQuery = gql`
  query getCatalog($catalogId: ID!) {
    getCatalog(catalogId: $catalogId) {
      id
      catalogType
      sectionCount
      sections {
        id
        title
        videoCount
        sectionType
        order
        videos {
          id
          displayName
          duration
          thumbnail
          sessionId
          status
          order
          videoId
          webcastId
        }
      }
      events
      catalogOwner
    }
  }
`;

// Mutation
export const createChannelMutation = gql`
  mutation createChannel($hubId: ID!, $title: String!, $description: String!, $customDomain: String) {
    createChannel(hubId: $hubId, title: $title, description: $description, customDomain: $customDomain) {
      title
      description
      status
      id
      catalogId
    }
  }
`;

export const deleteChannelMutation = gql`
  mutation deleteChannel($channelId: String!) {
    deleteChannel(channelId: $channelId)
  }
`;

export const uploadChannelImageMutation = gql`
  mutation uploadChannelImage($channelId: String!, $imageInput: ImageInput!) {
    uploadChannelImage(channelId: $channelId, imageInput: $imageInput) {
      imageId
      url
      filename
      size
      createdAt
    }
  }
`;

export const deleteChannelImageMutation = gql`
  mutation deleteChannelImage($channelId: String!, $imageId: String!) {
    deleteChannelImage(channelId: $channelId, imageId: $imageId)
  }
`;

export const updateChannelMutation = gql`
  mutation updateChannel($channelInput: ChannelInput!) {
    updateChannel(channelInput: $channelInput) {
      id
      title
      description
      status
      catalogId
      imageUrl
    }
  }
`;

export const createCatalogMutation = gql`
  mutation createCatalog($channelId: ID!, $catalogInput: CatalogInput!) {
    createCatalog(channelId: $channelId, catalogInput: $catalogInput) {
      id
      catalogType
      sectionCount
      sections {
        id
        title
        videoCount
        sectionType
        order
        videos {
          id
          displayName
          duration
          thumbnail
          sessionId
          status
          order
          videoId
          webcastId
        }
      }
      events
      catalogOwner
    }
  }
`;

export const updateCatalogMutation = gql`
  mutation updateCatalog($channelId: ID!, $catalogId: ID!, $catalogInput: CatalogInput!) {
    updateCatalog(channelId: $channelId, catalogId: $catalogId, catalogInput: $catalogInput) {
      id
      catalogType
      sectionCount
      sections {
        id
        title
        videoCount
        sectionType
        order
        videos {
          id
          displayName
          duration
          thumbnail
          sessionId
          status
          order
          videoId
          webcastId
        }
      }
      events
      catalogOwner
    }
  }
`;

export const updateChannelOrderMutation = gql`
  mutation updateChannelOrder($hubId: ID!, $channelOrderInputList: [ChannelOrderInput]!) {
    updateChannelOrder(hubId: $hubId, channelOrderInputList: $channelOrderInputList) {
      id
      order
    }
  }
`;

export const createChannelBannerAssociationMutation = gql`
  mutation createChannelBannerAssociation($input: ChannelBannerInput!) {
    createChannelBannerAssociation(input: $input) {
      channel
      banner
    }
  }
`;

export const deleteChannelBannerAssociationMutation = gql`
  mutation deleteChannelBannerAssociation($input: ChannelBannerInput!) {
    deleteChannelBannerAssociation(input: $input) {
      channel
      banner
    }
  }
`;
