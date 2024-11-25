import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { calendars } from '@cvent/planner-event-hubs-model/operations/upcomingEvents';
import { CalendarsResponse } from '@cvent/planner-event-hubs-model/types';

export const getCalendarList = async (client: ApolloClient<NormalizedCacheObject>): Promise<CalendarsResponse> => {
  const response = await client.query({
    query: calendars,
    variables: {}
  });

  return response.data.calendars;
};
