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

export interface AddExistingVideoButtonClicked extends TrackProperties {}
export interface ChannelImageChecked extends TrackProperties {}
export interface ChannelStatusToggled extends TrackProperties {
  // Shows the status of channel whether it is Live or Not Live
  channelStatus: string;
}
export interface CreateASectionButtonClicked extends TrackProperties {}
export interface CreateButtonClicked extends TrackProperties {
  // Name of the Channel created
  channelName: string;
  // Description of the Channel created
  channelDescription: string;
}
export interface CreateChannelButtonClicked extends TrackProperties {}
export interface CreateSectionAddButtonClicked extends TrackProperties {
  // Name of the section created
  sectionName: string;
  // NUmber of videos added to that section
  numberOfVideoAdded: number;
}
export interface DeleteChannelButtonClicked extends TrackProperties {
  // Page location from where the delete action is triggered
  triggerLocation: string;
}
export interface SelectVideoFromLibraryAddButtonClicked extends TrackProperties {
  // Number of videos added to that channel
  numberOfVideoAdded: number;
}

interface AnalyticsApi {
  addExistingVideoButtonClicked: (
    props?: AddExistingVideoButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  channelImageChecked: (props?: ChannelImageChecked, options?: Rudder.Options, callback?: ApiCallback) => void;
  channelStatusToggled: (props: ChannelStatusToggled, options?: Rudder.Options, callback?: ApiCallback) => void;
  createASectionButtonClicked: (
    props?: CreateASectionButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  createButtonClicked: (props: CreateButtonClicked, options?: Rudder.Options, callback?: ApiCallback) => void;
  createChannelButtonClicked: (
    props?: CreateChannelButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  createSectionAddButtonClicked: (
    props: CreateSectionAddButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  deleteChannelButtonClicked: (
    props: DeleteChannelButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
  selectVideoFromLibraryAddButtonClicked: (
    props: SelectVideoFromLibraryAddButtonClicked,
    options?: Rudder.Options,
    callback?: ApiCallback
  ) => void;
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
 * `const { acqSignupCompleted } = useChannelsPageActionsApi();`
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
export const useChannelsPageActionsApi = (): AnalyticsApi => {
  const { trackAction, getBaseProps } = usePageActions();
  const { trackingPlanName } = getBaseProps() || {};
  const { updateProfile } = useIdentityApi();

  /**
   * this action tracks the users who clicks on add existing videos button in order to add videos to that channel
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : add existing video button clicked
   * downstreamName: add existing video button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when used clicks on 'Delete channel' button on channel information page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {AddExistingVideoButtonClicked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const addExistingVideoButtonClicked = useCallback(
    (props?: AddExistingVideoButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'add existing video button clicked',
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
          downstreamName: 'add existing video button clicked'
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
   * this action tracks the users who saves the image in order to use it as thumbnail for channel
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : channel image checked
   * downstreamName: channel image checked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on check mark button in edit state of channel image section in a channel
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {ChannelImageChecked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const channelImageChecked = useCallback(
    (props?: ChannelImageChecked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'channel image checked',
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
          downstreamName: 'channel image checked'
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
   * this action tracks the users who changes the status of channel in order to make it Live or not
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : channel status toggled
   * downstreamName: channel status toggled
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user click on check mark button in the edit state of basic information section on channel information page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {ChannelStatusToggled} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const channelStatusToggled = useCallback(
    (props: ChannelStatusToggled, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'channel status toggled',
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
          downstreamName: 'channel status toggled'
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
   * this action tracks the users who wants to create videos sections in order to group certain videos together
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : create a section button clicked
   * downstreamName: create a section button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on Create a section' button in edit state of channel videos section in the video tab of a channel
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {CreateASectionButtonClicked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const createASectionButtonClicked = useCallback(
    (props?: CreateASectionButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'create a section button clicked',
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
          downstreamName: 'create a section button clicked'
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
   * this action tracks the users who clicks on create channel in order to create channel for events+
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : create button clicked
   * downstreamName: create button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks Create Channel button on the channels page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {CreateButtonClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const createButtonClicked = useCallback(
    (props: CreateButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'create button clicked',
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
          downstreamName: 'create button clicked'
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
   * this action tracks the users who clicks on create button in order to create the channel
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : create channel button clicked
   * downstreamName: create channel button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on Create button within new channel creation modal
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {CreateChannelButtonClicked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const createChannelButtonClicked = useCallback(
    (props?: CreateChannelButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'create channel button clicked',
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
          downstreamName: 'create channel button clicked'
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
   * this action tracks the users who creates videos section in order to group the videos
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : create section add button clicked
   * downstreamName: create section add button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when the user clicks on 'Add' in the 'Name your section' modal
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {CreateSectionAddButtonClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const createSectionAddButtonClicked = useCallback(
    (props: CreateSectionAddButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'create section add button clicked',
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
          downstreamName: 'create section add button clicked'
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
   * this action tracks the users who clicks on delete channel button in order to delete that particular channel
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : delete channel button clicked
   * downstreamName: delete channel button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user click on 'Delete channel' button on channel information page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {DeleteChannelButtonClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const deleteChannelButtonClicked = useCallback(
    (props: DeleteChannelButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'delete channel button clicked',
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
          downstreamName: 'delete channel button clicked'
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
   * this action tracks the users who select videos from list in order to update the videos in channel
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : select video from library add button clicked
   * downstreamName: select video from library add button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on 'Add' in the select 'Video from Library'
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {SelectVideoFromLibraryAddButtonClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  const selectVideoFromLibraryAddButtonClicked = useCallback(
    (props: SelectVideoFromLibraryAddButtonClicked, options?: Rudder.Options): void => {
      // Grab the destinations from the definition so the rudderstack reporter configures
      // the integrations accordingly
      const destinations = 'datadog,Snowflake,Mixpanel'.split(',');
      // RudderStack unique action name for the workspace
      const action = {
        id: 'select video from library add button clicked',
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
          downstreamName: 'select video from library add button clicked'
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
    addExistingVideoButtonClicked,
    channelImageChecked,
    channelStatusToggled,
    createASectionButtonClicked,
    createButtonClicked,
    createChannelButtonClicked,
    createSectionAddButtonClicked,
    deleteChannelButtonClicked,
    selectVideoFromLibraryAddButtonClicked
  };
};
