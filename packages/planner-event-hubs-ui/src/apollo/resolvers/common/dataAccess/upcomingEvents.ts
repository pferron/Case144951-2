import { EventCalendarClient } from '@dataSources/eventCalendarService/client';
import { CalendarsResponse } from '@cvent/planner-event-hubs-model/types';

export const getCalendarList = async (eventCalendarClient: EventCalendarClient): Promise<CalendarsResponse> => {
  return eventCalendarClient.getCalendarList();
};
