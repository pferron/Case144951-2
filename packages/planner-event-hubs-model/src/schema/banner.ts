import gql from 'graphql-tag';

export default gql`
  type Query {
    banner(bannersSearch: BannersSearch!): ExistingBanner @auth(methods: [BEARER], roles: [])
    banners(bannerFilter: BannerFilter!): BannerPagingResponse @auth(methods: [BEARER], roles: [])
    bannerAssociations(bannerAssociationSearch: BannerAssociationSearch): BannerAssociationPaging
      @auth(methods: [BEARER], roles: ["video-center:read"])
  }
  type Mutation {
    bannerCreate(input: NewBanner!): String @auth(methods: [BEARER], roles: [])
    bannerDelete(bannersSearch: BannersSearch!): String @auth(methods: [BEARER], roles: [])
    bannerUpdate(input: BannerUpdate!): ExistingBanner @auth(methods: [BEARER], roles: [])
    setBannerAssociations(input: BannerAssociationCreate): BannerAssociationPaging
      @auth(methods: [BEARER], roles: ["video-center:write"])
  }

  input BannersSearch {
    centerId: String!
    bannerId: String!
  }

  input BannerSearch {
    hubId: String!
    token: String
    limit: Int
  }

  input BannerHubSearch {
    hubId: String!
    bannerId: String!
  }

  input BannerFilter {
    centerId: String!
    filterInput: FilterInput
  }

  type ExistingBanner {
    id: ID!
    centerId: String!
    name: String!
    layout: String!
    imageAlignment: String
    text: BannerText
    button: BannerButton
    imageUrl: String
    originalImageUrl: String
    imageRelativePath: String
    imageAltText: String
  }

  input BannerUpdate {
    centerId: String!
    id: ID!
    name: String
    layout: String
    imageAlignment: String
    text: BannerTextInput
    button: BannerButtonInput
    imageUrl: String
    originalImageUrl: String
    imageRelativePath: String
    imageAltText: String
    newImageUrl: String
    newOriginalImageUrl: String
  }

  type BannerText {
    title: String
    body: String
    alignment: String
    color: String
  }

  type BannerButton {
    enabled: Boolean!
    text: String
    target: String
    targetType: String
    internalTarget: String
  }

  type BannerPagingResponse {
    data: [ExistingBanner]!
    paging: Paging!
  }

  input NewBanner {
    centerId: String!
    name: String!
    layout: String!
    imageAlignment: String
    text: BannerTextInput
    button: BannerButtonInput
    imageAltText: String
  }

  input BannerTextInput {
    title: String
    body: String
    alignment: String
    color: String
  }

  input BannerButtonInput {
    enabled: Boolean!
    text: String
    target: String
    targetType: String
    internalTarget: String
  }

  input IdBanner {
    id: String!
  }

  input BannerIdAssociation {
    banner: IdBanner!
    displayOrder: Int
  }

  input BannerAssociation {
    banner: String!
    displayOrder: Int
  }

  input BannerAssociationSearch {
    centerId: String!
    entityId: String
    bannerId: String
    token: String
    limit: Int
    entityType: String
  }

  input BannerAssociationCreate {
    centerId: String!
    entityType: String!
    entityId: String!
    bannerAssociation: [BannerAssociation]
  }

  input BannerIdAssociationCreate {
    centerId: String!
    entityType: String!
    entityId: String!
    bannerAssociation: [BannerIdAssociation]
  }

  type BannerAssociationPaging {
    data: [ExistingBannerAssociationWithBanner]!
    paging: Paging!
  }

  type ExistingBannerAssociationWithBanner {
    centerId: String!
    entityType: String!
    entityId: String!
    displayOrder: Int
    banner: ExistingBanner
  }
`;
