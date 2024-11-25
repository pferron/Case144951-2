import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { connectToApiAsPlanner, authOptions } from '@helpers/connectToApiAsPlanner';
import { getCalendarList } from '@helpers/upcomingEventsFunctions';

let client: ApolloClient<NormalizedCacheObject>;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
}, 10000);

describe('Event Calendars', () => {
  it('fetch calendars from an account', async () => {
    const calendars = await getCalendarList(client);
    expect(calendars).toBeTruthy();
    expect(calendars.data.length).toBeGreaterThanOrEqual(1);
    for (const calendar of calendars.data) {
      expect(calendar.id).toBeTruthy();
      expect(calendar.name).toBeTruthy();
    }
  });
});
