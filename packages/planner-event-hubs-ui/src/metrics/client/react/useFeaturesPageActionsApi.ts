/**
 * ------------------------------------------------------------------------------------
 * This client was automatically generated. ** Do Not Edit **
 * ------------------------------------------------------------------------------------
 */
import { useCallback } from 'react';
import * as Rudder from '../rudder-web';
import { usePageActions } from '@cvent/sli-nextjs-metrics';
import { ApiCallback } from '@rudderstack/analytics-js';
import { useIdentityApi } from '../IdentityProvider';
import { TrackProperties } from '../commonTypes';

export type ActionDefinition = {
  id: string;
  destinations?: string[];
};

export interface ConnectionSwitchToggled extends TrackProperties {
  // Shows the status of connections feature whether it is on or off
  connectionStatus: string;
}
export interface ManageCalendarsButtonClicked extends TrackProperties {}
export interface UpcomingEventsCalendarCheckMarkClicked extends TrackProperties {
  // Name of the calendar selected to use in upcoming events page
  eventCalendarName: string;
}
export interface UpcomingEventsSetupButtonClicked extends TrackProperties {}
export interface UpcomingEventsSwitchToggled extends TrackProperties {
  // Shows the status of upcoming events feature whether it is on or off
  upcomingEventsStatus: string;
}
export interface YourEventsSwitchToggled extends TrackProperties {
  // Shows the status of your events feature whether it is on or off
  yourEventsStatus: string;
}

interface AnalyticsApi {
  connectionSwitchToggled: (props: ConnectionSwitchToggled, options?: Rudder.Options, callback?: ApiCallback) => void;
  manageCalendarsButtonClicked: (
    props?: ManageCalendarsButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  upcomingEventsCalendarCheckMarkClicked: (
    props: UpcomingEventsCalendarCheckMarkClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  upcomingEventsSetupButtonClicked: (
    props?: UpcomingEventsSetupButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  upcomingEventsSwitchToggled: (
    props: UpcomingEventsSwitchToggled,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  yourEventsSwitchToggled: (props: YourEventsSwitchToggled, options?: Rudder.Options, callback?: ApiCallback) => void;
}

/**
 * This hook exposes a typed api with functions from the application's tracking plan.
 * Internally, each function uses the usePageActions API to track actions and forward
 * them to the reporters that were installed during the Metrics initialization in your
 * application's main entry point component.
 *
 * Note: This is the recommended way of tracking/measuring actions as it allows you to
 * register base properties during the metrics' client initialization, which will be included
 * automatically to every action whenever they are executed by your instrumentation code
 *
 *
 * How to use it:
 *
 * `const { acqSignupCompleted } = useFeaturesPageActionsApi();`
 *
 *  // Somewhere in your application you can use this function to track this action
 * `acqSignupCompleted({ userId, email, accountName });`
 *
 * // If you want to track this action as an error you can do it with this piece of code below
 *  `acqSignupCompleted({ userId, email, error: '500 Error........' });`
 *
 * // If you want to track this action as an expected error you can do it with this piece of code below
 *  `acqSignupCompleted({ userId, email, expected_error: 'This email address is already associated with an existing account.' });`
 *
 * @returns AnalyticsApi
 */
export const useFeaturesPageActionsApi = (): AnalyticsApi => {
  const { trackAction, getBaseProps } = usePageActions();
  const { trackingPlanName } = getBaseProps() || {};
  const { updateProfile } = useIdentityApi();

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
  const connectionSwitchToggled = useCallback(
    (props: ConnectionSwitchToggled, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'connection switch toggled',
        ...(destinations && { destinations })
      };
      const metadata = JSON.parse('{}');
      const hasMetadata = Object.keys(metadata).length > 0;
      // Track action via the pageActions API
      trackAction(
        action,
        {
          ...props,
          ...getBaseProps(),
          version: '',
          downstreamName: 'connection switch toggled'
        },
        {
          ...options,
          trackingPlanName,
          status: 'active',
          metadata: hasMetadata ? metadata : undefined
        }
      );
      // Check if this action is passing any traits to update the user profile
      if (options?.context?.traits) {
        updateProfile(options.context.traits);
      }
    },
    [getBaseProps, trackAction, updateProfile]
  );
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
  const manageCalendarsButtonClicked = useCallback(
    (props?: ManageCalendarsButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'manage calendars button clicked',
        ...(destinations && { destinations })
      };
      const metadata = JSON.parse('{}');
      const hasMetadata = Object.keys(metadata).length > 0;
      // Track action via the pageActions API
      trackAction(
        action,
        {
          ...props,
          ...getBaseProps(),
          version: '',
          downstreamName: 'manage calendars button clicked'
        },
        {
          ...options,
          trackingPlanName,
          status: 'active',
          metadata: hasMetadata ? metadata : undefined
        }
      );
      // Check if this action is passing any traits to update the user profile
      if (options?.context?.traits) {
        updateProfile(options.context.traits);
      }
    },
    [getBaseProps, trackAction, updateProfile]
  );
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
  const upcomingEventsCalendarCheckMarkClicked = useCallback(
    (props: UpcomingEventsCalendarCheckMarkClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'upcoming events calendar check mark clicked',
        ...(destinations && { destinations })
      };
      const metadata = JSON.parse('{}');
      const hasMetadata = Object.keys(metadata).length > 0;
      // Track action via the pageActions API
      trackAction(
        action,
        {
          ...props,
          ...getBaseProps(),
          version: '',
          downstreamName: 'upcoming events calendar check mark clicked'
        },
        {
          ...options,
          trackingPlanName,
          status: 'active',
          metadata: hasMetadata ? metadata : undefined
        }
      );
      // Check if this action is passing any traits to update the user profile
      if (options?.context?.traits) {
        updateProfile(options.context.traits);
      }
    },
    [getBaseProps, trackAction, updateProfile]
  );
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
  const upcomingEventsSetupButtonClicked = useCallback(
    (props?: UpcomingEventsSetupButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'upcoming events setup button clicked',
        ...(destinations && { destinations })
      };
      const metadata = JSON.parse('{}');
      const hasMetadata = Object.keys(metadata).length > 0;
      // Track action via the pageActions API
      trackAction(
        action,
        {
          ...props,
          ...getBaseProps(),
          version: '',
          downstreamName: 'upcoming events setup button clicked'
        },
        {
          ...options,
          trackingPlanName,
          status: 'active',
          metadata: hasMetadata ? metadata : undefined
        }
      );
      // Check if this action is passing any traits to update the user profile
      if (options?.context?.traits) {
        updateProfile(options.context.traits);
      }
    },
    [getBaseProps, trackAction, updateProfile]
  );
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
  const upcomingEventsSwitchToggled = useCallback(
    (props: UpcomingEventsSwitchToggled, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'upcoming events switch toggled',
        ...(destinations && { destinations })
      };
      const metadata = JSON.parse('{}');
      const hasMetadata = Object.keys(metadata).length > 0;
      // Track action via the pageActions API
      trackAction(
        action,
        {
          ...props,
          ...getBaseProps(),
          version: '',
          downstreamName: 'upcoming events switch toggled'
        },
        {
          ...options,
          trackingPlanName,
          status: 'active',
          metadata: hasMetadata ? metadata : undefined
        }
      );
      // Check if this action is passing any traits to update the user profile
      if (options?.context?.traits) {
        updateProfile(options.context.traits);
      }
    },
    [getBaseProps, trackAction, updateProfile]
  );
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
  const yourEventsSwitchToggled = useCallback(
    (props: YourEventsSwitchToggled, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'your events switch toggled',
        ...(destinations && { destinations })
      };
      const metadata = JSON.parse('{}');
      const hasMetadata = Object.keys(metadata).length > 0;
      // Track action via the pageActions API
      trackAction(
        action,
        {
          ...props,
          ...getBaseProps(),
          version: '',
          downstreamName: 'your events switch toggled'
        },
        {
          ...options,
          trackingPlanName,
          status: 'active',
          metadata: hasMetadata ? metadata : undefined
        }
      );
      // Check if this action is passing any traits to update the user profile
      if (options?.context?.traits) {
        updateProfile(options.context.traits);
      }
    },
    [getBaseProps, trackAction, updateProfile]
  );

  return {
    connectionSwitchToggled,
    manageCalendarsButtonClicked,
    upcomingEventsCalendarCheckMarkClicked,
    upcomingEventsSetupButtonClicked,
    upcomingEventsSwitchToggled,
    yourEventsSwitchToggled
  };
};
