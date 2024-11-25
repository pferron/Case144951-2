/**
 * This client was automatically generated. ** Do Not Edit **
 */

import { ApiCallback } from '@rudderstack/analytics-js';
import * as Rudder from '../rudder-web';
import { RudderAnalyticsProperties } from '../commonTypes';

const setRudderTyperOptions = Rudder.setRudderTyperOptions;
const withRudderTyperContext = Rudder.withRudderTyperContext;
interface WithBaseProperties extends RudderAnalyticsProperties {}

export interface AddExistingVideoButtonClicked extends WithBaseProperties {}
export interface ChannelImageChecked extends WithBaseProperties {}
export interface ChannelStatusToggled extends WithBaseProperties {
  // Shows the status of channel whether it is Live or Not Live
  channelStatus: string;
}
export interface CreateASectionButtonClicked extends WithBaseProperties {}
export interface CreateButtonClicked extends WithBaseProperties {
  // Name of the Channel created
  channelName: string;
  // Description of the Channel created
  channelDescription: string;
}
export interface CreateChannelButtonClicked extends WithBaseProperties {}
export interface CreateSectionAddButtonClicked extends WithBaseProperties {
  // Name of the section created
  sectionName: string;
  // NUmber of videos added to that section
  numberOfVideoAdded: number;
}
export interface DeleteChannelButtonClicked extends WithBaseProperties {
  // Page location from where the delete action is triggered
  triggerLocation: string;
}
export interface SelectVideoFromLibraryAddButtonClicked extends WithBaseProperties {
  // Number of videos added to that channel
  numberOfVideoAdded: number;
}

// Track Calls
export function addExistingVideoButtonClicked(
  props?: AddExistingVideoButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'add existing video button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'add existing video button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function channelImageChecked(
  props?: ChannelImageChecked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'channel image checked',
      { ...props, version: '', downstreamName: 'channel image checked' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function channelStatusToggled(
  props: ChannelStatusToggled,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'channel status toggled',
      { ...props, version: '', downstreamName: 'channel status toggled' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function createASectionButtonClicked(
  props?: CreateASectionButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'create a section button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'create a section button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function createButtonClicked(
  props: CreateButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'create button clicked',
      { ...props, version: '', downstreamName: 'create button clicked' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function createChannelButtonClicked(
  props?: CreateChannelButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'create channel button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'create channel button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function createSectionAddButtonClicked(
  props: CreateSectionAddButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'create section add button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'create section add button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function deleteChannelButtonClicked(
  props: DeleteChannelButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'delete channel button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'delete channel button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function selectVideoFromLibraryAddButtonClicked(
  props: SelectVideoFromLibraryAddButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'select video from library add button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'select video from library add button clicked'
      },
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
  addExistingVideoButtonClicked,
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
  channelImageChecked,
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
  channelStatusToggled,
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
  createASectionButtonClicked,
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
  createButtonClicked,
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
  createChannelButtonClicked,
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
  createSectionAddButtonClicked,
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
  deleteChannelButtonClicked,
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
  selectVideoFromLibraryAddButtonClicked
};

const channelsAnalyticsClient = new Proxy<typeof clientAPI>(clientAPI, {
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

export default channelsAnalyticsClient;
