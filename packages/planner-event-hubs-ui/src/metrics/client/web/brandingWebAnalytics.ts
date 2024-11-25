/**
 * This client was automatically generated. ** Do Not Edit **
 */

import { ApiCallback } from '@rudderstack/analytics-js';
import * as Rudder from '../rudder-web';
import { RudderAnalyticsProperties } from '../commonTypes';

const setRudderTyperOptions = Rudder.setRudderTyperOptions;
const withRudderTyperContext = Rudder.withRudderTyperContext;
interface WithBaseProperties extends RudderAnalyticsProperties {}

export interface BrandingSaveButtonClicked extends WithBaseProperties {
  // Primary color of the events+ hub
  primaryColor: string;
  // Secondary color color of the events+ hub
  secondaryColor: string;
  // BackgroundColor color color of the events+ hub
  backgroundColor: string;
  // Mood of the events+ hub
  selectYourMood: string;
  // Whether safemode is turned on or off for the events+ hub
  safeColorMode: boolean;
  // Whether background color is overriden for the events+ hub
  overrideBackgroundColor?: boolean;
}
export interface LogoImageChecked extends WithBaseProperties {}

// Track Calls
export function brandingSaveButtonClicked(
  props: BrandingSaveButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'branding save button clicked',
      { ...props, version: '', downstreamName: 'branding save button clicked' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function logoImageChecked(props?: LogoImageChecked, options?: Rudder.Options, callback?: ApiCallback): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'logo image checked',
      { ...props, version: '', downstreamName: 'logo image checked' },
      withRudderTyperContext(options),
      callback
    );
  }
}

const clientAPI = {
  /**
   * Updates the run-time configuration of this RudderTyper client.
   *
   * @param {RudderTyperOptions} options - the options to upsert
   *
   * @typedef {Object} RudderTyperOptions
   * @property {Rudder.AnalyticsJS} [analytics] - Underlying analytics instance where analytics
   * 		calls are forwarded on to. Defaults to window.analytics.
   * @property {Function} [onViolation] - Handler fired when if an event does not match its spec. This handler does not fire in
   * 		production mode, because it requires inlining the full JSON Schema spec for each event in your Tracking Plan. By default,
   * 		it will throw errors if NODE_ENV="test" so that tests will fail if a message does not match the spec. Otherwise, errors
   * 		will be logged to stderr.
   */
  setRudderTyperOptions,
  /**
   * this action tracks the users who makes changes in themes in order to change the colors of branding
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : branding save button clicked
   * downstreamName: branding save button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when clicks on save button in brandind edit page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {BrandingSaveButtonClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  brandingSaveButtonClicked,
  /**
   * this action tracks the users who saves the image in order to use as logo in events+
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : logo image checked
   * downstreamName: logo image checked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on check mark button in edit state of website image section in branding section
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {LogoImageChecked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  logoImageChecked
};

const brandingAnalyticsClient = new Proxy<typeof clientAPI>(clientAPI, {
  get(target, method) {
    if (typeof method === 'string' && target.hasOwnProperty(method)) {
      return target[method as keyof typeof clientAPI];
    }

    return () => {
      console.warn(`⚠️  You made an analytics call (${String(method)}) that can't be found. Either:
    a) Re-generate your ruddertyper client: \`npx rudder-typer\`
    b) Add it to your Tracking Plan: https://app.rudderstack.com/trackingPlans/TBD`);
      const a = Rudder.getAnalyticsInstance();
      if (a) {
        a.track(
          'Unknown Analytics Call Fired',
          {
            method
          },
          withRudderTyperContext()
        );
      }
    };
  }
});

export default brandingAnalyticsClient;
