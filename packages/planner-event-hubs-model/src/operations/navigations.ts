import { gql } from '@apollo/client';

export const GET_ADVANCED_APP_NAVIGATION = gql`
  query getAdvancedAppNavigation {
    products {
      id
      title
      defaultOpen
      items {
        id
        status
        icon
        title
        url {
          href
        }
      }
    }
    helpMenu {
      title
      items {
        icon
        openInNewTab
        hasCustomOnClickHandler
        title
        url {
          href
        }
      }
    }
    userUtilities {
      title
      items {
        icon
        title
        url {
          href
        }
        openInNewTab
        hasCustomOnClickHandler
      }
    }
    user {
      firstName
      lastName
      email
      company
      url {
        href
      }
      viewProfileText
    }
    recentItems {
      title
      items {
        id
        icon
        title
        url
        type
      }
    }
  }
`;

export const updateRecentItemsMutation = gql`
  mutation updateRecentItems($input: UpdateRecentItemsRequest!) {
    updateRecentItems(input: $input) {
      ... on RecentItem {
        id
        icon
        title
        url
        type
      }
    }
  }
`;
