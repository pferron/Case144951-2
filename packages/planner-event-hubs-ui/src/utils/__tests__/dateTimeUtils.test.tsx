import { formatDateTimeStamp } from '@utils/dateTimeUtils';

describe('formatDateTimeStamp', () => {
  const date = new Date('2024-02-07T19:12:52.637Z');

  it('should format date with default parameters', () => {
    const result = formatDateTimeStamp('en-US', date);
    expect(result).toBe('2/7/2024 7:12:52 PM UTC');
  });

  it('should format date with custom locale', () => {
    const result = formatDateTimeStamp('fr-FR', date);
    expect(result).toBe('07/02/2024 7:12:52 PM UTC');
  });

  it('should format date in 24-hour format', () => {
    const result = formatDateTimeStamp('en-US', date, false);
    expect(result).toBe('2/7/2024 19:12:52 UTC');
  });

  it('should format date without timezone name', () => {
    const result = formatDateTimeStamp('en-US', date, true, false);
    expect(result).toBe('2/7/2024 7:12:52 PM');
  });

  it('should format date with custom timezone', () => {
    const result = formatDateTimeStamp('en-US', date, true, true, 'America/New_York');
    expect(result).toBe('2/7/2024 2:12:52 PM EST');
  });
});
