import matches from 'validator/lib/matches';

/**
 * appends https protocol to a valid URL if no protocol is present
 */
export const sanitizeUrl = (url: string): string => {
  if (!matches(url, 'https?:\\/\\/')) {
    return `https://${url}`;
  }
  return url;
};
