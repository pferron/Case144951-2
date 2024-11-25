import gql from 'graphql-tag';

export default gql`
  type Query {
    getContact(contactId: ID!): ContactInformation @auth(methods: [BEARER], roles: [])
    searchContacts(input: ContactSearchInput): PaginatedContactsResult
      @auth(methods: [BEARER], roles: ["contacts:read"])
    searchContactGroups(input: ContactGroupSearchInput): PaginatedContactGroups
      @auth(methods: [BEARER], roles: ["contact-groups:read"])
    getAllowedContactGroups(input: GetAllowedContactGroupsInput!): AllowedContactGroups
      @auth(methods: [BEARER], roles: ["video-center:read"])
    searchContactTypes(input: ContactSearchInput): PaginatedContactTypes
      @auth(methods: [BEARER], roles: ["contact-types:read"])
    getBlockedContacts(input: GetBlockedContactsInput!): BlockedContacts
      @auth(methods: [BEARER], roles: ["video-center:read"])
    getAllowedContactTypes(input: GetAllowedContactTypesInput!): AllowedContactTypes
      @auth(methods: [BEARER], roles: ["video-center:read"])
    getBlockedContactGroups(input: GetBlockedContactGroupsInput!): BlockedContactGroups
      @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  type Mutation {
    saveContactGroups(input: ContactGroupsInput!): AllowedContactGroups
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
    saveContactTypes(input: ContactTypesInput!): AllowedContactTypes
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
    deleteContactTypes(input: ContactTypesInput!): DeleteContactTypesResponse
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
    saveBlockedContacts(input: BlockedContactsInput!): BlockedContacts
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
    deleteBlockedContacts(input: BlockedContactsInput!): Success
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
    saveBlockedContactGroups(input: BlockedContactGroupsInput!): BlockedContactGroups
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
    deleteBlockedContactGroups(input: BlockedContactGroupsInput!): Success
      @auth(methods: [BEARER], validateCsrf: true, roles: ["video-center:write"])
  }

  type ContactInformation {
    id: ID!
    firstName: String
    lastName: String
    email: String
    bio: String
    image: ContactImage
    pronoun: String
    designation: String
    company: String
  }

  type ContactImage {
    href: String
  }

  input ContactGroupsInput {
    id: ID!
    contactGroups: [String]!
  }

  input ContactTypesInput {
    id: ID!
    contactTypes: [String]!
  }

  input BlockedContactGroupsInput {
    id: ID!
    blockedContactGroups: [String]!
  }

  type AllowedContactGroups {
    contactGroups: [String]!
  }

  type BlockedContactGroups {
    contactGroups: [String]!
  }

  type AllowedContactTypes {
    contactTypes: [String]!
  }

  type DeleteContactTypesResponse {
    deleteContactTypes: Boolean
  }

  input BlockedContactsInput {
    id: ID!
    blockedContacts: [String]!
  }

  type BlockedContacts {
    blockedContacts: [String]!
  }

  type Success {
    success: Boolean
  }

  input ContactSearchInput {
    searchTerm: String
    token: String
    limit: Int
  }

  input ContactGroupSearchInput {
    searchTerm: String
    token: String
    limit: Int
    type: String
  }

  type PaginatedContactsResult {
    paging: PagingResponse!
    data: [ContactData]!
  }

  type ContactData {
    id: ID!
    firstName: String
    lastName: String
    email: String
  }

  type PaginatedContactGroups {
    paging: PagingResponse!
    data: [ContactGroupData!]
  }

  type ContactGroupData {
    id: ID!
    name: String!
  }

  type PaginatedContactTypes {
    paging: PagingResponse!
    data: [ContactTypesData!]
  }

  type ContactTypesData {
    id: ID!
    name: String!
  }

  input GetAllowedContactGroupsInput {
    id: ID!
  }

  input GetAllowedContactTypesInput {
    id: ID!
  }

  input GetBlockedContactsInput {
    id: ID!
  }

  input GetBlockedContactGroupsInput {
    id: ID!
  }
`;
