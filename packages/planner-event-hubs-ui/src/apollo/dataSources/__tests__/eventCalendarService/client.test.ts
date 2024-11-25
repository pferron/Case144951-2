import { EventCalendarClient } from '@dataSources/eventCalendarService/client';
import { getCalendarList } from '@resolvers/common/dataAccess/upcomingEvents';

const eventCalendarServiceClient = new EventCalendarClient();
const config = {
  context: {
    headers: {},
    auth: {
      authorization: {
        metadata: {
          accountMappingId: 'account-mapping-id',
          accountId: 'account-id',
          environment: 'T2'
        }
      }
    }
  },
  cache: undefined
};
eventCalendarServiceClient.initialize(config);
const existingCalendar = {
  calendars: [
    {
      calStub: 'calendar-id',
      calName: 'Calendar Name'
    }
  ]
};

describe('Test Event Calendar Service client', () => {
  it('sends GET /account/{accountId}', async () => {
    eventCalendarServiceClient.get = jest.fn().mockImplementation(async () => existingCalendar);
    const calendars = await getCalendarList(eventCalendarServiceClient);
    expect(eventCalendarServiceClient.get).toHaveBeenCalledWith(
      'account/account-id',
      {},
      { headers: { authorization: `API_KEY ${process.env.API_KEY}`, 'x-skip-cache': '1' } }
    );
    expect(calendars).toBeTruthy();
    expect(calendars.data[0]).toEqual({
      id: 'calendar-id',
      name: 'Calendar Name'
    });
  });
});
