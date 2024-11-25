import { AnalyticsResponseData, AnalyticsRowData, VideoViewsAndPosition } from '@dataSources/analyticsService/client';
import { ViewsBySourceResponse, AnalyticsData, AnalyticsDataItem } from '@cvent/planner-event-hubs-model/types';

export const DAY_IN_MILLISECONDS = 86_400_000;
export const DAYS_IN_WEEK = 7;

// converting from video miliseconds duration to hms string format
const positionConvertedTime = ms => {
  const result = new Date(ms).toISOString().slice(11, 19);
  return result; // expected output Year: Month: Day: hh:mm:ss: ...)
};

// These functions take the video duration in ms and convert it into a number (seconds, minutes, or hours)
// this conversion allows for the line graph to use the number rather than the millisecond form
export const axisMaxCalcSec = (ms: number): number => {
  const stringValue = positionConvertedTime(ms);
  const axisMaxSecStr = stringValue.slice(6);
  const axisMaxSec = parseInt(axisMaxSecStr, 10);
  return axisMaxSec;
};

export const axisMaxCalcMin = (ms: number): number => {
  const stringValue = positionConvertedTime(ms);
  const axisMaxMinStr = stringValue.slice(3, 5);
  const axisMaxMin = parseInt(axisMaxMinStr, 10);
  return axisMaxMin;
};

export const axisMaxCalcHour = (ms: number): number => {
  const stringValue = positionConvertedTime(ms);
  const axisMaxHourStr = stringValue.slice(0, 2);
  const axisMaxHour = parseInt(axisMaxHourStr, 10);
  return axisMaxHour;
};

export const getEpoch = (dateInMilliseconds: number): number => {
  return Math.floor(dateInMilliseconds / 1000);
};

export const getWeekTime = (value: string | number, addDays = 0): number => {
  const date = new Date(value);
  const firstWeekDay = date.getUTCDate() - date.getUTCDay();
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), firstWeekDay + addDays);
};

export const getMonthTime = (value: string | number, addMonths = 0): number => {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + addMonths, 1);
};

export const getDayTime = (value: string | number, addDays = 0): number => {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + addDays);
};

export const mapToDays = (
  data: AnalyticsResponseData,
  startTime: number,
  endTime: number,
  valueIndex: number
): AnalyticsData => {
  let total = 0;
  const totalViewsDataItems: Map<number, number> =
    data?.rows?.reduce((acc: Map<number, number>, item: AnalyticsRowData) => {
      const date = Date.parse(item.values?.[0]);
      let value = Number(item.values?.[valueIndex]);
      total += value;
      if (acc.has(date)) {
        value += acc.get(date);
      }
      acc.set(date, value);
      return acc;
    }, new Map<number, number>()) || new Map<number, number>();

  let dayTime = getDayTime(startTime);
  do {
    if (!totalViewsDataItems.has(dayTime)) {
      totalViewsDataItems.set(dayTime, 0);
    }
    dayTime = getDayTime(dayTime, 1);
  } while (dayTime <= endTime);

  return {
    total,
    perDay: Array.from(totalViewsDataItems)
      .map(([key, value]) => ({ date: new Date(key), value }))
      .sort((itemA: AnalyticsDataItem, itemB: AnalyticsDataItem) => {
        return itemA.date - itemB.date;
      })
  };
};

export const mapToWeeks = (
  data: AnalyticsResponseData,
  startTime: number,
  endTime: number,
  valueIndex: number
): AnalyticsData => {
  let total = 0;
  const totalViewsDataItems: Map<number, number> =
    data?.rows?.reduce((acc: Map<number, number>, item: AnalyticsRowData) => {
      const weekKey = getWeekTime(item.values?.[0]);
      let value = Number(item.values?.[valueIndex]);
      total += value;
      if (acc.has(weekKey)) {
        value += acc.get(weekKey);
      }
      acc.set(weekKey, value);
      return acc;
    }, new Map<number, number>()) || new Map<number, number>();

  let weekTime = getWeekTime(startTime);
  const finalWeekTime = getWeekTime(endTime);
  do {
    if (!totalViewsDataItems.has(weekTime)) {
      totalViewsDataItems.set(weekTime, 0);
    }
    weekTime = getWeekTime(weekTime, 7);
  } while (weekTime <= finalWeekTime);

  return {
    total,
    perWeek: Array.from(totalViewsDataItems)
      .map(([key, value]) => ({ date: new Date(key), value }))
      .sort((itemA: AnalyticsDataItem, itemB: AnalyticsDataItem) => {
        return itemA.date - itemB.date;
      })
  };
};

export const mapToMonths = (
  data: AnalyticsResponseData,
  startTime: number,
  endTime: number,
  valueIndex: number
): AnalyticsData => {
  let total = 0;
  const totalViewsDataItems: Map<number, number> =
    data?.rows?.reduce((acc: Map<number, number>, item: AnalyticsRowData) => {
      const monthKey = getMonthTime(item.values?.[0]);
      let value = Number(item.values?.[valueIndex]);
      total += value;
      if (acc.has(monthKey)) {
        value += acc.get(monthKey);
      }
      acc.set(monthKey, value);
      return acc;
    }, new Map<number, number>()) || new Map<number, number>();

  let monthTime = getMonthTime(startTime);
  const finalMonthTime = getMonthTime(endTime);
  do {
    if (!totalViewsDataItems.has(monthTime)) {
      totalViewsDataItems.set(monthTime, 0);
    }
    monthTime = getMonthTime(monthTime, 1);
  } while (monthTime <= finalMonthTime);

  return {
    total,
    perMonth: Array.from(totalViewsDataItems)
      .map(([key, value]) => ({ date: new Date(key), value }))
      .sort((itemA: AnalyticsDataItem, itemB: AnalyticsDataItem) => {
        return itemA.date - itemB.date;
      })
  };
};

export const computeViewsBySource = (data: AnalyticsResponseData): ViewsBySourceResponse => {
  const DEVICE_TYPE_INDEX = 2;
  const TOTAL_VIDEO_VIEWS_INDEX = 3;

  const viewsBySource: Map<string, number> = data?.rows?.reduce(
    (accumulator: Map<string, number>, item: AnalyticsRowData) => {
      const deviceType = item.values?.[DEVICE_TYPE_INDEX];
      let value = Number(item.values?.[TOTAL_VIDEO_VIEWS_INDEX]);
      if (accumulator.has(deviceType)) {
        value += accumulator.get(deviceType);
      }
      accumulator.set(deviceType, value);
      return accumulator;
    },
    new Map<string, number>()
  );
  const desktopViews = viewsBySource.get('desktop') || 0;
  const tabletViews = viewsBySource.get('tablet') || 0;
  const mobileViews = viewsBySource.get('mobile') || 0;
  return {
    desktopViews,
    mobileViews,
    tabletViews,
    totalViews: desktopViews + mobileViews + tabletViews
  };
};

export const sortVideosByViewsDescending = (data: AnalyticsResponseData): VideoViewsAndPosition[] => {
  const VIDEO_ID_INDEX = 1;
  const TOTAL_VIDEO_VIEWS_INDEX = 3;
  const totalVideoViewedDataItems: Map<string, number> = data?.rows?.reduce(
    (accumulator: Map<string, number>, item: AnalyticsRowData) => {
      const videoId = item.values?.[VIDEO_ID_INDEX];
      let value = Number(item.values?.[TOTAL_VIDEO_VIEWS_INDEX]);
      if (accumulator.has(videoId)) {
        value += accumulator.get(videoId);
      }
      accumulator.set(videoId, value);
      return accumulator;
    },
    new Map<string, number>()
  );

  return Array.from(totalVideoViewedDataItems)
    .sort((itemA, itemB) => itemB[1] - itemA[1])
    .map(
      ([key, value], index): VideoViewsAndPosition => ({
        videoId: key,
        totalViews: value,
        position: index + 1
      })
    );
};
