import { getEnvironment } from '@resolvers/common/utils/authMetadataUtils';

/**
 * This method is for fixing staging URL inconsistencies for attendee-experience depending on the environment.
 * Ex. The S606 attendee-experience should have https://web-S606.cvent.com, but sg50/T2 should have
 * https://web-staging.cvent.com.
 * @param auth The authorization of the client, used to determine the environment
 * @param url The URL that is being modified
 */
const replaceEnvironment = (auth, url: string): string => {
  const env = getEnvironment(auth) ?? process.env.enviromentName;
  if (env === 'sg50' || env === 'T2') {
    return url.replace('{env}', 'staging');
  }
  return url.replace('{env}', env);
};

export { replaceEnvironment };
