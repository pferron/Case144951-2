import { gql } from '@apollo/client';

export const SEARCH_MEMBER_LIST = gql`
  query searchMemberList($input: SearchMemberInput) {
    searchMemberList(input: $input) {
      paging {
        limit
        totalCount
        currentToken
        nextToken
      }
      data {
        id
        firstName
        lastName
        emailAddress
        jobTitle
        companyName
        mobileNumber
        registrationDate
        lastLoginDate
        registrationAge {
          years
          months
          days
        }
      }
    }
  }
`;

export const updateMemberStatus = gql`
  mutation updateMemberStatus($input: UpdateMemberStatusInput!) {
    updateMemberStatus(input: $input) {
      success
    }
  }
`;
