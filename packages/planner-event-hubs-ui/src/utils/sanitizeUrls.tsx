import matches from 'validator/lib/matches';

export const sanitizeUrl = (value: string): string => {
  if (value && value !== '' && !matches(value, 'https?:\\/\\/')) {
    return `https://${value}`;
  }
  return value;
};

/**
 * appends https protocol to a valid URL if no protocol is present
 */
export const sanitizeUrls = (values: Links): Links => {
  const sanitizedUrls = {};
  for (const [key, value] of Object.entries(values)) {
    sanitizedUrls[key] = sanitizeUrl(value);
  }
  return sanitizedUrls;
};

export const stripProtocol = (url: string): string => {
  if (url && url !== '' && matches(url, 'https?:\\/\\/')) {
    return url.replace(/^https?:\/\//, '');
  }
  return url;
};

/**
 * If present strip off protocol (https/http) from the url
 * @param links
 */
export const stripProtocolFromLinks = (links: Links): Links => {
  const urls = {};
  for (const [key, value] of Object.entries(links)) {
    urls[key] = stripProtocol(value);
  }
  return urls;
};

interface Links {
  facebookUrl?: string;
  twitterUrl?: string;
  linkedInUrl?: string;
}
