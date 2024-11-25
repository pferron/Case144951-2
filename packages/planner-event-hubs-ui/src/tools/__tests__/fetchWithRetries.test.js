import fetchWithRetries from '@tools/fetchWithRetries';
// RED
// eslint-disable-next-line no-restricted-imports
import { fetchAndRetryIfServerBusy } from '@cvent/nucleus-networking';

jest.mock('@cvent/nucleus-networking');

describe('fetchWithRetries', () => {
  it('should call fetchAndRetryIfServerBusy when retries are enabled', () => {
    process.env.RETRIES_ENABLED = 'true';
    const request = 'https://example.com';
    const retryOptions = {
      retryStatuses: [429, 502],
      initialDelay: 500,
      maxDelay: 2000
    };

    const mockFetchAndRetryIfServerBusy = jest
      .fn()
      .mockResolvedValue('Response');
    fetchAndRetryIfServerBusy.mockImplementation(mockFetchAndRetryIfServerBusy);

    fetchWithRetries(request, retryOptions);

    expect(mockFetchAndRetryIfServerBusy).toHaveBeenCalledWith(
      request,
      retryOptions
    );
  });

  it('should call fetch without retries when retries are disabled', () => {
    process.env.RETRIES_ENABLED = 'false';
    const request = 'https://example.com';

    const mockFetch = jest.fn();
    global.fetch = mockFetch;

    fetchWithRetries(request);

    expect(mockFetch).toHaveBeenCalledWith(request);
  });
});
