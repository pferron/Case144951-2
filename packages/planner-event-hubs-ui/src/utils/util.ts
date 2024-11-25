import { RequestInit } from 'apollo-server-env/dist/fetch';
import { ASC, CHANNEL_ORDER, CHANNEL_TITLE, DEFAULT_CACHE_TTL } from '@utils/constants';
import moment, { Moment } from 'moment';

export const getFormattedDateAndTime = (videoDate: Date, dateTranslate): string => {
  return dateTranslate(videoDate, { dateStyle: 'medium' });
};

export const concatEnvToRedirectUrl = (redirectUrl: string, env: string): string => {
  return env ? `${redirectUrl}`.concat('?env=', env) : `${redirectUrl}`;
};

export const getRequestOptionsWithCacheOptions = (useCache = false, requestOptions: RequestInit = {}): RequestInit => {
  return !useCache
    ? { ...requestOptions, headers: { 'x-skip-cache': '1' } }
    : {
        ...requestOptions,
        cacheOptions: { ttl: DEFAULT_CACHE_TTL }
      };
};

export const handleDateUpdateForDateFilter = (
  startDate: Moment,
  endDate: Moment,
  showPastDate: boolean
): { updatedStartDate: Moment; updatedEndDate: Moment } => {
  let updatedStartDate = startDate;
  let updatedEndDate = endDate;
  const todayInstance = moment();
  if (showPastDate && updatedStartDate && todayInstance.isBefore(updatedStartDate, 'day')) {
    updatedStartDate = todayInstance;
  }
  if (showPastDate && updatedEndDate && todayInstance.isBefore(updatedEndDate, 'day')) {
    updatedEndDate = todayInstance;
  }
  return {
    updatedStartDate,
    updatedEndDate
  };
};

/**
 * Filter for event
 * @param ids
 * @returns {string}
 */
export const getEventFilter = (ids: string[]): string => {
  return ids.map(id => `id eq "${id}"`).join(' or ');
};

/**
 *
 * @param isUserPlannedSort
 */
export const getChannelSort = (isUserPlannedSort: boolean) => {
  return isUserPlannedSort ? `${CHANNEL_ORDER}:${ASC},${CHANNEL_TITLE}:${ASC}` : `${CHANNEL_TITLE}:${ASC}`;
};

export const getFullName = (firstName, lastName) => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return '';
};

export const splitIntoChunks = (arr: Array<string>, chunkSize: number): Array<Array<string>> => {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

export const createFilterQuery = (fieldName: string, ids: Array<string>): string => {
  if (ids.length < 1) {
    return '';
  }
  return `${fieldName} eq '${ids.join(`' or ${fieldName} eq '`)}'`;
};
