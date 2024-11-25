import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import { getMockResolverRequestWithDataSources, mockDataSource } from '@resolvers/common/testUtils/mockRequestData';
import { EventCalendarClient } from '@dataSources/eventCalendarService/client';
import upcomingeventsResolver from '../upcomingevents/index';

const dataSources = {
  eventCalendarClient: new EventCalendarClient()
};
const existingCalendar = {
  calendars: [
    {
      calStub: 'calendar-id',
      calName: 'Calendar Name',
      acctId: 8888
    }
  ]
};

const finalCalendar = {
  data: [
    {
      id: 'calendar-id',
      name: 'Calendar Name'
    }
  ]
};

describe('Test calendar resolver', () => {
  it('Should fetch calendars', async () => {
    mockDataSource(dataSources.eventCalendarClient, 'get', existingCalendar);
    const resolverRequest = getMockResolverRequestWithDataSources('Query.getCalendarList', dataSources);
    dataSources.eventCalendarClient.context = resolverRequest.context;
    const graphResponse = await resolveQueryResponse(upcomingeventsResolver, 'calendars', resolverRequest);
    expect(graphResponse).toBeTruthy();
    expect(graphResponse).toEqual(finalCalendar);
  });
});
