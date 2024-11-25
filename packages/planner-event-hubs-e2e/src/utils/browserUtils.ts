import { browserUtils, ConfigsBrowserType } from '@cvent/wdio-configs';

const { getDefaultBrowserConfig, buildMultiBrowserConfig } = browserUtils;

const browsers = [
  'localChrome',
  'headlessChrome',
  'headlessChromium',
  'jenkinsGrid',
  'zapProxy',
  'chrome',
  'firefox',
  'safari',
  'edge',
  'chrome-cloud',
  'chrome-firefox',
  'chrome-firefox-edge',
  'all'
];

/**
 * Build browsers config
 *
 * @param browser predefined browser to use, defaults to `headlessChromium`
 * @param tunnel: enabled to test local or privately hosted apps, see https://www.lambdatest.com/support/docs/testing-locally-hosted-pages/
 */
export const getBrowserConfig = ({
  browser = 'headlessChromium',
  tunnel = true
}: {
  browser: string | undefined;
  tunnel?: boolean;
}): Partial<WebdriverIO.Config> => {
  if (!browsers.includes(browser)) {
    throw new Error(`${browser} must be one of [${browsers}]`);
  }

  // options can be customized and will be added to the generated capabilities below
  const options = {
    'LT:Options': {
      tunnel
    }
  };

  // additional cases can be added below to run custom configurations locally or through jenkins
  // or a default case provided by getDefaultBrowserConfig
  switch (browser) {
    case 'chrome-cloud':
      return buildMultiBrowserConfig(['chrome'], options);
    case 'chrome-firefox':
      return buildMultiBrowserConfig(['chrome', 'firefox'], options);
    case 'chrome-firefox-ie':
      return buildMultiBrowserConfig(['chrome', 'firefox', 'ie'], options);
    case 'chrome-firefox-edge':
      return buildMultiBrowserConfig(['chrome', 'firefox', 'edge'], options);
    case 'all':
      return buildMultiBrowserConfig(['chrome', 'firefox', 'safari', 'edge', 'ie'], options);
    case 'jenkinsGrid':
      return getDefaultBrowserConfig(browser, {
        port: 4444,
        maxInstances: 10
      });
    default:
      return getDefaultBrowserConfig(browser as ConfigsBrowserType, options);
  }
};
