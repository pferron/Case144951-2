import { gql } from '@apollo/client';

export const getVideosQuery = gql`
  query getVideos($filterInput: VideoFilterInput) {
    getVideos(filterInput: $filterInput) {
      paging {
        nextToken
        currentToken
        totalCount
      }
      data {
        id
        title
        description
        catalogs {
          id
          channel {
            id
            status
          }
          section {
            id
          }
          videoCenters
        }
        sessions
        exhibitors
        speakers
        sourceProvider
        events
        duration
        thumbnail {
          url {
            href
          }
        }
        generatedThumbnail {
          url {
            href
          }
        }
        status
        tags
        source {
          id
          status
        }
        created
        createdBy
        lastModified
        lastModifiedBy
      }
    }
  }
`;
