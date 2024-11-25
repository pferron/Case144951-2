import { formatLocation } from '@utils/formatLocationUtil';
import calendarEventsData from './fixtures/calendarEvents.json';

describe('formatLocation', () => {
  it('returns correct location result string', () => {
    const { location } = calendarEventsData[0];
    const type = calendarEventsData[0].format;
    const venue = calendarEventsData[0].venues[0].name;

    expect(formatLocation([location, venue, type])).toStrictEqual('South Congress Hall | Test Venue 1 | Hybrid');
  });

  it('returns correct location result string in case venue is undefined', () => {
    const { location } = calendarEventsData[1];
    const type = calendarEventsData[1].format;
    const venue = null;

    expect(formatLocation([location, venue, type])).toStrictEqual('Test Location | Hybrid');
  });

  it('returns correct location result string in case all three (venue, location and event type) are undefined', () => {
    expect(formatLocation([null, null, null])).toStrictEqual('');
  });
});
