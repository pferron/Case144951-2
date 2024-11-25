import { CalendarsResponse, Resolvers } from '@cvent/planner-event-hubs-model/types';
import { getCalendarList } from '@resolvers/common/dataAccess/upcomingEvents';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('upcoming-events-resolver');

const resolver: Resolvers = {
  Query: {
    calendars: async (_parent, args, { dataSources }): Promise<CalendarsResponse> => {
      LOG.info('calendar accounts');
      return getCalendarList(dataSources.eventCalendarClient);
    }
  }
};

export default resolver;
