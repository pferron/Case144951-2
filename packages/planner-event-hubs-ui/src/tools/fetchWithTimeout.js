import fetchWithRetries from './fetchWithRetries';

const fetchWithTimeout = (request, retryOptions, timeout = 25000) => {
  return Promise.race([
    fetchWithRetries(request, retryOptions),
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Attendee Hub Request timed out after ${timeout}ms`));
      }, timeout);
    })
  ]);
};

export default fetchWithTimeout;
