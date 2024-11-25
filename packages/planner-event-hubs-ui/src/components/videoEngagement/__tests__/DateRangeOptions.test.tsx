import { format } from 'date-fns';
import {
  getDateRangeOptions,
  formatDuration,
  getStartDate,
  dateFormat,
  onDateApplyHandler
} from '@components/videoEngagement/DateRangeOptions';

describe('DateRangeOptions', () => {
  it('returns correct date range options', () => {
    const translate = (val: string) => val;
    const options = getDateRangeOptions(translate);
    expect(options).toEqual([
      { label: 'video_list_date_picker_last_7_days', value: 'last_7_days' },
      { label: 'video_list_date_picker_last_30_days', value: 'last_30_days' },
      { label: 'video_list_date_picker_last_3_months', value: 'last_3_months' },
      { label: 'video_list_date_picker_last_6_months', value: 'last_6_months' },
      { label: 'video_list_date_picker_last_12_months', value: 'last_12_months' },
      { label: 'video_list_date_picker_custom_date_range', value: 'custom_date_range' }
    ]);
  });

  it('formats duration correctly', () => {
    expect(formatDuration(60)).toBe('01:00');
    expect(formatDuration(3600)).toBe('01:00:00');
    expect(formatDuration(3661)).toBe('01:01:01');
  });

  it('returns correct start date', () => {
    expect(getStartDate('last_7_days')).toBe(7);
    expect(getStartDate('last_30_days')).toBe(30);
    expect(getStartDate('last_3_months')).toBe(90);
    expect(getStartDate('last_6_months')).toBe(180);
    expect(getStartDate('last_12_months')).toBe(365);
    expect(getStartDate('custom_date_range')).toBeNull();
  });

  it('onDateApplyHandler - applies date range correctly', () => {
    const setSelectedTimeframe = jest.fn();
    const setDatePickerModalIsOpen = jest.fn();
    const setDateForAnalytics = jest.fn();
    const setCustomDateRange = jest.fn();

    const startDate = new Date(2024, 8, 1);
    const endDate = new Date(2024, 8, 30);

    const translate = (val: string) => val;
    const options = getDateRangeOptions(translate);

    onDateApplyHandler(
      startDate,
      endDate,
      setSelectedTimeframe,
      setDatePickerModalIsOpen,
      setDateForAnalytics,
      options,
      setCustomDateRange
    );

    const formattedStartDate = format(startDate, dateFormat);
    const formattedEndDate = format(endDate, dateFormat);

    expect(setDatePickerModalIsOpen).toHaveBeenCalledWith(false);
    expect(setSelectedTimeframe).toHaveBeenCalledWith(`${formattedStartDate} - ${formattedEndDate}`);
    expect(setCustomDateRange).toHaveBeenCalledWith({ value: 'custom_date_range' });
  });
});
