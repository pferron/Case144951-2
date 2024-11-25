import getLogger from '@wdio/logger';

const log = getLogger('params.ts');
const DEFAULT_MAX_INSTANCES = 10;
const DEFAULT_TIMEOUT = 60000;
const DEFAULT_ELEMENT_TIMEOUT = 10000;
const BROWSER_CHOICES = ['headlessChrome', 'chrome', 'zapBrowser', 'localChrome'];

/**
 * Helper to convert environment variables to ensure they are part of a defined set of choices
 * @param {String} name The environment variable name
 * @param {Array} choiceArray The array that has the defined set of choice
 * @param {String} defaultValue Default value in case nothing is provided, or an invalid choice is provided.
 * @returns String value
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const parseChoiceParam = (name, choiceArray, defaultValue) => {
  log.trace(`
    Start: parseChoiceParam() with params ${name}, ${choiceArray}, ${defaultValue}`);
  const param = process.env[name];
  if (param === undefined) return defaultValue;
  if (!choiceArray.includes(param)) {
    log.error(
      `${name} param was passed with invalid choice '${param}'. Defaulting to '${defaultValue}'. Valid choices are: ${choiceArray.join(
        ', '
      )}`
    );
    log.trace(`End: parseChoiceParam() returning ${defaultValue}`);
    return defaultValue;
  }
  log.trace(`End: parseChoiceParam() returning ${param}`);
  return param;
};

/**
 * Helper to convert environment variables to booleans where booleans are expected
 * @param {String} name The environment variable name
 * @param {Boolean} defaultValue Default value in case nothing is provided.
 * @returns Parameter value or default as boolean
 */
const parseBoolParam = (name: string, defaultValue: boolean): boolean => {
  log.trace(`Start: parseBoolParam() with params ${name}, ${defaultValue}`);
  const param = process.env[name];
  if (typeof param === 'string') {
    log.debug(`${name} param was passed as string with value ${param}. Converting to boolean`);
    log.trace(`End: parseBoolParam() returning ${param}`);
    return param === 'true';
  }
  log.trace(`End: parseBoolParam() returning ${defaultValue}`);
  return defaultValue;
};

/**
 * Helper to convert environment variables to numbers where numbers are expected
 * @param {String} name The environment variable name
 * @param {Number} defaultValue Default number value in case nothing is provided.
 * @returns Parameter value or default as number
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const parseNumberParam = (name, defaultValue) => {
  log.trace(`Start: parseNumberParam() with params ${name}, ${defaultValue}`);
  const param = process.env[name];
  if (typeof param === 'string') {
    log.debug(`${name} param was passed as string with value ${param}. Attempting to parse it to an integer`);
    const returnValue = parseInt(param, DEFAULT_MAX_INSTANCES);
    log.trace(`End: parseNumberParam() returning ${returnValue}`);
    return returnValue;
  }
  log.trace(`End: parseNumberParam() returning ${defaultValue}`);
  return defaultValue;
};

// List sorted alphabetically
export const params = {
  browser: parseChoiceParam('BROWSER', BROWSER_CHOICES, 'headlessChrome'),
  branch: process.env.BRANCH,
  env: process.env.ENV,
  elementTimeout: parseNumberParam('ELEMENT_TIMEOUT', DEFAULT_ELEMENT_TIMEOUT),
  retry: parseBoolParam('RETRY', true) ? 1 : 0,
  execution: process.env.EXECUTION,
  timeout: parseNumberParam('TIMEOUT', DEFAULT_TIMEOUT),
  maxInstances: parseNumberParam('MAX_INSTANCES', DEFAULT_MAX_INSTANCES)
};
