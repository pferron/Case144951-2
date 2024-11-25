export const isProduction = (): boolean =>
  process.env.ENVIRONMENT_TYPE === 'production' ||
  process.env.ENVIRONMENT_TYPE === 'integration' ||
  process.env.ENVIRONMENT_TYPE === 'production-eu';

export const setStagingForLowerEnvs = (environment: string): string => {
  if (environment.toLowerCase() === 's606') {
    return 'T2';
  }
  return environment;
};
const TEMPLATE = 'XXX';
const GENERIC_ACCOUNTS_APP_BASE_ADDRESS = 'https://accounts-alpha.core.cvent.org';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getSilo = (environment = ''): any =>
  (environment.startsWith('S') && environment.length === 4 && environment.substr(1, 3)) || '';

const isAlpha = process.env.isAlpha === 'true';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const resolveTemplateUrl = (url = '', environment = ''): any => {
  if (isAlpha && url.includes(TEMPLATE)) {
    return url.replace(TEMPLATE, getSilo(environment));
  }
  return url;
};

export { resolveTemplateUrl, GENERIC_ACCOUNTS_APP_BASE_ADDRESS };
