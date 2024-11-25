import fetchWithTimeout from '@tools/fetchWithTimeout';
import fetchWithRetries from '@tools/fetchWithRetries';

jest.mock('@tools/fetchWithRetries', () => jest.fn());

describe('fetchWithTimeout', () => {
  it('should call fetchWithRetries and return the result if it resolves within the timeout', async () => {
    const successfulResponse = { data: 'Successful response' };
    fetchWithRetries.mockResolvedValueOnce(successfulResponse);

    const request = { url: 'https://example.com' };
    const retryOptions = { retries: 3 };
    const timeout = 5000;
    const result = await fetchWithTimeout(request, retryOptions, timeout);

    expect(fetchWithRetries).toHaveBeenCalledWith(request, retryOptions);

    expect(result).toBe(successfulResponse);
  });
});
