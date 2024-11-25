import gql from 'graphql-tag';

export default gql`
  type Query {
    calendars: CalendarsResponse @auth(methods: [BEARER], roles: ["video-center:read"])
  }

  type EventCalendar {
    id: String!
    name: String!
  }

  type CalendarsResponse {
    data: [EventCalendar]!
  }
`;
