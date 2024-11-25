import gql from 'graphql-tag';

export default gql`
  type Query {
    helpMenu: HelpMenu @auth(methods: [BEARER], roles: [])
  }

  type HelpMenu {
    title: String
    items: [Utility]
  }
`;
