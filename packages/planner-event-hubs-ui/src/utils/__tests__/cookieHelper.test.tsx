import { parseCookies } from 'nookies';
import { checkConsentCookie, setConsentCookie } from '@utils/cookieHelper';
import { MAX_COOKIE_BANNER_CONSENT_ENTRIES, ACCEPT_ALL_COOKIE, ACCEPT_ESSENTIAL_COOKIE } from '@utils/constants';

describe('Cookie Helper', () => {
  it('should read an empty cookie state and return false', () => {
    const checkedCookied = checkConsentCookie('123', ACCEPT_ALL_COOKIE);
    expect(checkedCookied).toEqual(false);
  });

  it('should set and read the cookie consent for a hub', () => {
    const hubId = '123';
    setConsentCookie(hubId, ACCEPT_ESSENTIAL_COOKIE);

    const checkedCookied = checkConsentCookie('123', ACCEPT_ESSENTIAL_COOKIE);
    expect(checkedCookied).toEqual(true);
  });

  it('should clear cookie when there is a JSON parsing error', () => {
    // Set up a cookie with an invalid JSON value
    document.cookie = 'test=invalid-json-value';

    expect(checkConsentCookie('123', 'test')).toEqual(false);
    expect(parseCookies().test).toBeUndefined();
  });

  it('should handle missing cookie name', () => {
    expect(checkConsentCookie('123', '')).toEqual(false);
  });

  it('should try to set more items than max cookie banner entries', () => {
    // Fill with max number of items
    for (let i = 0; i < MAX_COOKIE_BANNER_CONSENT_ENTRIES; i++) {
      setConsentCookie(`${i}`, ACCEPT_ALL_COOKIE);
    }

    for (let i = 0; i < MAX_COOKIE_BANNER_CONSENT_ENTRIES; i++) {
      expect(checkConsentCookie(`${i}`, ACCEPT_ALL_COOKIE)).toEqual(true);
    }
    // Try to set one more
    setConsentCookie('-1', ACCEPT_ALL_COOKIE);

    // Should have pushed out oldest item
    expect(checkConsentCookie('0', ACCEPT_ALL_COOKIE)).toEqual(false);

    // Ensure new item is present
    expect(checkConsentCookie('-1', ACCEPT_ALL_COOKIE)).toEqual(true);

    const cookies = parseCookies();
    const cookieValue = cookies[ACCEPT_ALL_COOKIE];
    expect(JSON.parse(cookieValue).length).toEqual(MAX_COOKIE_BANNER_CONSENT_ENTRIES);
  });
});
