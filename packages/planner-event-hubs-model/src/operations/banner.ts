import { gql } from '@apollo/client';

export const GET_BANNERS_ASSOCIATIONS = gql`
  query bannerAssociations($bannerAssociationSearch: BannerAssociationSearch) {
    bannerAssociations(bannerAssociationSearch: $bannerAssociationSearch) {
      data {
        centerId
        entityType
        entityId
        displayOrder
        banner {
          id
          name
          layout
          imageAlignment
          imageUrl
          imageAltText
          text {
            title
            body
            alignment
            color
          }
          button {
            enabled
            text
            targetType
            internalTarget
            target
          }
        }
      }
      paging {
        currentToken
        nextToken
        limit
      }
    }
  }
`;

export const GET_BANNERS = gql`
  query banners($bannerFilter: BannerFilter!) {
    banners(bannerFilter: $bannerFilter) {
      data {
        id
        name
        layout
      }
      paging {
        currentToken
        nextToken
        limit
      }
    }
  }
`;

export const GET_BANNER = gql`
  query banner($bannersSearch: BannersSearch!) {
    banner(bannersSearch: $bannersSearch) {
      centerId
      id
      name
      layout
      imageAlignment
      imageUrl
      originalImageUrl
      imageAltText
      text {
        title
        body
        alignment
        color
      }
      button {
        enabled
        text
        targetType
        internalTarget
        target
      }
    }
  }
`;

export const HUB_PAGES_WITH_BANNER = gql`
  query hubPagesWithBanner($input: BannerHubSearch!) {
    hubPagesWithBanner(input: $input) {
      data {
        entityType
        entityId
        name
      }
    }
  }
`;

export const HUB_PAGES = gql`
  query hubPages($id: HubSearch!) {
    hubPages(id: $id) {
      data {
        entityType
        entityId
        name
      }
    }
  }
`;

// Mutations
export const CREATE_BANNER_MUTATION = gql`
  mutation bannerCreate($input: NewBanner!) {
    bannerCreate(input: $input)
  }
`;

export const UPDATE_BANNER_MUTATION = gql`
  mutation bannerUpdate($input: BannerUpdate!) {
    bannerUpdate(input: $input) {
      centerId
      id
      name
      layout
      imageAlignment
      imageUrl
      originalImageUrl
      imageAltText
      text {
        title
        body
        alignment
        color
      }
      button {
        enabled
        text
        targetType
        internalTarget
        target
      }
    }
  }
`;

export const DELETE_BANNER_MUTATION = gql`
  mutation bannerDelete($bannersSearch: BannersSearch!) {
    bannerDelete(bannersSearch: $bannersSearch)
  }
`;

export const UPDATE_BANNER_ASSOCIATIONS = gql`
  mutation setBannerAssociations($input: BannerAssociationCreate!) {
    setBannerAssociations(input: $input) {
      data {
        centerId
        entityType
        entityId
        displayOrder
        banner {
          id
          name
        }
      }
      paging {
        currentToken
        nextToken
        limit
      }
    }
  }
`;
