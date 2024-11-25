import gql from 'graphql-tag';
import { VIDEO_CENTER_ANONYMOUS_ROLE } from '../utils/constants';

export default gql`
  type Query {
    memberLogin(memberLoginInput: MemberLoginInput): MemberLoginResponse
      @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  input MemberLoginInput {
    hubId: ID!
    memberInfo: MemberInfo!
  }

  input MemberInfo {
    firstName: String!
    lastName: String!
    email: String!
  }

  type MemberLoginResponse {
    id: ID
    maxEmailSent: Boolean
    firstName: String
    lastName: String
    email: String
    emailLocked: Boolean
    expirationDate: String
    userRestricted: Boolean
    serverError: String
  }
`;
