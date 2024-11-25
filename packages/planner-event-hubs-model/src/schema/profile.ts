import gql from 'graphql-tag';

export default gql`
  type Query {
    getMemberData(input: MemberDataInput!): MemberData @auth(methods: [BEARER], roles: [])
  }

  input MemberDataInput {
    centerId: ID!
    contactId: ID!
  }

  type MemberData {
    profile: MemberProfile!
    visibility: Boolean
    termsAccepted: Boolean
  }

  type MemberProfileVisible {
    visible: Boolean!
  }
  type RegistrationAge {
    years: Int!
    months: Float!
  }
  type Compliance {
    creationTime: String
    complianceScope: String
    action: String
    createdBy: String
  }
  type MemberProfile {
    firstName: String!
    lastName: String!
    prefix: String
    designation: String
    jobTitle: String
    companyName: String
    socialMediaLinks: SocialMediaLinks
    emailAddress: String!
    profileImageUrl: Url
    lastLoginDate: String
    registrationDate: String
    mobileNumber: String
    registrationAge: RegistrationAge
    compliance: Compliance
  }

  input MemberProfileUpdate {
    centerId: ID!
    contactId: ID!
    memberProfile: MemberProfileInput!
  }

  input MemberProfileInput {
    firstName: String!
    lastName: String!
    prefix: String
    designation: String
    jobTitle: String
    companyName: String
    socialMediaLinks: SocialMediaLinksInput
  }

  type SocialMediaLinks {
    facebookUrl: Url
    twitterUrl: Url
    linkedinUrl: Url
  }

  type Url {
    href: String
  }

  input SocialMediaLinksInput {
    facebookUrl: UrlInput
    twitterUrl: UrlInput
    linkedinUrl: UrlInput
  }

  input UrlInput {
    href: String!
  }

  input MemberVisibilityInput {
    centerId: ID!
    contactId: ID!
    visible: Boolean!
  }
`;
