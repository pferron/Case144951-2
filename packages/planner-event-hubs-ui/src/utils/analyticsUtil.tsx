import { AnalyticsData, AnalyticsDataItem } from '@cvent/planner-event-hubs-model/types';
import { differenceInCalendarMonths, differenceInDays, format, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { AnalyticsDataPoint } from '@components/hubOverview/HubOverViewLineChart';
import { utcToZonedTime } from 'date-fns-tz';
import { MINI_SECONDS_IN_DAY } from '@utils/constants';

/**
 * Function to return the date range for fetching analytics data.
 * @param days
 * @param selectedTimeframe
 */
export function getDatetimesForAnalytics(days, selectedTimeframe): OverviewDatetimes {
  const today = new Date();
  const [startDate, endDate] = selectedTimeframe.split('-');
  switch (days) {
    case 7:
      return {
        currentStartDate: getDateAsISO(new Date().setDate(today.getDate() - 6)),
        currentEndDate: getTodayAsISO(),
        previousStartDate: getDateAsISO(new Date().setDate(today.getDate() - 12)),
        previousEndDate: getDateAsISO(new Date().setDate(today.getDate() - 6))
      };
    case 30:
      return {
        currentStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 1)),
        currentEndDate: getTodayAsISO(),
        previousStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 2)),
        previousEndDate: getDateAsISO(new Date().setMonth(today.getMonth() - 1))
      };
    case 90:
      return {
        currentStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 2)),
        currentEndDate: getTodayAsISO(),
        previousStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 4)),
        previousEndDate: getDateAsISO(new Date().setMonth(today.getMonth() - 2))
      };
    case 180:
      return {
        currentStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 5)),
        currentEndDate: getTodayAsISO(),
        previousStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 10)),
        previousEndDate: getDateAsISO(new Date().setMonth(today.getMonth() - 5))
      };
    case 365:
      return {
        currentStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 11)),
        currentEndDate: getTodayAsISO(),
        previousStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 23)),
        previousEndDate: getDateAsISO(new Date().setMonth(today.getMonth() - 12))
      };
    default:
      if (selectedTimeframe.includes('-')) {
        // Custom time selection via datepicker
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffInDays = Math.abs(Math.round((start.getTime() - end.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        return {
          currentStartDate: getDateAsISO(start.getTime() + MINI_SECONDS_IN_DAY),
          currentEndDate: getDateAsISO(end.getTime() + MINI_SECONDS_IN_DAY),
          previousStartDate: getDateAsISO(start.getTime() - MINI_SECONDS_IN_DAY * diffInDays),
          previousEndDate: getDateAsISO(end.getTime() - MINI_SECONDS_IN_DAY * diffInDays)
        };
      }
      return {
        // default selection (30 days | 1 Month)
        currentStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 1)),
        currentEndDate: getTodayAsISO(),
        previousStartDate: getDateAsISO(new Date().setMonth(today.getMonth() - 2)),
        previousEndDate: getDateAsISO(new Date().setMonth(today.getMonth() - 1))
      };
  }
}

/**
 * Calculates percentage increase or decrease in a value
 * @param oldValue
 * @param newValue
 */
export function getPercentageDifference(oldValue: number, newValue: number): number {
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(oldValue) || isNaN(newValue) || oldValue === 0) {
    return 0;
  }
  if (oldValue === 0 && newValue === 0) {
    return 0;
  }
  return Math.round(((newValue - oldValue) / oldValue) * 100);
}

const roundTo = (value: number, round: number): number => {
  const remaining = value % round;
  return value - remaining + (remaining === 0 ? 0 : round);
};

/**
 * Get Y axis tick values for given data
 * @param data
 */
export const getYAxisTickValues = (data: AnalyticsDataPoint[]): number[] => {
  let largestYValue = data && data?.reduce((a, c) => (a < c.value ? c.value : a), 0);

  if (largestYValue === 0) {
    return [];
  }

  if (largestYValue <= 5) {
    return [1, 2, 3, 4, 5];
  }

  if (largestYValue <= 10) {
    return [0, 5, 10];
  }
  if (largestYValue !== 10) {
    // update largest value to be multiple of 10
    largestYValue = roundTo(largestYValue, 10);
  }

  const thirty = largestYValue % 30;
  const twenty = largestYValue % 20;
  const match = Math.min(twenty, thirty);

  const size = match === thirty ? 4 : 5;
  const multiple = largestYValue / (size - 1);

  return Array.from({ length: size }, (_, index) => Math.round(multiple * index));
};

/**
 * Get today date in ISO string
 */
const getTodayAsISO = (): string => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
};

/**
 * Get Date in ISO string
 * @param date
 */
const getDateAsISO = (date: number): string => {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
};

/**
 * Extract perDay, perMonth, or perWeek data from the data object returned by graph layer and get the timeframe category
 * @param data
 */
export const getDataForTimeframeCategory = (data: AnalyticsData): AnalyticsDataResponse[] => {
  if (data?.total === null) {
    return [];
  }
  const result = ['perDay', 'perMonth', 'perWeek']
    .filter(key => data?.[key]?.length > 0)
    .map(key => ({ timeframeCategory: key, dataArray: data[key] }));
  return result;
};

/**
 * Get the category for given date range
 * @param startDate
 * @param endDate
 */
export const getCategory = (startDate: string, endDate: string): string | null => {
  if (!startDate || !endDate) {
    return null;
  }
  const convertToUTCDate = (date: string | Date): Date => {
    const dateInput = new Date(date);
    return utcToZonedTime(dateInput, 'UTC');
  };
  const earliestDate = convertToUTCDate(new Date(startDate));
  const latestDate = convertToUTCDate(new Date(endDate));
  const daysInRange = earliestDate && latestDate ? differenceInDays(latestDate, earliestDate) : 0;

  if (
    differenceInCalendarMonths(latestDate, earliestDate) >= 2 &&
    differenceInCalendarMonths(latestDate, earliestDate) <= 12
  ) {
    return `${format(earliestDate, 'MMM yyyy')} - ${format(latestDate, 'MMM yyyy')}`;
  }
  if (isSameDay(earliestDate, latestDate)) {
    return `${format(earliestDate, 'MMM d')}`;
  }
  if (daysInRange <= 7 && isSameMonth(earliestDate, latestDate)) {
    return `${format(earliestDate, 'MMM d')} - ${format(latestDate, 'd')}`;
  }
  if (!isSameYear(earliestDate, latestDate)) {
    return `${format(earliestDate, 'MMM d, yyyy')} - ${format(latestDate, 'MMM d, yyyy')}`;
  }
  return `${format(earliestDate, 'MMM d')} - ${format(latestDate, 'MMM d')}`;
};

interface OverviewDatetimes {
  currentStartDate: string;
  currentEndDate: string;
  previousStartDate?: string;
  previousEndDate?: string;
}

export interface AnalyticsDataResponse {
  timeframeCategory: string;
  dataArray: AnalyticsDataItem[];
}
