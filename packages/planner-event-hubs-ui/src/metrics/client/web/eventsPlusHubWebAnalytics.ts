/**
 * This client was automatically generated. ** Do Not Edit **
 */

import { ApiCallback } from '@rudderstack/analytics-js';
import * as Rudder from '../rudder-web';
import { RudderAnalyticsProperties } from '../commonTypes';

const setRudderTyperOptions = Rudder.setRudderTyperOptions;
const withRudderTyperContext = Rudder.withRudderTyperContext;
interface WithBaseProperties extends RudderAnalyticsProperties {}

export interface CreateEventsplusHubButtonClicked extends WithBaseProperties {
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
export interface HubStatusToggled extends WithBaseProperties {
  // New status of events+ hub
  hubStatus: string;
}
export interface ImageEditApplied extends WithBaseProperties {
  // ImageAspectRatio of the selected Image
  imageAspectRatio?: string;
  // ImageWidth of the selected Image
  imageWidth: string;
  // ImageHeight of the selected Image
  imageHeight: string;
  // Location from where the upload action is triggered
  triggerLocation: string;
}
export interface ImageUploadClicked extends WithBaseProperties {
  // Location from where the upload action is triggered
  triggerLocation?: string;
}

// Track Calls
export function createEventsplusHubButtonClicked(
  props: CreateEventsplusHubButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'create eventsplus hub button clicked',
      {
        ...props,
        version: '',
        downstreamName: 'create eventsplus hub button clicked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function hubStatusToggled(props: HubStatusToggled, options?: Rudder.Options, callback?: ApiCallback): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'hub status toggled',
      { ...props, version: '', downstreamName: 'hub status toggled' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function imageEditApplied(props: ImageEditApplied, options?: Rudder.Options, callback?: ApiCallback): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'image edit applied',
      { ...props, version: '', downstreamName: 'image edit applied' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function imageUploadClicked(props: ImageUploadClicked, options?: Rudder.Options, callback?: ApiCallback): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'image upload clicked',
      { ...props, version: '', downstreamName: 'image upload clicked' },
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
  createEventsplusHubButtonClicked,
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
  hubStatusToggled,
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
  imageEditApplied,
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
  imageUploadClicked
};

const eventsPlusHubAnalyticsClient = new Proxy<typeof clientAPI>(clientAPI, {
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

export default eventsPlusHubAnalyticsClient;
