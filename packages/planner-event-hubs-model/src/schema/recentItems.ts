import gql from 'graphql-tag';

export default gql`
  type Query {
    recentItems: RecentItems @auth(methods: [BEARER], roles: [])
  }

  extend type Mutation {
    updateRecentItems(input: UpdateRecentItemsRequest): [RecentItem]
      @auth(methods: [BEARER], validateCsrf: false, roles: [])
  }

  type RecentItems {
    title: String
    items: [RecentItem]
  }

  type RecentItem {
    id: String
    icon: String
    title: String
    url: String
    type: String
  }

  input UpdateRecentItemsRequest {
    id: String
    title: String
    url: String
    type: String
  }
`;
