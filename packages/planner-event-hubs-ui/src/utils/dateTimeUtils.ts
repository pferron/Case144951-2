export const formatDateTimeStamp = (
  locale,
  date,
  isHour12Format = true,
  includeTimezoneName = true,
  timezone = null
) => {
  const tz = timezone ?? new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const formattedDate = new Intl.DateTimeFormat(locale, {
    timeZone: tz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: isHour12Format,
    timeZoneName: includeTimezoneName ? 'short' : undefined
  }).format(date);

  return formattedDate.replace(',', '');
};
