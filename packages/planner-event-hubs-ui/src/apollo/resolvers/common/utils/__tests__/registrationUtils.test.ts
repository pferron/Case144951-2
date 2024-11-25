import {
  totalRegistrationEmptyData,
  totalRegistrationData,
  totalRegistrationDataPerWeek,
  totalRegistrationDataPerMonth
} from '@resolvers/fixtures/registrationCountData';
import {
  getWeekTime,
  getMonthTime,
  mapToDays,
  mapToMonths,
  mapToWeeks
} from '@resolvers/common/utils/registrationUtils';

describe('tests registration utils', () => {
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

  it('maps to days with empty registration data', () => {
    // From Jul 25th to Jul 31st
    const response = mapToDays(totalRegistrationEmptyData, 1690295881000, 1690814281000);
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
    const response = mapToDays(totalRegistrationData, 1689638400000, 1690156800000);
    expect(response.total).toBe(4);
    expect(response.perDay).toHaveLength(7);
    expect(response.perDay[0].date).toMatchInlineSnapshot('2023-07-18T00:00:00.000Z');
    expect(response.perDay[0].value).toBe(0);
    expect(response.perDay[1].date).toMatchInlineSnapshot('2023-07-19T00:00:00.000Z');
    expect(response.perDay[1].value).toBe(2);
    expect(response.perDay[2].date).toMatchInlineSnapshot('2023-07-20T00:00:00.000Z');
    expect(response.perDay[2].value).toBe(0);
    expect(response.perDay[3].date).toMatchInlineSnapshot('2023-07-21T00:00:00.000Z');
    expect(response.perDay[3].value).toBe(0);
    expect(response.perDay[4].date).toMatchInlineSnapshot('2023-07-22T00:00:00.000Z');
    expect(response.perDay[4].value).toBe(1);
    expect(response.perDay[5].date).toMatchInlineSnapshot('2023-07-23T00:00:00.000Z');
    expect(response.perDay[5].value).toBe(1);
    expect(response.perDay[6].date).toMatchInlineSnapshot('2023-07-24T00:00:00.000Z');
    expect(response.perDay[6].value).toBe(0);
    expect(response.perWeek).toBeUndefined();
    expect(response.perMonth).toBeUndefined();
  });

  it('maps to weeks with empty registration data', () => {
    // From Jun 21st to Jul 31st
    const response = mapToWeeks(totalRegistrationEmptyData, 1687358281000, 1690814281000);
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
    const response = mapToWeeks(totalRegistrationDataPerWeek, 1687358281000, 1690814281000);
    expect(response.total).toBe(44);
    expect(response.perDay).toBeUndefined();
    expect(response.perWeek).toHaveLength(7);
    expect(response.perWeek[0].date).toMatchInlineSnapshot('2023-06-18T00:00:00.000Z');
    expect(response.perWeek[0].value).toBe(20);
    expect(response.perWeek[1].date).toMatchInlineSnapshot('2023-06-25T00:00:00.000Z');
    expect(response.perWeek[1].value).toBe(0);
    expect(response.perWeek[2].date).toMatchInlineSnapshot('2023-07-02T00:00:00.000Z');
    expect(response.perWeek[2].value).toBe(0);
    expect(response.perWeek[3].date).toMatchInlineSnapshot('2023-07-09T00:00:00.000Z');
    expect(response.perWeek[3].value).toBe(0);
    expect(response.perWeek[4].date).toMatchInlineSnapshot('2023-07-16T00:00:00.000Z');
    expect(response.perWeek[4].value).toBe(14);
    expect(response.perWeek[5].date).toMatchInlineSnapshot('2023-07-23T00:00:00.000Z');
    expect(response.perWeek[5].value).toBe(10);
    expect(response.perWeek[6].date).toMatchInlineSnapshot('2023-07-30T00:00:00.000Z');
    expect(response.perWeek[6].value).toBe(0);
    expect(response.perMonth).toBeUndefined();
  });

  it('maps to months with empty registration data', () => {
    // From May 21st to Jul 31st
    const response = mapToMonths(totalRegistrationEmptyData, 1684679881000, 1690814281000);
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
    const response = mapToMonths(totalRegistrationDataPerMonth, 1684679881000, 1690814281000);
    expect(response.total).toBe(70);
    expect(response.perDay).toBeUndefined();
    expect(response.perWeek).toBeUndefined();
    expect(response.perMonth).toHaveLength(3);
    expect(response.perMonth[0].date).toMatchInlineSnapshot('2023-05-01T00:00:00.000Z');
    expect(response.perMonth[0].value).toBe(26);
    expect(response.perMonth[1].date).toMatchInlineSnapshot('2023-06-01T00:00:00.000Z');
    expect(response.perMonth[1].value).toBe(20);
    expect(response.perMonth[2].date).toMatchInlineSnapshot('2023-07-01T00:00:00.000Z');
    expect(response.perMonth[2].value).toBe(24);
  });
});
