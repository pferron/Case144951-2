import gql from 'graphql-tag';

export default gql`
  type Query {
    searchMemberList(input: SearchMemberInput): MemberListPaginatedResult
      @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  type Mutation {
    updateMemberStatus(input: UpdateMemberStatusInput!): Success
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
  }

  input UpdateMemberStatusInput {
    hubId: ID!
    memberIds: [ID!]!
  }

  input SearchMemberInput {
    centerId: ID!
    searchTerm: String
    pageLimit: Int
    token: ID
    sort: String
  }

  type Paging {
    limit: Int
    totalCount: Int
    currentToken: String
    nextToken: String
  }

  type MemberListPaginatedResult {
    paging: Paging!
    data: [MemberListData]!
  }

  type RegistrationAge {
    years: Int!
    months: Float!
    days: Int!
  }

  type MemberListData {
    id: ID!
    firstName: String!
    lastName: String!
    jobTitle: String
    companyName: String
    emailAddress: String!
    lastLoginDate: String!
    registrationDate: String!
    mobileNumber: String
    registrationAge: RegistrationAge
  }

  type Success {
    success: Boolean
  }
`;
