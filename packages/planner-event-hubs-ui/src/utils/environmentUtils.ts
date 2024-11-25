const TEMPLATE = 'XXX';
const GENERIC_ACCOUNTS_APP_BASE_ADDRESS = 'https://accounts-alpha.core.cvent.org';

// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const getSilo = (environment = ''): any => {
  return (environment.startsWith('S') && environment.length === 4 && environment.substr(1, 3)) || '';
};

const isAlpha = process.env.isAlpha === 'true';

// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const resolveTemplateUrl = (url = '', environment = ''): any => {
  if (isAlpha && url.includes(TEMPLATE)) {
    return url.replace(TEMPLATE, getSilo(environment));
  }
  return url;
};

export { resolveTemplateUrl, GENERIC_ACCOUNTS_APP_BASE_ADDRESS };
