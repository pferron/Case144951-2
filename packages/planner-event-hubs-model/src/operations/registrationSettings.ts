import { gql } from '@apollo/client';

export const saveEmailDomainsMutation = gql`
  mutation saveEmailDomains($input: EmailDomainsInput!) {
    saveEmailDomains(input: $input) {
      emailDomains
    }
  }
`;

export const getEmailDomainsQuery = gql`
  query getEmailDomains($input: GetEmailDomainsInput!) {
    getEmailDomains(input: $input) {
      emailDomains
    }
  }
`;
