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

export interface CreateEventsplusHubButtonClicked extends TrackProperties {
  // Name of the events+ hub created
  hubName: string;
  // Language of the events+ hub while creation
  eventHubLanguageSelected: string;
  // First name of the owner creating the events+ hub
  hubOwnerFirstName: string;
  // Last name of the owner creating the events+ hub
  hubOwnerLastName: string;
  // Email of the owner creating the events+ hub
  hubOwnerEmail: string;
  // Location from where the create action is triggered
  triggerLocation: string;
}
export interface HubStatusToggled extends TrackProperties {
  // New status of events+ hub
  hubStatus: string;
}
export interface ImageEditApplied extends TrackProperties {
  // ImageAspectRatio of the selected Image
  imageAspectRatio?: string;
  // ImageWidth of the selected Image
  imageWidth: string;
  // ImageHeight of the selected Image
  imageHeight: string;
  // Location from where the upload action is triggered
  triggerLocation: string;
}
export interface ImageUploadClicked extends TrackProperties {
  // Location from where the upload action is triggered
  triggerLocation?: string;
}

interface AnalyticsApi {
  createEventsplusHubButtonClicked: (
    props: CreateEventsplusHubButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  hubStatusToggled: (props: HubStatusToggled, options?: Rudder.Options, callback?: ApiCallback) => void;
  imageEditApplied: (props: ImageEditApplied, options?: Rudder.Options, callback?: ApiCallback) => void;
  imageUploadClicked: (props: ImageUploadClicked, options?: Rudder.Options, callback?: ApiCallback) => void;
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
 * `const { acqSignupCompleted } = useEventsPlusHubPageActionsApi();`
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
export const useEventsPlusHubPageActionsApi = (): AnalyticsApi => {
  const { trackAction, getBaseProps } = usePageActions();
  const { trackingPlanName } = getBaseProps() || {};
  const { updateProfile } = useIdentityApi();

  /**
   * this action tracks the users who clicks on create events+ hub in order to create a new events+ hub
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : create eventsplus hub button clicked
   * downstreamName: create eventsplus hub button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on Create Events+ Hub button within New Events+ Hub creation modal
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {CreateEventsplusHubButtonClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const createEventsplusHubButtonClicked = useCallback(
    (props: CreateEventsplusHubButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'create eventsplus hub button clicked',
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
          downstreamName: 'create eventsplus hub button clicked'
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
   * this action tracks the users who changes the status of events+ in order to make it live or not
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : hub status toggled
   * downstreamName: hub status toggled
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on check mark button in the edit state of Events+ Hub Status section
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {HubStatusToggled} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const hubStatusToggled = useCallback(
    (props: HubStatusToggled, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'hub status toggled',
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
          downstreamName: 'hub status toggled'
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
   * this action tracks the users who uploads image in order to use it as logo or banner image or channel image
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : image edit applied
   * downstreamName: image edit applied
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on Apply' in the image editor during image upload process
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {ImageEditApplied} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const imageEditApplied = useCallback(
    (props: ImageEditApplied, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'image edit applied',
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
          downstreamName: 'image edit applied'
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
   * this action tracks the users who wants to upload image in order to use it in logo banners or channels
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : image upload clicked
   * downstreamName: image upload clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on Upload' button on image edit component in branding, banners or channels
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {ImageUploadClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const imageUploadClicked = useCallback(
    (props: ImageUploadClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'image upload clicked',
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
          downstreamName: 'image upload clicked'
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
    createEventsplusHubButtonClicked,
    hubStatusToggled,
    imageEditApplied,
    imageUploadClicked
  };
};
