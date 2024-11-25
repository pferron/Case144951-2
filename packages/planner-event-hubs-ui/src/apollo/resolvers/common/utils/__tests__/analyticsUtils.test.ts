import {
  totalViewsEmptyData,
  totalViewsData,
  totalViewsDataPerWeek,
  totalViewsDataPerMonth,
  averageViewDurationPerDayData,
  viewsByDeviceTypePerDay
} from '@resolvers/fixtures/analyticsData';
import {
  getEpoch,
  getWeekTime,
  getMonthTime,
  mapToDays,
  mapToMonths,
  mapToWeeks,
  getDayTime,
  sortVideosByViewsDescending,
  computeViewsBySource
} from '@resolvers/common/utils/analyticsUtils';
import { totalVideoViewDataResponseWeek1 } from '@dataSources/__TestUtils__/fixtures/analyticsData';

describe('tests analytics utils', () => {
  it('get epoch providing milliseconds', () => {
    expect(getEpoch(1690761600000)).toEqual(1690761600);
  });

  it('get first day of the week time in UTC providing milliseconds', () => {
    expect(getWeekTime(1690761600000)).toEqual(1690675200000);
  });

  it('get first day of the week time in UTC providing date string', () => {
    expect(getWeekTime('2023-07-31T00:00:00Z')).toEqual(1690675200000);
  });

  it('get last day of the week time in UTC providing milliseconds', () => {
    expect(getWeekTime(1690761600000, 6)).toEqual(1691193600000);
  });

  it('get last day of the week time in UTC providing date string', () => {
    expect(getWeekTime('2023-07-31T00:00:00Z', 6)).toEqual(1691193600000);
  });

  it('get first day of the month time in UTC providing milliseconds', () => {
    expect(getMonthTime(1690761600000)).toEqual(1688169600000);
  });

  it('get first day of the month time in UTC providing date string', () => {
    expect(getMonthTime('2023-07-31T00:00:00Z')).toEqual(1688169600000);
  });

  it('get start of day time in UTC providing milliseconds', () => {
    expect(getDayTime(1690761700000)).toEqual(1690761600000);
  });

  it('get start of day time in UTC providing date string', () => {
    expect(getDayTime('2023-07-31T12:00:00Z')).toEqual(1690761600000);
  });

  it('maps to days with empty analytics data', () => {
    // From Jul 25th to Jul 31st
    const response = mapToDays(totalViewsEmptyData, 1690295881000, 1690814281000, 4);
    expect(response.total).toBe(0);
    expect(response.perDay).toHaveLength(7);
    expect(response.perDay[0].date).toMatchInlineSnapshot('2023-07-25T00:00:00.000Z');
    expect(response.perDay[0].value).toBe(0);
    expect(response.perDay[1].date).toMatchInlineSnapshot('2023-07-26T00:00:00.000Z');
    expect(response.perDay[1].value).toBe(0);
    expect(response.perDay[2].date).toMatchInlineSnapshot('2023-07-27T00:00:00.000Z');
    expect(response.perDay[2].value).toBe(0);
    expect(response.perDay[3].date).toMatchInlineSnapshot('2023-07-28T00:00:00.000Z');
    expect(response.perDay[3].value).toBe(0);
    expect(response.perDay[4].date).toMatchInlineSnapshot('2023-07-29T00:00:00.000Z');
    expect(response.perDay[4].value).toBe(0);
    expect(response.perDay[5].date).toMatchInlineSnapshot('2023-07-30T00:00:00.000Z');
    expect(response.perDay[5].value).toBe(0);
    expect(response.perDay[6].date).toMatchInlineSnapshot('2023-07-31T00:00:00.000Z');
    expect(response.perDay[6].value).toBe(0);
    expect(response.perWeek).toBeUndefined();
    expect(response.perMonth).toBeUndefined();
  });

  it('maps to days', () => {
    // From Jul 18th to Jul 24th
    const response = mapToDays(totalViewsData, 1689638400000, 1690156800000, 4);
    expect(response.total).toBe(18);
    expect(response.perDay).toHaveLength(7);
    expect(response.perDay[0].date).toMatchInlineSnapshot('2023-07-18T00:00:00.000Z');
    expect(response.perDay[0].value).toBe(10);
    expect(response.perDay[1].date).toMatchInlineSnapshot('2023-07-19T00:00:00.000Z');
    expect(response.perDay[1].value).toBe(5);
    expect(response.perDay[2].date).toMatchInlineSnapshot('2023-07-20T00:00:00.000Z');
    expect(response.perDay[2].value).toBe(0);
    expect(response.perDay[3].date).toMatchInlineSnapshot('2023-07-21T00:00:00.000Z');
    expect(response.perDay[3].value).toBe(0);
    expect(response.perDay[4].date).toMatchInlineSnapshot('2023-07-22T00:00:00.000Z');
    expect(response.perDay[4].value).toBe(3);
    expect(response.perDay[5].date).toMatchInlineSnapshot('2023-07-23T00:00:00.000Z');
    expect(response.perDay[5].value).toBe(0);
    expect(response.perDay[6].date).toMatchInlineSnapshot('2023-07-24T00:00:00.000Z');
    expect(response.perDay[6].value).toBe(0);
    expect(response.perWeek).toBeUndefined();
    expect(response.perMonth).toBeUndefined();
  });

  it('maps to days for averageViewDurationPerDay', () => {
    const response = mapToDays(averageViewDurationPerDayData, 1691562600000, 1691735400000, 2);
    expect(response.total).toBe(961.1818181818181);
    expect(response.perDay).toHaveLength(3);
    expect(response.perDay[0].date).toMatchInlineSnapshot('2023-08-09T00:00:00.000Z');
    expect(response.perDay[0].value).toBe(0);
    expect(response.perDay[1].date).toMatchInlineSnapshot('2023-08-10T00:00:00.000Z');
    expect(response.perDay[1].value).toBe(961.1818181818181);
    expect(response.perDay[2].date).toMatchInlineSnapshot('2023-08-11T00:00:00.000Z');
    expect(response.perDay[2].value).toBe(0);
    expect(response.perWeek).toBeUndefined();
    expect(response.perMonth).toBeUndefined();
  });

  it('maps to weeks with empty analytics data', () => {
    // From Jun 21st to Jul 31st
    const response = mapToWeeks(totalViewsEmptyData, 1687358281000, 1690814281000, 4);
    expect(response.total).toBe(0);
    expect(response.perDay).toBeUndefined();
    expect(response.perWeek).toHaveLength(7);
    expect(response.perWeek[0].date).toMatchInlineSnapshot('2023-06-18T00:00:00.000Z');
    expect(response.perWeek[0].value).toBe(0);
    expect(response.perWeek[1].date).toMatchInlineSnapshot('2023-06-25T00:00:00.000Z');
    expect(response.perWeek[1].value).toBe(0);
    expect(response.perWeek[2].date).toMatchInlineSnapshot('2023-07-02T00:00:00.000Z');
    expect(response.perWeek[2].value).toBe(0);
    expect(response.perWeek[3].date).toMatchInlineSnapshot('2023-07-09T00:00:00.000Z');
    expect(response.perWeek[3].value).toBe(0);
    expect(response.perWeek[4].date).toMatchInlineSnapshot('2023-07-16T00:00:00.000Z');
    expect(response.perWeek[4].value).toBe(0);
    expect(response.perWeek[5].date).toMatchInlineSnapshot('2023-07-23T00:00:00.000Z');
    expect(response.perWeek[5].value).toBe(0);
    expect(response.perWeek[6].date).toMatchInlineSnapshot('2023-07-30T00:00:00.000Z');
    expect(response.perWeek[6].value).toBe(0);
    expect(response.perMonth).toBeUndefined();
  });

  it('maps to weeks', () => {
    // From Jun 19st to Jul 31st
    const response = mapToWeeks(totalViewsDataPerWeek, 1687358281000, 1690814281000, 4);
    expect(response.total).toBe(24);
    expect(response.perDay).toBeUndefined();
    expect(response.perWeek).toHaveLength(7);
    expect(response.perWeek[0].date).toMatchInlineSnapshot('2023-06-18T00:00:00.000Z');
    expect(response.perWeek[0].value).toBe(16);
    expect(response.perWeek[1].date).toMatchInlineSnapshot('2023-06-25T00:00:00.000Z');
    expect(response.perWeek[1].value).toBe(0);
    expect(response.perWeek[2].date).toMatchInlineSnapshot('2023-07-02T00:00:00.000Z');
    expect(response.perWeek[2].value).toBe(0);
    expect(response.perWeek[3].date).toMatchInlineSnapshot('2023-07-09T00:00:00.000Z');
    expect(response.perWeek[3].value).toBe(0);
    expect(response.perWeek[4].date).toMatchInlineSnapshot('2023-07-16T00:00:00.000Z');
    expect(response.perWeek[4].value).toBe(0);
    expect(response.perWeek[5].date).toMatchInlineSnapshot('2023-07-23T00:00:00.000Z');
    expect(response.perWeek[5].value).toBe(8);
    expect(response.perWeek[6].date).toMatchInlineSnapshot('2023-07-30T00:00:00.000Z');
    expect(response.perWeek[6].value).toBe(0);
    expect(response.perMonth).toBeUndefined();
  });

  it('maps to months with empty analytics data', () => {
    // From May 21st to Jul 31st
    const response = mapToMonths(totalViewsEmptyData, 1684679881000, 1690814281000, 4);
    expect(response.total).toBe(0);
    expect(response.perDay).toBeUndefined();
    expect(response.perWeek).toBeUndefined();
    expect(response.perMonth).toHaveLength(3);
    expect(response.perMonth[0].date).toMatchInlineSnapshot('2023-05-01T00:00:00.000Z');
    expect(response.perMonth[0].value).toBe(0);
    expect(response.perMonth[1].date).toMatchInlineSnapshot('2023-06-01T00:00:00.000Z');
    expect(response.perMonth[1].value).toBe(0);
    expect(response.perMonth[2].date).toMatchInlineSnapshot('2023-07-01T00:00:00.000Z');
    expect(response.perMonth[2].value).toBe(0);
  });

  it('maps to months', () => {
    // From May 21st to Jul 31st
    const response = mapToMonths(totalViewsDataPerMonth, 1684679881000, 1690814281000, 4);
    expect(response.total).toBe(34);
    expect(response.perDay).toBeUndefined();
    expect(response.perWeek).toBeUndefined();
    expect(response.perMonth).toHaveLength(3);
    expect(response.perMonth[0].date).toMatchInlineSnapshot('2023-05-01T00:00:00.000Z');
    expect(response.perMonth[0].value).toBe(18);
    expect(response.perMonth[1].date).toMatchInlineSnapshot('2023-06-01T00:00:00.000Z');
    expect(response.perMonth[1].value).toBe(8);
    expect(response.perMonth[2].date).toMatchInlineSnapshot('2023-07-01T00:00:00.000Z');
    expect(response.perMonth[2].value).toBe(8);
  });

  it('test computeViewsBySource', () => {
    const response = computeViewsBySource(viewsByDeviceTypePerDay);
    expect(response.desktopViews).toBe(23);
    expect(response.mobileViews).toBe(111);
    expect(response.tabletViews).toBe(99);
    expect(response.totalViews).toBe(233);
  });

  it('sortVideosByViewsDescending:', () => {
    const response = sortVideosByViewsDescending(totalVideoViewDataResponseWeek1);
    expect(response[0].videoId).toBe('12345678-1234-1234-1234-12345678901A');
    expect(response[0].position).toBe(1);
    expect(response[0].totalViews).toBe(200);

    expect(response[1].videoId).toBe('12345678-1234-1234-1234-12345678901B');
    expect(response[1].position).toBe(2);
    expect(response[1].totalViews).toBe(80);

    expect(response[2].videoId).toBe('12345678-1234-1234-1234-12345678901C');
    expect(response[2].position).toBe(3);
    expect(response[2].totalViews).toBe(60);
  });
});
