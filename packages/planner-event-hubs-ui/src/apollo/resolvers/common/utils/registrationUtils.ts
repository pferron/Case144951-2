import { RegistrationCountResponseData, RegistrationCountRow } from '@dataSources/videoCenterService/client';
import { RegistrationCount, RegistrationCountResponse } from '@cvent/planner-event-hubs-model/types';

export const DAY_IN_MILLISECONDS = 86_400_000;
export const getWeekTime = (value: string | number, addDays = 0): number => {
  const date = new Date(value);
  const firstWeekDay = date.getUTCDate() - date.getUTCDay();
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), firstWeekDay + addDays);
};

export const getMonthTime = (value: string | number, addMonths = 0): number => {
  const date = new Date(value);
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + addMonths, 1);
};

export const mapToDays = (
  responseData: RegistrationCountResponseData,
  startTime: number,
  endTime: number
): RegistrationCountResponse => {
  let total = 0;
  const totalRegistrationCountDataItems: Map<number, number> =
    responseData?.data?.reduce((acc: Map<number, number>, item: RegistrationCountRow) => {
      const date = Date.parse(item.date);
      let value = Number(item.count);
      total += value;
      if (acc.has(date)) {
        value += acc.get(date);
      }
      acc.set(date, value);
      return acc;
    }, new Map<number, number>()) || new Map<number, number>();
  const date = new Date(startTime);
  let dayTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  do {
    if (!totalRegistrationCountDataItems.has(dayTime)) {
      totalRegistrationCountDataItems.set(dayTime, 0);
    }
    dayTime += DAY_IN_MILLISECONDS;
  } while (dayTime <= endTime);
  return {
    total,
    perDay: Array.from(totalRegistrationCountDataItems)
      .map(([key, value]) => ({ date: new Date(key), value }))
      .sort((itemA: RegistrationCount, itemB: RegistrationCount) => {
        return itemA.date - itemB.date;
      })
  };
};

export const mapToWeeks = (
  responseData: RegistrationCountResponseData,
  startTime: number,
  endTime: number
): RegistrationCountResponse => {
  let total = 0;
  const totalViewsDataItems: Map<number, number> =
    responseData?.data?.reduce((acc: Map<number, number>, item: RegistrationCountRow) => {
      const weekKey = getWeekTime(item.date);
      let value = Number(item.count);
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
      .sort((itemA: RegistrationCount, itemB: RegistrationCount) => {
        return itemA.date - itemB.date;
      })
  };
};

export const mapToMonths = (
  responseData: RegistrationCountResponseData,
  startTime: number,
  endTime: number
): RegistrationCountResponse => {
  let total = 0;
  const totalViewsDataItems: Map<number, number> =
    responseData?.data?.reduce((acc: Map<number, number>, item: RegistrationCountRow) => {
      const monthKey = getMonthTime(item.date);
      let value = Number(item.count);
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
      .sort((itemA: RegistrationCount, itemB: RegistrationCount) => {
        return itemA.date - itemB.date;
      })
  };
};
