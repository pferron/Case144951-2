import { millisecondsToHHMMSS } from '@utils/millisecondsTOHHMMSS';

describe('Test milli seconds to HHMMSS conversion', () => {
  it('seconds should retain only upto 2 digits', () => {
    expect(millisecondsToHHMMSS(65000)).toBe('0:01:05');
  });
  it('minutes should retain only upto 2 digits', () => {
    expect(millisecondsToHHMMSS(65 * 60 * 1000)).toBe('1:05:00');
  });
  it('test for more than 24 hours', () => {
    expect(millisecondsToHHMMSS(25 * 60 * 60 * 1000)).toBe('25:00:00');
  });
  it('should get hours and minutes properly', () => {
    expect(millisecondsToHHMMSS(25 * 60 * 60 * 1000 + 65 * 60 * 1000)).toBe('26:05:00');
  });
  it('should get 3 digit hours', () => {
    expect(millisecondsToHHMMSS(100 * 60 * 60 * 1000)).toBe('100:00:00');
  });

  it('test for negative input', () => {
    expect(millisecondsToHHMMSS(-100)).toBe('0:00:00');
  });

  it('test for 0 input', () => {
    expect(millisecondsToHHMMSS(0)).toBe('0:00:00');
  });
});
