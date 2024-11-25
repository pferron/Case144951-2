import { intervalToDuration } from 'date-fns';
import { RegistrationAge } from '@cvent/planner-event-hubs-model/types';

export const registrationAgeCalculation = (registrationDate: string): RegistrationAge => {
  const currentDateInstance = new Date();
  const registrationDateInstance = new Date(registrationDate);

  const duration = intervalToDuration({ start: registrationDateInstance, end: currentDateInstance });
  let months;
  let days;
  if (duration.years === 0 && duration.months === 0 && duration.days < 15) {
    months = 0;
    days = duration.days === 0 ? 1 : duration.days;
  } else {
    months = duration.days >= 15 ? duration.months + 1 : duration.months;
    days = 0;
  }

  return {
    years: duration.years,
    months,
    days
  };
};
