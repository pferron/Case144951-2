import { CvestDataSource } from '@dataSources/CvestDataSource';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CalendarsResponse } from '@cvent/planner-event-hubs-model/types';
import { getAccountId } from '@resolvers/common/utils/authMetadataUtils';

const LOG = LoggerFactory.create('event-calendar-client');

export class EventCalendarClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.EVENT_CALENDAR_SERVICE_URL}/calendar_events/v1`;
  }

  getCalendarList = async (): Promise<CalendarsResponse> => {
    const accountId = getAccountId(this.context.auth);
    LOG.info('getCalendarList(accountId)', accountId);
    const response = await this.get(
      `account/${accountId}`,
      {},
      {
        headers: { authorization: `API_KEY ${process.env.API_KEY}`, 'x-skip-cache': '1' }
      }
    );
    const calendars: CalendarsResponse = { data: [] };
    for (const calendar of response.calendars) {
      calendars.data.push({
        name: calendar.calName,
        id: calendar.calStub
      });
    }
    return calendars;
  };
}
