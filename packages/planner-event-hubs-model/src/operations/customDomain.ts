import { gql } from '@apollo/client';

export const getCustomDomainForHubQuery = gql`
  query getCustomDomainForHub($hubId: ID!) {
    getCustomDomainForHub(hubId: $hubId) {
      entityId
      customDomainId
      trailingName
    }
  }
`;

export const getCustomDomainForAccountQuery = gql`
  query getCustomDomainForAccount {
    getCustomDomainForAccount {
      customDomainId
      domainName
    }
  }
`;

export const createHubCustomDomainMapping = gql`
  mutation createHubCustomDomainMapping($input: CustomDomainMappingInput!) {
    createHubCustomDomainMapping(input: $input) {
      entityId
      customDomainId
      trailingName
    }
  }
`;

export const updateHubCustomDomainMapping = gql`
  mutation updateHubCustomDomainMapping($input: CustomDomainMappingInput!) {
    updateHubCustomDomainMapping(input: $input) {
      entityId
      customDomainId
      trailingName
    }
  }
`;

export const deleteHubCustomDomainMapping = gql`
  mutation deleteHubCustomDomainMapping($hubId: ID!) {
    deleteHubCustomDomainMapping(hubId: $hubId)
  }
`;
