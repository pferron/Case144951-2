import { urlSafeRandomString } from '../random';

describe('generate random strings', () => {
  it('generates a random string of a given length', () => {
    const value = urlSafeRandomString(16);
    expect(value).toHaveLength(16);
    const longValue = urlSafeRandomString(32);
    expect(longValue).toHaveLength(32);
    const shortValue = urlSafeRandomString(1);
    expect(shortValue).toHaveLength(1);
  });

  it('generates a random string when no length is provided', () => {
    const value = urlSafeRandomString();
    expect(value).toBeTruthy();
    expect(value.length).toBeGreaterThan(0);
  });

  it('throws an error when size parameter is zero', () => {
    expect(() => urlSafeRandomString(0)).toThrow();
  });

  it('throws an error when size parameter is negative', () => {
    expect(() => urlSafeRandomString(-15)).toThrow();
  });
});
