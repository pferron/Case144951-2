import {
  getCategory,
  getDatetimesForAnalytics,
  getPercentageDifference,
  getYAxisTickValues
} from '@utils/analyticsUtil';
import { differenceInCalendarDays, differenceInCalendarMonths, differenceInDays } from 'date-fns';

describe('analyticsUtil', () => {
  describe('getPercentageDifference', () => {
    it('any number is not valid', () => {
      const result = getPercentageDifference(12, 'test');
      expect(result).toEqual(0);
    });

    it('old value is 0', () => {
      const result = getPercentageDifference(0, 5);
      expect(result).toEqual(0);
    });

    it('new value is 0', () => {
      const result = getPercentageDifference(5, 0);
      expect(result).toEqual(-100);
    });

    it('both values are 0', () => {
      const result = getPercentageDifference(0, 0);
      expect(result).toEqual(0);
    });

    it('Both values are non-zero and new > old', () => {
      const result = getPercentageDifference(5, 25);
      expect(result).toEqual(400);
    });

    it('Both values are non-zero and new < old', () => {
      const result = getPercentageDifference(25, 5);
      expect(result).toEqual(-80);
    });
  });

  const dataPoints = [
    {
      group: 'Jan 2023',
      category: '2023',
      value: 11
    },
    {
      group: 'Feb 2023',
      category: '2023',
      value: 21
    },
    {
      group: 'Mar 2023',
      category: '2023',
      value: 8
    },
    {
      group: 'Apr 2023',
      category: '2023',
      value: 16
    },
    {
      group: 'May 2023',
      category: '2023',
      value: 5
    }
  ];

  it('getYAxisTickValues', () => {
    const result = getYAxisTickValues(dataPoints);
    expect(result).toBeTruthy();
    expect(result).toEqual([0, 10, 20, 30]);
  });

  it('getYAxisTickValues values equals to 0', () => {
    const result = getYAxisTickValues([
      {
        group: 'Jan 2023',
        category: '2023',
        value: 0
      }
    ]);
    expect(result).toBeTruthy();
    expect(result).toEqual([]);
  });

  it('getYAxisTickValues values less than 10', () => {
    const result = getYAxisTickValues([
      {
        group: 'Jan 2023',
        category: '2023',
        value: 1
      },
      {
        group: 'Feb 2023',
        category: '2023',
        value: 4
      }
    ]);
    expect(result).toBeTruthy();
    expect(result).toEqual([1, 2, 3, 4, 5]);
  });

  describe('getCategory', () => {
    it('difference between dates is between 3 and 12 months', () => {
      const startDate = '2023-05-01T00:00:00.000Z';
      const endDate = '2023-10-01T00:00:00.000Z';
      const result = getCategory(startDate, endDate);
      expect(result).toBeTruthy();
      expect(result).toEqual('May 2023 - Oct 2023');
    });
  });

  describe('getDatetimesForAnalytics', () => {
    it('Test pre selected date inputs for value 7', () => {
      const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(7, '');

      const diffCurrentDates = differenceInDays(new Date(currentEndDate), new Date(currentStartDate));
      expect(diffCurrentDates).toEqual(6);

      const diffPreviousDates = differenceInDays(new Date(previousEndDate), new Date(previousStartDate));
      expect(diffPreviousDates).toEqual(6);

      const diffPrevStartCurrentEnd = differenceInDays(new Date(currentEndDate), new Date(previousStartDate));
      expect(diffPrevStartCurrentEnd).toEqual(12);
    });

    it('Test pre selected date inputs for value 30', () => {
      const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(30, '');

      const diffCurrentDates = differenceInCalendarDays(new Date(currentEndDate), new Date(currentStartDate));
      expect([28, 29, 30, 31]).toContain(diffCurrentDates);

      const diffPreviousDates = differenceInCalendarDays(new Date(previousEndDate), new Date(previousStartDate));
      expect([28, 29, 30, 31]).toContain(diffPreviousDates);

      const diffPrevStartCurrentEnd = differenceInCalendarDays(new Date(currentEndDate), new Date(previousStartDate));
      expect([58, 59, 60, 61, 62]).toContain(diffPrevStartCurrentEnd);
    });

    it('Test pre selected date inputs for value 90', () => {
      const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(90, '');
      const diffCurrentDates = differenceInCalendarDays(new Date(currentEndDate), new Date(currentStartDate));
      expect([58, 59, 60, 61, 62]).toContain(diffCurrentDates);

      const diffPreviousDates = differenceInCalendarDays(new Date(previousEndDate), new Date(previousStartDate));
      expect([58, 59, 60, 61, 62]).toContain(diffPreviousDates);

      const diffPrevStartCurrentEnd = differenceInCalendarDays(new Date(currentEndDate), new Date(previousStartDate));
      expect([118, 119, 120, 121, 122, 123]).toContain(diffPrevStartCurrentEnd);
    });
    // Mauve
    // eslint-disable-next-line jest/no-disabled-tests
    it.skip('Test pre selected date inputs for value 180', () => {
      const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(
        180,
        ''
      );

      const diffCurrentDates = differenceInCalendarMonths(new Date(currentEndDate), new Date(currentStartDate));
      expect(diffCurrentDates).toEqual(5);

      const diffPreviousDates = differenceInCalendarMonths(new Date(previousEndDate), new Date(previousStartDate));
      expect(diffPreviousDates).toEqual(5);

      const diffPrevStartCurrentEnd = differenceInCalendarMonths(new Date(currentEndDate), new Date(previousStartDate));
      expect(diffPrevStartCurrentEnd).toEqual(10);
    });

    it('Test pre selected date inputs for value 365', () => {
      const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(
        365,
        ''
      );

      const diffCurrentDates = differenceInCalendarMonths(new Date(currentEndDate), new Date(currentStartDate));
      expect([10, 11]).toContain(diffCurrentDates);

      const diffPreviousDates = differenceInCalendarMonths(new Date(previousEndDate), new Date(previousStartDate));
      expect([10, 11]).toContain(diffPreviousDates);

      const diffPrevStartCurrentEnd = differenceInCalendarMonths(new Date(currentEndDate), new Date(previousStartDate));
      expect([22, 23]).toContain(diffPrevStartCurrentEnd);
    });

    it('Test custom date inputs', () => {
      const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(
        1000,
        '02/2/2024-04/2/2024'
      );

      const diffCurrentDates = differenceInCalendarMonths(new Date(currentEndDate), new Date(currentStartDate));
      expect(diffCurrentDates).toEqual(2);

      const diffPreviousDates = differenceInCalendarMonths(new Date(previousEndDate), new Date(previousStartDate));
      expect(diffPreviousDates).toEqual(2);

      const diffPrevStartCurrentEnd = differenceInCalendarMonths(new Date(currentEndDate), new Date(previousStartDate));
      expect(diffPrevStartCurrentEnd).toEqual(4);
    });

    it('Test default selection: 30 days', () => {
      const { currentStartDate, currentEndDate, previousStartDate, previousEndDate } = getDatetimesForAnalytics(
        1000,
        ''
      );

      const diffCurrentDates = differenceInCalendarDays(new Date(currentEndDate), new Date(currentStartDate));
      expect([28, 29, 30, 31]).toContain(diffCurrentDates);

      const diffPreviousDates = differenceInCalendarDays(new Date(previousEndDate), new Date(previousStartDate));
      expect([28, 29, 30, 31]).toContain(diffPreviousDates);

      const diffPrevStartCurrentEnd = differenceInCalendarDays(new Date(currentEndDate), new Date(previousStartDate));
      expect([58, 59, 60, 61, 62]).toContain(diffPrevStartCurrentEnd);
    });
  });
});
