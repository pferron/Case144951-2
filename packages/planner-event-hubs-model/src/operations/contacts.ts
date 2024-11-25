import { gql } from '@apollo/client';

export const getContactQuery = gql`
  query getContact($contactId: ID!) {
    getContact(contactId: $contactId) {
      id
      firstName
      lastName
      bio
      pronoun
      designation
      company
      image {
        href
      }
    }
  }
`;

export const searchContactsQuery = gql`
  query searchContacts($input: ContactSearchInput) {
    searchContacts(input: $input) {
      paging {
        currentToken
        limit
        totalCount
        nextToken
      }
      data {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const searchContactGroupsQuery = gql`
  query searchContactGroups($input: ContactGroupSearchInput) {
    searchContactGroups(input: $input) {
      paging {
        currentToken
        limit
        totalCount
        nextToken
      }
      data {
        id
        name
      }
    }
  }
`;

export const searchContactTypesQuery = gql`
  query searchContactTypes($input: ContactSearchInput) {
    searchContactTypes(input: $input) {
      paging {
        currentToken
        limit
        totalCount
        nextToken
      }
      data {
        id
        name
      }
    }
  }
`;

export const getAllowedContactGroupsQuery = gql`
  query getAllowedContactGroups($input: GetAllowedContactGroupsInput!) {
    getAllowedContactGroups(input: $input) {
      contactGroups
    }
  }
`;

export const saveContactGroupsMutation = gql`
  mutation saveContactGroups($input: ContactGroupsInput!) {
    saveContactGroups(input: $input) {
      contactGroups
    }
  }
`;

export const saveContactTypesMutation = gql`
  mutation saveContactTypes($saveInput: ContactTypesInput!, $deleteInput: ContactTypesInput!) {
    deleteContactTypes(input: $deleteInput) {
      deleteContactTypes
    }
    saveContactTypes(input: $saveInput) {
      contactTypes
    }
  }
`;

export const getAllowedContactTypesQuery = gql`
  query getAllowedContactTypes($input: GetAllowedContactTypesInput!) {
    getAllowedContactTypes(input: $input) {
      contactTypes
    }
  }
`;

export const saveBlockedContactsMutation = gql`
  mutation saveBlockedContacts($saveInput: BlockedContactsInput!, $deleteInput: BlockedContactsInput!) {
    deleteBlockedContacts(input: $deleteInput) {
      success
    }
    saveBlockedContacts(input: $saveInput) {
      blockedContacts
    }
  }
`;

export const getBlockedContactsQuery = gql`
  query getBlockedContacts($input: GetBlockedContactsInput!) {
    getBlockedContacts(input: $input) {
      blockedContacts
    }
  }
`;

export const saveBlockedContactGroupsMutation = gql`
  mutation saveBlockedContactGroups($saveInput: BlockedContactGroupsInput!, $deleteInput: BlockedContactGroupsInput!) {
    deleteBlockedContactGroups(input: $deleteInput) {
      success
    }
    saveBlockedContactGroups(input: $saveInput) {
      contactGroups
    }
  }
`;

export const getBlockedContactGroupsQuery = gql`
  query getBlockedContactGroups($input: GetBlockedContactGroupsInput!) {
    getBlockedContactGroups(input: $input) {
      contactGroups
    }
  }
`;
