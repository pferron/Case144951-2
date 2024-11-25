import logger from '@wdio/logger';

const Logger = logger('@wdio/jasmine-framework');
Logger.trace(process.env.BASE_URL);

const BASE_PATH = process.env.BASE_PATH || '';

const BASE_URL = process.env.BASE_URL || process.env.APP_BASE_URL || 'http://localhost:3000';

function getEnv(env: string | undefined): string | undefined {
  if (env === 'S606') {
    return 'S606';
  }
  if (env === 'sg50' || env === 'ci' || env === 'dev') {
    return 'T2';
  }
  if (env === 'pr53' || env === 'pr54') {
    return 'production-eu';
  }
  if (env === 'ct50') {
    return 'integration';
  }
  if (env === 'ld50') {
    return 'L2';
  }
  if (env === 'pr50' || env === 'pr51') {
    return 'P2';
  }
  return env;
}

// Define a type for the configuration object returned by getConfigs
type ConfigData = {
  env: string | undefined;
  isDev: boolean;
  basePath: string;
  baseUrl: string;
  testUsers: {
    localeId: number;
    accountId: string | undefined;
    userStub: string | undefined;
    plannerEmail: string | undefined;
    accountMappingId: string | undefined;
    accountStub: string | undefined;
  };
  silo: string | undefined;
  delay: {
    uiBackgroundLoad: number;
    uiBackgroundSave: number;
    apiPost: number;
    apiPut: number;
    apiDelete: number;
    cventPageLoad: number;
  };
  timeouts: {
    processing: number;
  };
  routeCookie: string;
  videoId: string;
  s3ProxyUrl: string;
  apiKeyValue?: string;
};

// Now, use this type for TestData
export function getConfigs(): ConfigData {
  return {
    env: getEnv(process.env.ENV),
    isDev: process.env.ENV === 'dev',
    basePath: BASE_PATH,
    baseUrl: BASE_URL,
    testUsers: {
      localeId: 1033,
      accountId: process.env.ACCOUNT_ID,
      userStub: process.env.USER_STUB,
      plannerEmail: process.env.PLANNER_EMAIL,
      accountMappingId: process.env.ACCOUNT_MAPPING_ID,
      accountStub: process.env.ACCOUNT_STUB
    },
    silo: getEnv(process.env.ENV),
    delay: {
      uiBackgroundLoad: 1500,
      uiBackgroundSave: 3000,
      apiPost: 3000,
      apiPut: 1500,
      apiDelete: 1500,
      cventPageLoad: 30000
    },
    timeouts: {
      processing: 30000
    },
    routeCookie: process.env.CVENT_VERSION ? ` CVENT_VERSION=${process.env.CVENT_VERSION}` : '',
    videoId:
      process.env.ENV === 'ld50' ? 'dfd0c10a-9435-4a61-9bfe-989356b04ec2' : '81b80816-efb4-4082-8c4b-ee626bbf3886',
    s3ProxyUrl: '',
    apiKeyValue: ''
  };
}

export type TestData = ConfigData;
