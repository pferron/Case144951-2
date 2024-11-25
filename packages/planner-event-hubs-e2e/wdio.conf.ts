import * as cventWdio from '@cvent/wdio-configs';
import { loadConfig } from '@cvent/app-config/loadConfig';
import currentGitBranch from 'current-git-branch';
import { Options } from '@wdio/types';
import { getBrowserConfig } from './src/utils/browserUtils';
import { writeAppFeatures } from './src/apis/services/appFeaturesClient';
import { params } from './configs/params';

/* eslint-disable global-require */
const { VERBOSE_LOGS } = process.env;
const appName = 'planner-event-hubs';

// Test execution in Octo
if (process.env.ENDPOINT) {
  process.env.BASE_URL = `https://${process.env.ENDPOINT}`;
  process.env.ENV = process.env.IT_ENVIRONMENT;
}

// Run example tests using Jasmine with this config file
// All the configurations given in the array below will be deep merged
// More pre-written configurations are available in the `@cvent/wdio-configs` package
export const config: Options.Testrunner = {
  ...cventWdio.mergeWdioConfigs([
    cventWdio.base,

    // except for local Chrome variants, most browsers are set up via BrowserStack (https://www.browserstack.com/automate/webdriverio)
    // configure the cookie server
    getBrowserConfig({
      browser: process.env.BROWSER || cventWdio.browserUtils.headlessChrome
    }) /* eslint-disable-next-line */, // using the applitools service - https://webdriver.io/docs/applitools-service.html
    cventWdio.cookieService({
      runAfterEachTest: false,
      runAfterCommand: false,
      totalCookieSizeLimit: 10000
    }),
    cventWdio.overwriteClickAndValueCommands({ runExpects: false, doNotOverwriteCommands: false }),
    cventWdio.eyes({
      // disable Applitools cloud service by default, comment out or set to false to enable
      appName,
      branchName: process.env.BRANCH || currentGitBranch(),
      disabled: false,
      useVisualGrid: true,
      viewportSize: { width: 1100, height: 700 },
      baselineBranchName: 'main',
      parentBranchName: 'main',
      compareWithParentBranch: true,
      throwErrorIfNotAsExpected: true,
      apiKey: 'op7wtdbOQy49QBXaTwB00H104vnrXSFU0gfVmUHtMEWek110'
      //
      // add Applitools apiKey as eyes(<apiKey>) parameter to change teams, defaults to Cvent team
      // apiKey: '<add-your-own-applitools-apiKey-to-use-non-Cvent-default>',
      //
      // adding browsersInfo property array turns on Applitools Visual Grid feature
      // specify name: and optionally width and/or height
      // https://applitools.com/docs/api/eyes-sdk/enums-gen/enum-global-browsertype-webdriverio_sdk5-javascript.html
      // current limitation of using Visual Grid: when Visual Grid diffs fail it will not fail the Jasmine test
      // browsersInfo: [{ name: 'IE11' }, { name: 'chrome-one-version-back' }]
    }),
    cventWdio.axeService({
      isDisabled: false,
      runAfterCommand: false,
      runAfterEachTest: false,
      configs: 'default'
    }),
    cventWdio.jasmineOpts(240000, 15000, 0),
    cventWdio.qePortal({
      appName,
      region: process.env.ENV,
      executionType: ['sg50', 'ld50', 'pr50', 'pr53', undefined].includes(process.env.ENV)
        ? 'scheduled'
        : process.env.EXECUTION,
      branch: process.env.BRANCH || currentGitBranch(),
      sprintTeam: 'Red',
      screenshotDir: './dist'
    }),
    cventWdio.logLevels(VERBOSE_LOGS === 'true' ? 'trace' : 'info', {
      webdriver: VERBOSE_LOGS === 'true' ? 'debug' : 'warn',
      devtools: VERBOSE_LOGS === 'true' ? 'debug' : 'warn',
      '@wdio/applitools-service': 'info',
      'wdio-qeportal-service': 'debug',
      '@cvent/wdio-configs': 'debug',
      '@wdio/jasmine-framework': 'debug',
      '@wdio/qeportal-service': 'info'
    }), // add additional objects as well which will be deepmerged with those above
    {
      // Set a base URL in order to shorten url command calls. If your `url` parameter starts
      // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
      // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
      // gets prepended directly.
      baseUrl: process.env.BASE_URL,

      //
      // Named Jasmine suite specified here
      suites: {
        banner: [
          // #oss-red-devs
          './src/specs/banner/*.spec.ts'
        ],
        channel: [
          // #tech-fireball-monitor-alerts
          './src/specs/channel/*.spec.ts'
        ],
        features: [
          // #tech-attendee-hub-mauve-alerts
          './src/specs/features/*.spec.ts'
        ],
        manageStorage: [
          // #tech-fireball-monitor-alerts
          './src/specs/manageStorage/*.spec.ts'
        ],
        memberProfile: [
          // #tech-attendee-hub-mauve-alerts
          './src/specs/memberProfile/*.spec.ts'
        ],
        privacy: [
          // #tech-attendee-hub-mauve-alerts
          './src/specs/privacy/*.spec.ts'
        ],
        customRegistration: [
          // #tech-attendee-hub-mauve-alerts
          './src/specs/customRegistration/*.spec.ts'
        ],
        customHomePage: [
          // #oss-red-devs
          './src/specs/homepageCustomization/*.spec.ts'
        ],
        registrationSettings: [
          // #tech-attendee-hub-mauve-alerts
          './src/specs/registrationSettings/*.spec.ts'
        ],
        videocenter: [
          // #oss-red-devs
          './src/specs/videocenter/*.spec.ts'
        ],
        theming: [
          // #oss-red-devs
          './src/specs/theming/*.spec.ts'
        ],
        trackingCodes: [
          // #tech-attendee-hub-mauve-alerts
          './src/specs/trackingCodes/*.spec.ts'
        ],
        urlTrackingParameters: [
          // #tech-attendee-hub-mauve-alerts
          './src/specs/trackingCodes/urlTrackingParameters/*.spec.ts'
        ],
        upcomingEvents: [
          // #oss-red-devs
          './src/specs/upcomingEvents/*.spec.ts'
        ],
        branding: [
          // #oss-red-devs
          './src/specs/branding/*.spec.ts'
        ],
        languageManagement: [
          // #oss-red-devs
          './src/specs/languageManagement/*.spec.ts'
        ],
        media: [
          // #oss-red-devs
          './src/specs/media/*.spec.ts'
        ],
        pvt: [
          // #tech-events-plus-project
          './src/specs/banner/*.spec.ts',
          './src/specs/channel/*.spec.ts',
          './src/specs/features/*.spec.ts',
          './src/specs/memberProfile/*.spec.ts',
          './src/specs/navigation/*.spec.ts',
          './src/specs/privacy/*.spec.ts',
          './src/specs/customRegistration/*.spec.ts',
          './src/specs/upcomingEvents/*.spec.ts',
          './src/specs/videocenter/createDeleteVideoCenter.spec.ts',
          './src/specs/registrationSettings/*.spec.ts',
          './src/specs/trackingCodes/*.spec.ts'
        ]
      },

      specs: ['./src/specs/**/*.spec.ts'],

      before(): void {
        // setting browser window size to 'l'
        browser.setWindowSize(1440, 1065);
      },

      onPrepare: async () => {
        await loadConfig({ hoganBranch: process.env.HOGAN_CONFIGS_BRANCH });
        return writeAppFeatures();
      }
    },
    cventWdio.jasmineOpts(600000, 15000, 0),
    cventWdio.overwriteClickAndValueCommands({
      runExpects: false,
      doNotOverwriteCommands: false
    }),
    cventWdio.logLevels(process.env.LOG_LEVEL || 'info'),
    {
      maxInstances: params.maxInstances
    }
  ])
};
