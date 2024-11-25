import {
  concatEnvToRedirectUrl,
  getEventFilter,
  getFullName,
  getRequestOptionsWithCacheOptions,
  handleDateUpdateForDateFilter,
  createFilterQuery,
  splitIntoChunks
} from '@utils/util';

import moment, { Moment } from 'moment';
import { DEFAULT_CACHE_TTL } from '@utils/constants';

const dateResponse = { updatedEndDate: '1900-11-16T05:30:30.500Z', updatedStartDate: '1900-11-15T05:30:30.500Z' };

describe('Test concatRedirectUrl', () => {
  it('concat redirect url with null env', () => {
    expect(concatEnvToRedirectUrl('baseUrl', null)).toBe('baseUrl');
  });

  it('concat redirect url with empty string', () => {
    expect(concatEnvToRedirectUrl('baseUrl', '')).toBe('baseUrl');
  });

  it('concat redirect url with valid env', () => {
    expect(concatEnvToRedirectUrl('baseUrl', 'T2')).toBe('baseUrl?env=T2');
  });

  it('concat redirect url with empty redirect url', () => {
    expect(concatEnvToRedirectUrl('', 'T2')).toBe('?env=T2');
  });
});

describe('Test request options', () => {
  it('with null request options and cache false', () => {
    expect(getRequestOptionsWithCacheOptions(false, null)).toStrictEqual({ headers: { 'x-skip-cache': '1' } });
  });
  it('with null request options and cache true', () => {
    expect(getRequestOptionsWithCacheOptions(true, null)).toStrictEqual({ cacheOptions: { ttl: DEFAULT_CACHE_TTL } });
  });
  it('with undefined request options and cache true', () => {
    expect(getRequestOptionsWithCacheOptions(true, undefined)).toStrictEqual({
      cacheOptions: { ttl: DEFAULT_CACHE_TTL }
    });
  });
  it('with no request options and cache true', () => {
    expect(getRequestOptionsWithCacheOptions(true)).toStrictEqual({ cacheOptions: { ttl: DEFAULT_CACHE_TTL } });
  });
  it('with request options and cache false', () => {
    expect(
      getRequestOptionsWithCacheOptions(false, {
        headers: { 'x-skip-cache': '0' },
        cacheOptions: { ttl: DEFAULT_CACHE_TTL }
      })
    ).toStrictEqual({
      headers: { 'x-skip-cache': '1' },
      cacheOptions: { ttl: DEFAULT_CACHE_TTL }
    });
  });
});
describe('Event Ids filter', () => {
  it('with multiple eventIds', () => {
    expect(getEventFilter(['Id1', 'Id2', 'id3'])).toEqual('id eq "Id1" or id eq "Id2" or id eq "id3"');
  });
  it('with empty eventIds', () => {
    expect(getEventFilter([])).toEqual('');
  });
});

describe('date filter', () => {
  it('handle date update for date filter', () => {
    const sDate = new Date();
    const eDate = new Date();
    sDate.setUTCFullYear(1900, 10, 15);
    sDate.setUTCHours(5, 30, 30, 500);
    eDate.setUTCFullYear(1900, 10, 16);
    eDate.setUTCHours(5, 30, 30, 500);
    const startDate: Moment = moment(sDate);
    const endDate: Moment = moment(eDate);
    const { updatedStartDate, updatedEndDate } = handleDateUpdateForDateFilter(startDate, endDate, true);
    expect(updatedStartDate.toJSON().toString()).toEqual(dateResponse.updatedStartDate);
    expect(updatedEndDate.toJSON().toString()).toEqual(dateResponse.updatedEndDate);
  });

  it('handle date when startTime is before currentTime', () => {
    const sDate = new Date();
    const eDate = new Date();
    sDate.setUTCFullYear(2150, 10, 15);
    sDate.setUTCHours(5, 30, 30, 500);
    eDate.setUTCFullYear(1900, 10, 16);
    eDate.setUTCHours(5, 30, 30, 500);
    const startDate: Moment = moment(sDate);
    const endDate: Moment = moment(eDate);
    const { updatedStartDate } = handleDateUpdateForDateFilter(startDate, endDate, true);
    expect(updatedStartDate.isBefore(startDate)).toBeTruthy();
  });

  it('handle date when endTime is before currentTime', () => {
    const sDate = new Date();
    const eDate = new Date();
    sDate.setUTCFullYear(1900, 10, 15);
    sDate.setUTCHours(5, 30, 30, 500);
    eDate.setUTCFullYear(2150, 10, 16);
    eDate.setUTCHours(5, 30, 30, 500);
    const startDate: Moment = moment(sDate);
    const endDate: Moment = moment(eDate);
    const { updatedEndDate } = handleDateUpdateForDateFilter(startDate, endDate, true);
    expect(updatedEndDate.isBefore(endDate)).toBeTruthy();
  });
});

describe('get full Name test', () => {
  it('get full name with first name and last name both', () => {
    expect(getFullName('Amanda', 'Boyd')).toEqual('Amanda Boyd');
  });
  it('get full name with first name only', () => {
    expect(getFullName('Amanda', undefined)).toEqual('Amanda');
  });
  it('get full name with last name only', () => {
    expect(getFullName(undefined, 'Boyd')).toEqual('Boyd');
  });
  it('get full name with both names undefined', () => {
    expect(getFullName(undefined, undefined)).toEqual('');
  });
});

describe('Test split into chunks', () => {
  it('splitIntoChunks should split into 2 parts', () => {
    const input = [1, 2, 3, 4, 5, 6];
    expect(splitIntoChunks(input, 4)).toEqual([
      [1, 2, 3, 4],
      [5, 6]
    ]);
    expect(input.length).toBe(6);
  });

  it('splitIntoChunks should not split incorrectly', () => {
    const input = [1, 2, 3, 4, 5, 6];
    expect(splitIntoChunks(input, 4)).not.toEqual([
      [1, 2, 3],
      [4, 5, 6]
    ]);
    expect(input.length).toBe(6);
  });

  it('splitIntoChunks should split into 3 parts', () => {
    const input = [1, 2, 3, 4, 5, 6];
    expect(splitIntoChunks(input, 2)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6]
    ]);
    expect(input.length).toBe(6);
  });

  it('splitIntoChunks should work well for empty input', () => {
    const input = [];
    expect(splitIntoChunks(input, 2)).toEqual([]);
  });
});

describe('Test createFilterQuery', () => {
  it('createFilterQuery test with single ids', () => {
    expect(createFilterQuery('id', ['testId'])).toBe("id eq 'testId'");
  });
  it('createFilterQuery test with multiple ids', () => {
    expect(createFilterQuery('id', ['testId1', 'testId2'])).toBe("id eq 'testId1' or id eq 'testId2'");
  });
  it('createFilterQuery test with no ids', () => {
    expect(createFilterQuery('id', [])).toBe('');
  });
});
