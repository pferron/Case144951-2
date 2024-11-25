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

export interface BrandingSaveButtonClicked extends TrackProperties {
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
export interface LogoImageChecked extends TrackProperties {}

interface AnalyticsApi {
  brandingSaveButtonClicked: (
    props: BrandingSaveButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  logoImageChecked: (props?: LogoImageChecked, options?: Rudder.Options, callback?: ApiCallback) => void;
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
 * `const { acqSignupCompleted } = useBrandingPageActionsApi();`
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
export const useBrandingPageActionsApi = (): AnalyticsApi => {
  const { trackAction, getBaseProps } = usePageActions();
  const { trackingPlanName } = getBaseProps() || {};
  const { updateProfile } = useIdentityApi();

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
  const brandingSaveButtonClicked = useCallback(
    (props: BrandingSaveButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'branding save button clicked',
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
          downstreamName: 'branding save button clicked'
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
  const logoImageChecked = useCallback(
    (props?: LogoImageChecked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'logo image checked',
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
          downstreamName: 'logo image checked'
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
    brandingSaveButtonClicked,
    logoImageChecked
  };
};
