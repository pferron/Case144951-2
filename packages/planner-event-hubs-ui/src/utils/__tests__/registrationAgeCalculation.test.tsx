import { registrationAgeCalculation } from '@utils/registrationAgeCalculation';
import { subDays, subMonths, subYears } from 'date-fns';

describe('test for calculation of registration age', () => {
  it('calculates registration age of user registered a month ago', () => {
    const registrationDateInstance = subMonths(new Date(), 1);
    const registrationDate = registrationDateInstance.toDateString();
    expect(registrationAgeCalculation(registrationDate)).toStrictEqual({ years: 0, months: 1, days: 0 });
  });

  it('calculates registration age of user registered a year ago', () => {
    const registrationDateInstance = subYears(new Date(), 1);
    const registrationDate = registrationDateInstance.toDateString();
    expect(registrationAgeCalculation(registrationDate)).toStrictEqual({ years: 1, months: 0, days: 0 });
  });

  it('calculates registration age of user registered less than 15 days ago', () => {
    const registrationDateInstance = subDays(new Date(), 10);
    const registrationDate = registrationDateInstance.toDateString();
    expect(registrationAgeCalculation(registrationDate)).toStrictEqual({ years: 0, months: 0, days: 10 });
  });

  it('calculates registration age of user registered more than 15 days ago', () => {
    const registrationDateInstance = subDays(new Date(), 25);
    const registrationDate = registrationDateInstance.toDateString();
    expect(registrationAgeCalculation(registrationDate)).toStrictEqual({ years: 0, months: 1, days: 0 });
  });
  // Test does not account for timezones
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('calculates registration age of user registered 1 month 14 days ago', () => {
    const registrationDateInstance = subMonths(subDays(new Date(), 14), 1);
    const registrationDate = registrationDateInstance.toDateString();
    expect(registrationAgeCalculation(registrationDate)).toStrictEqual({ years: 0, months: 1, days: 0 });
  });

  it('calculates registration age of user registered 1 month 15 days ago', () => {
    const registrationDateInstance = subMonths(subDays(new Date(), 15), 1);
    const registrationDate = registrationDateInstance.toDateString();
    expect(registrationAgeCalculation(registrationDate)).toStrictEqual({ years: 0, months: 2, days: 0 });
  });

  it('calculates registration age of user registered years ago', () => {
    const registrationDateInstance = subYears(subMonths(subDays(new Date(), 3), 3), 1);
    const registrationDate = registrationDateInstance.toDateString();
    expect(registrationAgeCalculation(registrationDate)).toStrictEqual({ years: 1, months: 3, days: 0 });
  });

  it('should return 1 day if user registered today', () => {
    const registrationDate = new Date();
    registrationDate.setDate(registrationDate.getDate());
    const result = registrationAgeCalculation(registrationDate.toISOString());
    expect(result).toStrictEqual({ years: 0, months: 0, days: 1 });
  });
});
