/**
 * This client was automatically generated. ** Do Not Edit **
 */

import { ApiCallback } from '@rudderstack/analytics-js';
import * as Rudder from '../rudder-web';
import { RudderAnalyticsProperties } from '../commonTypes';

const setRudderTyperOptions = Rudder.setRudderTyperOptions;
const withRudderTyperContext = Rudder.withRudderTyperContext;
interface WithBaseProperties extends RudderAnalyticsProperties {}

export interface ConnectionSwitchToggled extends WithBaseProperties {
  // Shows the status of connections feature whether it is on or off
  connectionStatus: string;
}
export interface ManageCalendarsButtonClicked extends WithBaseProperties {}
export interface UpcomingEventsCalendarCheckMarkClicked extends WithBaseProperties {
  // Name of the calendar selected to use in upcoming events page
  eventCalendarName: string;
}
export interface UpcomingEventsSetupButtonClicked extends WithBaseProperties {}
export interface UpcomingEventsSwitchToggled extends WithBaseProperties {
  // Shows the status of upcoming events feature whether it is on or off
  upcomingEventsStatus: string;
}
export interface YourEventsSwitchToggled extends WithBaseProperties {
  // Shows the status of your events feature whether it is on or off
  yourEventsStatus: string;
}

// Track Calls
export function connectionSwitchToggled(
  props: ConnectionSwitchToggled,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'connection switch toggled',
      { ...props, version: '', downstreamName: 'connection switch toggled' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function manageCalendarsButtonClicked(
  props?: ManageCalendarsButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'manage calendars button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'manage calendars button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function upcomingEventsCalendarCheckMarkClicked(
  props: UpcomingEventsCalendarCheckMarkClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'upcoming events calendar check mark clicked',
      {
        ...props,
        version: '',
        downstreamName: 'upcoming events calendar check mark clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function upcomingEventsSetupButtonClicked(
  props?: UpcomingEventsSetupButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'upcoming events setup button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'upcoming events setup button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function upcomingEventsSwitchToggled(
  props: UpcomingEventsSwitchToggled,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'upcoming events switch toggled',
      {
        ...props,
        version: '',
        downstreamName: 'upcoming events switch toggled'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function yourEventsSwitchToggled(
  props: YourEventsSwitchToggled,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'your events switch toggled',
      { ...props, version: '', downstreamName: 'your events switch toggled' },
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
   * this action tracks the users who toggles connections feature in order to turn it on or off
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : connection switch toggled
   * downstreamName: connection switch toggled
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on switch button on 'connections' feature card in Events+ Hub feature page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {ConnectionSwitchToggled} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  connectionSwitchToggled,
  /**
   * this action tracks the users who clicks on manage calendar button in order to make changes to calendar
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : manage calendars button clicked
   * downstreamName: manage calendars button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on 'Manage calendars' button on the 'Calendars' card in upcoming events feature section
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {ManageCalendarsButtonClicked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  manageCalendarsButtonClicked,
  /**
   * this action tracks the users who selects a calendar in order to use in upcoming events page
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : upcoming events calendar check mark clicked
   * downstreamName: upcoming events calendar check mark clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on check mark in the edit state of 'Upcoming Events' card in the upcoming events
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {UpcomingEventsCalendarCheckMarkClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  upcomingEventsCalendarCheckMarkClicked,
  /**
   * this action tracks the users who clicks on setup button in order to setup upcoming events calendar
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : upcoming events setup button clicked
   * downstreamName: upcoming events setup button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on 'Setup' button on 'Upcoming Events' feature card on the Events+ hub feature page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {UpcomingEventsSetupButtonClicked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  upcomingEventsSetupButtonClicked,
  /**
   * this action tracks the users who toggles upcoming events feature in order to turn it on or off
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : upcoming events switch toggled
   * downstreamName: upcoming events switch toggled
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on switch button on 'upcoming events' feature card in Events+ Hub feature page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {UpcomingEventsSwitchToggled} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  upcomingEventsSwitchToggled,
  /**
   * this action tracks the users who toggles your events feature in order to turn it on or off
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : your events switch toggled
   * downstreamName: your events switch toggled
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on switch button on 'Your events' feature card in Events+ Hub feature page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {YourEventsSwitchToggled} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  yourEventsSwitchToggled
};

const featuresAnalyticsClient = new Proxy<typeof clientAPI>(clientAPI, {
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

export default featuresAnalyticsClient;
