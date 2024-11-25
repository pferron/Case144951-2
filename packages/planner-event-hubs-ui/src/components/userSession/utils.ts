// RED
/* eslint-disable @typescript-eslint/no-explicit-any */
const env = process.env.NODE_ENV;

const shouldHandleNormandySession = (normandyEndpoint: string): boolean => normandyEndpoint && env !== 'test';

// Check if we support localStorage and fallback to sessionStorage if not
let _storage = {
  getItem: () => null,
  setItem: () => null,
  removeItem: () => null
} as any;
if (typeof window !== 'undefined') {
  _storage = sessionStorage;
  try {
    localStorage.setItem('hasLocalStorageSpace', 1 as any);
    localStorage.removeItem('hasLocalStorageSpace');
    _storage = localStorage;
  } catch (e) {
    // no-op
  }
}

const storage = _storage;
const headers = { 'Content-Type': 'application/json' };

const redirectToLogin = (normandyEndpoint): void => {
  // Set the param to notify the user on the Normandy login that they've been signed out due to inactivity
  const timeoutDate = storage.getItem('timeoutDate');
  let timedOut: any = false;
  if (timeoutDate && new Date().getTime() <= timeoutDate) timedOut = 'tuoe=mit';

  const redirectUrl = `${normandyEndpoint}/subscribers/login.aspx?returnUrl=`;
  let returnUrl = window.location.href;
  // Normandy wants to see the tuoe param at the end of the returnUrl 🤷‍♂️
  if (timedOut) returnUrl += `${returnUrl.match(/\?/) ? '&' : '?'}${timedOut}`;
  const encodedUrl = encodeURIComponent(returnUrl);
  (window as any).location = redirectUrl + encodedUrl;
};

const logOut = (normandyEndpoint): void => {
  const redirectUrl = `${normandyEndpoint}/subscribers/logout.aspx`;
  (window as any).location = redirectUrl;
};

// Make a keep alive request and return the parsed response
const makeKeepAliveRequest = async (normandyEndpoint): Promise<any> => {
  if (typeof window === 'undefined' || !shouldHandleNormandySession(normandyEndpoint)) return;

  const response = await fetch(`${normandyEndpoint}/Subscribers/WS/SessionAlive.asmx/KeepSessionAlive`, {
    method: 'POST',
    headers,
    credentials: 'include'
  });

  if (!response.json) throw new Error('Service endpoint returned an unusable response');

  const auth = await response.json();

  if (!auth.d) redirectToLogin(normandyEndpoint);
  // eslint-disable-next-line
  return auth.d;
};

export { redirectToLogin, logOut, shouldHandleNormandySession, makeKeepAliveRequest, storage };
