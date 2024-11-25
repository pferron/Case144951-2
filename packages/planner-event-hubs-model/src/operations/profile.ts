import { gql } from '@apollo/client';
export const getMemberDataFull = gql`
  query getMemberDataFull($input: MemberDataInput!) {
    getMemberData(input: $input) {
      profile {
        firstName
        lastName
        emailAddress
        prefix
        designation
        jobTitle
        companyName
        mobileNumber
        compliance {
          creationTime
          complianceScope
          action
          createdBy
        }
        profileImageUrl {
          href
        }
        socialMediaLinks {
          facebookUrl {
            href
          }
          twitterUrl {
            href
          }
          linkedinUrl {
            href
          }
        }
      }
      visibility
      termsAccepted
    }
  }
`;

export const GET_MEMBER_PROFILE_DATA = gql`
  query getMemberProfileData($input: MemberDataInput!) {
    getMemberData(input: $input) {
      profile {
        firstName
        lastName
        emailAddress
        jobTitle
        companyName
        mobileNumber
      }
    }
  }
`;
