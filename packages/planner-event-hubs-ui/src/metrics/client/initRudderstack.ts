/**
 * ------------------------------------------------------------------------------------
 * This client was automatically generated. ** Do Not Edit **
 * ------------------------------------------------------------------------------------
 */

import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const getWindow = (): any => window as any;
let RUDDER_STACK_LOADED = false;
const LOG = LoggerFactory.create('RudderStackLogger');

/**
 * Gets the latest RS SDK v3.0 as of Sept 25th 2023.
 * RS Docs: https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/v3/
 *
 * TLDR;
 *  - Smaller SDK
 *  - Improves cookie storage
 *  - Ability to choose the required SDK features via plugins
 *  - Lightweight storage data by switching to base64 encryption
 *
 * @param config
 * @param writeKey
 * @param dataPlaneUrl
 * @returns
 */
export const initRudderStack = async ({
  metricsEnabled,
  writeKey,
  dataPlaneUrl,
  config = {},
  environmentName,
  onLoaded = (instance: any) => instance
}) => {
  if (typeof window === 'undefined') return;

  try {
    if (!RUDDER_STACK_LOADED) {
      if (metricsEnabled && writeKey && dataPlaneUrl) {
        const logLevel = environmentName === 'dev' ? 'DEBUG' : null;
        const loadConfig = { ...config, logLevel };
        const { RudderAnalytics } = require('@rudderstack/analytics-js/bundled');
        const rudderanalytics = new RudderAnalytics();
        // Load options docs: https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/load-js-sdk/#loading-options
        rudderanalytics.load(writeKey, dataPlaneUrl, {
          integrations: { All: true },
          /**
           * Plugins docs:
           * v3.0     => https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/v3/#load-options
           * previous => https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/v3/#plugins
           */
          plugins: ['BeaconQueue', 'StorageEncryption', 'StorageMigrator', 'XhrQueue'],
          storage: {
            encryption: {
              // Switch over to base64 encryption
              version: 'v3'
            },
            /**
             * We are not implementing groupTraits so we specify their type to none so the Rudderstack SDK deletes them from the user's device
             * Storage docs: https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/v3/cookieless-tracking/#set-storage-for-specific-information-type
             */
            entries: {
              groupId: {
                type: 'none'
              },
              groupTraits: {
                type: 'none'
              }
            },
            migrate: true
          },
          // Allow consumers to provide their own configuration and override the defaults
          ...loadConfig
        });
        getWindow().rudderanalytics = rudderanalytics;
        rudderanalytics.ready(() => {
          onLoaded(rudderanalytics);
        });
        RUDDER_STACK_LOADED = true;
      } else {
        const params = JSON.stringify({
          metricsEnabled,
          writeKey,
          dataPlaneUrl
        });
        LOG.debug(`Failed initializing rudderstack instance >>>> ${params}`);
      }
    }
  } catch (error) {
    LOG.debug(
      'Failed importing the rudderstack SDK. Make sure you have it as a dependency in your package.json',
      error
    );
  }
};
