import { format } from 'date-fns';

interface DateRangeOptions {
  label: string;
  value: string;
}

export const getDateRangeOptions = (translate: (val: string) => string): DateRangeOptions[] => [
  {
    label: translate('video_list_date_picker_last_7_days'),
    value: 'last_7_days'
  },
  {
    label: translate('video_list_date_picker_last_30_days'),
    value: 'last_30_days'
  },
  {
    label: translate('video_list_date_picker_last_3_months'),
    value: 'last_3_months'
  },
  {
    label: translate('video_list_date_picker_last_6_months'),
    value: 'last_6_months'
  },
  {
    label: translate('video_list_date_picker_last_12_months'),
    value: 'last_12_months'
  },
  {
    label: translate('video_list_date_picker_custom_date_range'),
    value: 'custom_date_range'
  }
];

export const formatDuration = seconds => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const formattedTime = [mins, secs].map(unit => String(unit).padStart(2, '0')).join(':');

  return hrs > 0 ? `${String(hrs).padStart(2, '0')}:${formattedTime}` : formattedTime;
};

export const getStartDate = option => {
  switch (option) {
    case 'last_7_days':
      return 7;
    case 'last_30_days':
      return 30;
    case 'last_3_months':
      return 90;
    case 'last_6_months':
      return 180;
    case 'last_12_months':
      return 365;
    default:
      return null;
  }
};

export const dateFormat = 'MM/dd/yyyy';

export const onDateApplyHandler = (
  startDate: Date,
  endDate: Date,
  setSelectedTimeframe: (timeframe: string) => void,
  setDatePickerModalIsOpen: (isOpen: boolean) => void,
  setDateForAnalytics: (value) => void,
  dropDownOptions: { label: string; value: string }[],
  setSelectedDateRange: (value) => void
) => {
  setDatePickerModalIsOpen(false);
  const formattedStartDate = format(startDate, dateFormat);
  const formattedEndDate = format(endDate, dateFormat);
  const dateRange = `${formattedStartDate} - ${formattedEndDate}`;
  setSelectedTimeframe(dateRange);
  setDateForAnalytics({ type: 'custom', value: { startDate, endDate } });
  const customDateRangeOption = dropDownOptions.find(option => option.value === 'custom_date_range');
  if (customDateRangeOption) {
    customDateRangeOption.label = dateRange;
  }
  setSelectedDateRange({ value: 'custom_date_range' });
};
