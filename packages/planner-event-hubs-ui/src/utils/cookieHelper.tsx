import { destroyCookie, parseCookies, setCookie } from 'nookies';
import { MAX_COOKIE_BANNER_CONSENT_ENTRIES } from '@utils/constants';

const cookieOptions = {
  maxAge: 60 * 60 * 24 * 365 // 1 year in seconds
};

export function checkConsentCookie(hubId: string, cookie: string): boolean {
  const cookies = parseCookies();
  try {
    const cookieValue = cookies[cookie];
    const acceptedHubIds = cookieValue ? JSON.parse(cookieValue) : [];
    return acceptedHubIds.some(id => id === hubId);
  } catch (jsonParseError) {
    // Error parsing cookie value, clear it to be safe
    destroyCookie(null, cookie);
    return false;
  }
}

export function setConsentCookie(hubId: string, cookie: string): void {
  const cookies = parseCookies();
  const cookieValue = cookies[cookie];
  let acceptedHubIds;
  try {
    acceptedHubIds = cookieValue ? JSON.parse(cookieValue) : [];
  } catch (jsonParseError) {
    // Error parsing cookie value, clear it to be safe
    destroyCookie(null, cookie);
    acceptedHubIds = [];
  }

  // Add hubId to start of list
  acceptedHubIds.unshift(hubId);

  // When running up against max entries, ditch last one(s)
  if (acceptedHubIds.length > MAX_COOKIE_BANNER_CONSENT_ENTRIES) {
    acceptedHubIds = acceptedHubIds.slice(0, MAX_COOKIE_BANNER_CONSENT_ENTRIES);
  }

  setCookie(null, cookie, JSON.stringify(acceptedHubIds), cookieOptions);
}
