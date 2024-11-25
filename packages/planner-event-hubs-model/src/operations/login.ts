import { gql } from '@apollo/client';

export const memberLogin = gql`
  query memberLogin($memberLoginInput: MemberLoginInput) {
    memberLogin(memberLoginInput: $memberLoginInput) {
      id
      expirationDate
      maxEmailSent
      firstName
      lastName
      email
      emailLocked
      userRestricted
      serverError
    }
  }
`;
