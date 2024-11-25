import getStartEndDate from '@utils/getStartEndDate';
import moment from 'moment';

const extractDayFromYYYYMMDD = (date: string): string => {
  return date.split('-')[2].substring(0, 2);
};
const extractDateFromYYYYMMDD = (date: string): string => {
  return date.split('T')[0];
};

const extractHoursFromYYYYMMDD = (date: string): string => {
  return date.split('T')[1].substring(0, 2);
};

const now = new Date();

const nDaysPastDate = (daysCount: number): Date => {
  return new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysCount);
};

describe('Test getStartDate', () => {
  it('date Filter: today', () => {
    const startEndDate = getStartEndDate('today', null, null);
    expect(extractDayFromYYYYMMDD(startEndDate.filterEndDate)).toBe(now.getUTCDate().toString().padStart(2, '0'));
    expect(extractDayFromYYYYMMDD(startEndDate.filterStartDate)).toBe(
      new Date(now.setHours(0, 0, 0, 0)).getUTCDate().toString().padStart(2, '0')
    );
  });

  it('date Filter: week', () => {
    const startEndDate = getStartEndDate('week', null, null);
    expect(extractDayFromYYYYMMDD(startEndDate.filterEndDate)).toBe(now.getUTCDate().toString().padStart(2, '0'));
    expect(extractDayFromYYYYMMDD(startEndDate.filterStartDate)).toBe(
      nDaysPastDate(6).getUTCDate().toString().padStart(2, '0')
    );
  });

  it('date Filter: month', () => {
    const startEndDate = getStartEndDate('month', null, null);
    expect(extractDayFromYYYYMMDD(startEndDate.filterEndDate)).toBe(now.getUTCDate().toString().padStart(2, '0'));
    expect(extractDayFromYYYYMMDD(startEndDate.filterStartDate)).toBe(
      nDaysPastDate(29).getUTCDate().toString().padStart(2, '0')
    );
  });

  it('date Filter: year', () => {
    const startEndDate = getStartEndDate('year', null, null);
    expect(extractDayFromYYYYMMDD(startEndDate.filterEndDate)).toBe(now.getUTCDate().toString().padStart(2, '0'));
    expect(extractDayFromYYYYMMDD(startEndDate.filterStartDate)).toBe(
      nDaysPastDate(364).getUTCDate().toString().padStart(2, '0')
    );
  });

  it('date Filter: tomorrow', () => {
    const startEndDate = getStartEndDate('tomorrow', null, null);
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterEndDate), 10)).toBe(moment().add(1, 'days').date());
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterStartDate), 10)).toBe(moment().add(1, 'days').date());
  });

  it('date Filter: yesterday', () => {
    const startEndDate = getStartEndDate('yesterday', null, null);
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterEndDate), 10)).toBe(moment().subtract(1, 'days').date());
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterStartDate), 10)).toBe(
      moment().subtract(1, 'days').date()
    );
  });

  it('date Filter: last Week', () => {
    const startEndDate = getStartEndDate('last Week', null, null);
    const lastWeek = moment().subtract(1, 'week');
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterEndDate), 10)).toBe(lastWeek.endOf('week').date());
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterStartDate), 10)).toBe(lastWeek.startOf('week').date());
  });

  it('date Filter: this Week', () => {
    const startEndDate = getStartEndDate('this Week', null, null);
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterEndDate), 10)).toBe(moment().endOf('week').date());
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterStartDate), 10)).toBe(moment().add(1, 'days').date());
  });

  it('date Filter: next Week', () => {
    const startEndDate = getStartEndDate('next Week', null, null);
    const lastWeek = moment().add(1, 'week');
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterEndDate), 10)).toBe(lastWeek.endOf('week').date());
    expect(parseInt(extractDayFromYYYYMMDD(startEndDate.filterStartDate), 10)).toBe(lastWeek.startOf('week').date());
  });

  it('date Filter: this Month', () => {
    const startEndDate = getStartEndDate('this Month', null, null);
    expect(extractDateFromYYYYMMDD(startEndDate.filterEndDate)).toBe(moment().endOf('month').format('YYYY-MM-DD'));
    expect(extractDateFromYYYYMMDD(startEndDate.filterStartDate)).toBe(moment().add(1, 'days').format('YYYY-MM-DD'));
  });

  it('date Filter: last Month', () => {
    const startEndDate = getStartEndDate('last Month', null, null);
    const lastMonth = moment().subtract(1, 'month');
    expect(extractDateFromYYYYMMDD(startEndDate.filterEndDate)).toBe(lastMonth.endOf('month').format('YYYY-MM-DD'));
    expect(extractDateFromYYYYMMDD(startEndDate.filterStartDate)).toBe(lastMonth.startOf('month').format('YYYY-MM-DD'));
  });

  it('date Filter: this Year', () => {
    const startEndDate = getStartEndDate('this Year', null, null);
    expect(extractDateFromYYYYMMDD(startEndDate.filterStartDate)).toBe(moment().startOf('year').format('YYYY-MM-DD'));
    expect(extractDateFromYYYYMMDD(startEndDate.filterEndDate)).toBe(moment().subtract(1, 'days').format('YYYY-MM-DD'));
  });

  it('date Filter: previous Year', () => {
    const startEndDate = getStartEndDate('previous Year', null, null);
    const lastYear = moment().subtract(1, 'year');
    expect(extractDateFromYYYYMMDD(startEndDate.filterEndDate)).toBe(lastYear.endOf('year').format('YYYY-MM-DD'));
    expect(extractDateFromYYYYMMDD(startEndDate.filterStartDate)).toBe(lastYear.startOf('year').format('YYYY-MM-DD'));
  });

  it('date Filter: start date and endDate', () => {
    const startEndDate = getStartEndDate(
      null,
      moment().tz('utc').subtract(17, 'days'),
      moment().tz('utc').subtract(12, 'days')
    );
    expect(extractDayFromYYYYMMDD(startEndDate.filterEndDate)).toBe(
      nDaysPastDate(12).getUTCDate().toString().padStart(2, '0')
    );
    expect(extractDayFromYYYYMMDD(startEndDate.filterStartDate)).toBe(
      nDaysPastDate(17).getUTCDate().toString().padStart(2, '0')
    );
  });

  it('date Filter: null end date', () => {
    const startEndDate = getStartEndDate(null, moment().tz('utc').subtract(17, 'days'), null);
    expect(startEndDate).toBeNull();
  });

  it('date Filter: dateFilter, start date and endDate', () => {
    const startEndDate = getStartEndDate(
      'year',
      moment().tz('utc').subtract(17, 'days'),
      moment().tz('utc').subtract(12, 'days')
    );
    expect(extractDayFromYYYYMMDD(startEndDate.filterEndDate)).toBe(now.getUTCDate().toString().padStart(2, '0'));
    expect(extractDayFromYYYYMMDD(startEndDate.filterStartDate)).toBe(
      nDaysPastDate(364).getUTCDate().toString().padStart(2, '0')
    );
  });

  it('date Filter: un handled date group', () => {
    const startEndDate = getStartEndDate(
      'random',
      moment().tz('utc').subtract(17, 'days'),
      moment().tz('utc').subtract(12, 'days')
    );
    expect(startEndDate).toBeNull();
  });

  it('date Filter: for two consecutive days', () => {
    const startEndDate = getStartEndDate(
      null,
      moment().tz('utc').subtract(17, 'days'),
      moment().tz('utc').subtract(16, 'days')
    );
    // Checks for start Date
    expect(Number(extractDayFromYYYYMMDD(startEndDate.filterStartDate))).toBe(
      new Date(
        nDaysPastDate(17).getFullYear(),
        nDaysPastDate(17).getMonth(),
        nDaysPastDate(17).getDate(),
        0,
        0,
        0
      ).getUTCDate()
    );
    // Checks for End Date
    expect(Number(extractDayFromYYYYMMDD(startEndDate.filterEndDate))).toBe(
      new Date(
        nDaysPastDate(16).getFullYear(),
        nDaysPastDate(16).getMonth(),
        nDaysPastDate(16).getDate(),
        23,
        59,
        59
      ).getUTCDate()
    );
    // Checks for start Date hours
    expect(Number(extractHoursFromYYYYMMDD(startEndDate.filterStartDate))).toBe(
      new Date(
        nDaysPastDate(17).getFullYear(),
        nDaysPastDate(17).getMonth(),
        nDaysPastDate(17).getDate(),
        0,
        0,
        0
      ).getUTCHours()
    );
    // Checks for End Date Hours
    expect(Number(extractHoursFromYYYYMMDD(startEndDate.filterEndDate))).toBe(
      new Date(
        nDaysPastDate(16).getFullYear(),
        nDaysPastDate(16).getMonth(),
        nDaysPastDate(16).getDate(),
        23,
        59,
        59
      ).getUTCHours()
    );
  });
});
