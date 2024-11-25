import gql from 'graphql-tag';

export default gql`
  type Query {
    userUtilities: UserUtilities @auth(methods: [BEARER], roles: [])
  }

  type Utility {
    icon: String
    title: String
    url: Url
    openInNewTab: Boolean
    hasCustomOnClickHandler: Boolean
  }

  type UserUtilities {
    title: String
    items: [Utility]!
  }
`;
