import { gql } from '@apollo/client';

export const GET_CALENDAR_LIST = gql`
  query getCalendarList {
    calendars {
      data {
        id
        name
      }
    }
  }
`;
export const calendars = gql`
  query calendars {
    calendars {
      data {
        id
        name
      }
    }
  }
`;
