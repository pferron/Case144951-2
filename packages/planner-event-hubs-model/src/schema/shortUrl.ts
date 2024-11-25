import gql from 'graphql-tag';

export default gql`
  type Query {
    fetchAndCreateShortUrlByTag(videoCenterId: String!): [ShortUrlByTag] @auth(methods: [BEARER])
  }

  type VideoPageShortUrl {
    videoPageShortUrl: String
  }

  type ShortUrlByTag {
    pageName: ShortUrlPage
    shortUrl: String
  }

  enum ShortUrlPage {
    home
    upcomingevents
    channels
    videos
    registration
  }
`;
