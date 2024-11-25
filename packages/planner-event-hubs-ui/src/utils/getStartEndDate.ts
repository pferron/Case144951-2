import moment from 'moment-timezone';
import { Moment } from 'moment/moment';

//  The Carina DateRangePicker component needs/sets the start/end date as moment.
//  If moment was to change, then it needs to be in a format that can be taken in by Carina DateRangePicker and all the files are in JS and we do not really have an aligned type yet.
const getStartEndDate = (
  dateFilter: string,
  startDate: Moment,
  endDate: Moment,
  timezone = moment.tz.guess(),
  format = 'YYYY-MM-DDTHH:mm:ss'
): {
  filterStartDate: string;
  filterEndDate: string;
} => {
  const filterBaseStartDate = moment().hours(0).minutes(0).seconds(0).tz(timezone).utc(); // Taking base as midnight
  let filterStartDate;
  let filterEndDate = moment().tz(timezone).utc().format(format);
  if (dateFilter) {
    switch (dateFilter) {
      case 'today':
        filterStartDate = filterBaseStartDate.format(format);
        filterEndDate = moment.tz(timezone).endOf('day').format(format);
        break;
      case 'tomorrow':
        filterStartDate = moment().tz(timezone).add(1, 'days').startOf('day').format(format);
        filterEndDate = moment().tz(timezone).add(1, 'days').endOf('day').format(format);
        break;
      case 'yesterday':
        filterStartDate = moment().tz(timezone).subtract(1, 'days').startOf('day').format(format);
        filterEndDate = moment().tz(timezone).subtract(1, 'days').endOf('day').format(format);
        break;
      case 'week':
        filterStartDate = filterBaseStartDate.subtract(6, 'days').format(format);
        break;
      case 'last Week':
        filterStartDate = moment().tz(timezone).subtract(1, 'week').startOf('week').format(format);
        filterEndDate = moment().tz(timezone).subtract(1, 'week').endOf('week').format(format);
        break;
      case 'this Week':
        filterStartDate = moment().tz(timezone).add(1, 'days').format(format);
        filterEndDate = moment().tz(timezone).endOf('week').format(format);
        break;
      case 'next Week':
        filterStartDate = moment().tz(timezone).add(1, 'week').startOf('week').format(format);
        filterEndDate = moment().tz(timezone).add(1, 'week').endOf('week').format(format);
        break;
      case 'month':
        filterStartDate = filterBaseStartDate.subtract(29, 'days').format(format);
        break;
      case 'this Month':
        filterStartDate = moment().tz(timezone).add(1, 'days').format(format);
        filterEndDate = moment().tz(timezone).endOf('month').format(format);
        break;
      case 'last Month':
        filterStartDate = moment().tz(timezone).subtract(1, 'month').startOf('month').format(format);
        filterEndDate = moment().tz(timezone).subtract(1, 'month').endOf('month').format(format);
        break;
      case 'year':
        filterStartDate = filterBaseStartDate.subtract(364, 'days').format(format);
        break;
      case 'this Year':
        filterStartDate = moment().tz(timezone).startOf('year').format(format);
        filterEndDate = moment().tz(timezone).subtract(1, 'days').format(format);
        break;
      case 'previous Year':
        filterStartDate = moment().tz(timezone).subtract(1, 'year').startOf('year').format(format);
        filterEndDate = moment().tz(timezone).subtract(1, 'year').endOf('year').format(format);
        break;
      default:
        return null;
    }
    return { filterStartDate, filterEndDate };
  }
  if (startDate && endDate) {
    filterStartDate = moment(startDate).hours(0).minutes(0).seconds(0).tz(timezone).utc().format(format);
    filterEndDate = moment(endDate).hours(23).minutes(59).seconds(59).tz(timezone).utc().format(format);
    return { filterStartDate, filterEndDate };
  }
  return null;
};

export default getStartEndDate;
