import { gql } from '@apollo/client';

export const fetchAndCreateShortUrlByTag = gql`
  query fetchAndCreateShortUrlByTag($videoCenterId: String!) {
    fetchAndCreateShortUrlByTag(videoCenterId: $videoCenterId) {
      shortUrl
      pageName
    }
  }
`;
