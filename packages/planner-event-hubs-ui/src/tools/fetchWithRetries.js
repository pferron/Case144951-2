// RED
// eslint-disable-next-line no-restricted-imports
import { fetchAndRetryIfServerBusy } from '@cvent/nucleus-networking';

const DEFAULT_RETRY_STATUSES = [429, 502, 503, 504];

const DEFAULT_RETRY_OPTIONS = {
  retryStatuses: DEFAULT_RETRY_STATUSES,
  initialDelay: 500,
  maxDelay: 2000
};

const fetchWithRetries = (request, retryOptions = DEFAULT_RETRY_OPTIONS) => {
  if (process.env.RETRIES_ENABLED !== 'true') {
    return fetch(request);
  }
  return fetchAndRetryIfServerBusy(request, retryOptions);
};

export default fetchWithRetries;
