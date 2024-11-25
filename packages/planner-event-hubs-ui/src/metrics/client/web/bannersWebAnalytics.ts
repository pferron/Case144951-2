/**
 * This client was automatically generated. ** Do Not Edit **
 */

import { ApiCallback } from '@rudderstack/analytics-js';
import * as Rudder from '../rudder-web';
import { RudderAnalyticsProperties } from '../commonTypes';

const setRudderTyperOptions = Rudder.setRudderTyperOptions;
const withRudderTyperContext = Rudder.withRudderTyperContext;
interface WithBaseProperties extends RudderAnalyticsProperties {}

export interface AssignPagesButtonClicked extends WithBaseProperties {}
export interface BannerContentSectionChecked extends WithBaseProperties {
  // Title provided for the banner
  bannerTitle: string;
  // Description provided for the banner
  bannerBody?: string;
  // Button text if there are any buttons added to the banner
  buttonText?: string;
  // Destination page or link on click on the button
  whereWillThisButtonBringYourMembers?: string;
  // Name of the page that button takes when selected Events+ hub
  selectAPage?: string;
  // External Link to which the button clicks takes to
  externalLink?: string;
}
export interface BannerDesignSectionChecked extends WithBaseProperties {
  // Text alignment selected for the banner
  textAlignment: string;
  // Font color of the text that appears on the banner
  fontColor?: string;
}
export interface BannerImageChecked extends WithBaseProperties {}
export interface BannerNameProvided extends WithBaseProperties {
  // Template chosen for the banner
  bannerTemplate: string;
  // Name provided for the banner
  bannerName: string;
}
export interface CreateBannerButtonClicked extends WithBaseProperties {}
export interface PagesAssignButtonClicked extends WithBaseProperties {
  // Name of the page assigned to the banner
  bannerPlacement: string;
}

// Track Calls
export function assignPagesButtonClicked(
  props?: AssignPagesButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'assign pages button clicked',
      { ...props, version: '', downstreamName: 'assign pages button clicked' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function bannerContentSectionChecked(
  props: BannerContentSectionChecked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'banner content section checked',
      {
        ...props,
        version: '',
        downstreamName: 'banner content section checked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function bannerDesignSectionChecked(
  props: BannerDesignSectionChecked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'banner design section checked',
      {
        ...props,
        version: '',
        downstreamName: 'banner design section checked'
      },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function bannerImageChecked(props?: BannerImageChecked, options?: Rudder.Options, callback?: ApiCallback): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'banner image checked',
      { ...props, version: '', downstreamName: 'banner image checked' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function bannerNameProvided(props: BannerNameProvided, options?: Rudder.Options, callback?: ApiCallback): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'banner name provided',
      { ...props, version: '', downstreamName: 'banner name provided' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function createBannerButtonClicked(
  props?: CreateBannerButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'create banner button clicked',
      { ...props, version: '', downstreamName: 'create banner button clicked' },
      withRudderTyperContext(options),
      callback
    );
  }
}
export function pagesAssignButtonClicked(
  props: PagesAssignButtonClicked,
  options?: Rudder.Options,
  callback?: ApiCallback
): void {
  const a = Rudder.getAnalyticsInstance();
  if (a) {
    a.track(
      'pages assign button clicked',
      { ...props, version: '', downstreamName: 'pages assign button clicked' },
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
   * this action tracks the users who has intent to assign pages to banners in order to show banners on those pages
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : assign pages button clicked
   * downstreamName: assign pages button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on 'Assign pages' in page section of banner
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {AssignPagesButtonClicked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  assignPagesButtonClicked,
  /**
   * this action tracks the users who provides banner details in order to update the banner content section
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : banner content section checked
   * downstreamName: banner content section checked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on check mark button in edit state of banner content section
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {BannerContentSectionChecked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  bannerContentSectionChecked,
  /**
   * this action tracks the users who updates design section in order to change the text alignments in banner
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : banner design section checked
   * downstreamName: banner design section checked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on check mark button in edit state of banner design section
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {BannerDesignSectionChecked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  bannerDesignSectionChecked,
  /**
   * this action tracks the users who saves the image in order to use in banners
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : banner image checked
   * downstreamName: banner image checked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on check mark button in edit state of website image section in banners section
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {BannerImageChecked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  bannerImageChecked,
  /**
   * this action tracks the users who provide a name to banners in order to create the banner
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : banner name provided
   * downstreamName: banner name provided
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {BannerNameProvided} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  bannerNameProvided,
  /**
   * this action tracks the users who wants to create banner in order to use in eventsplus pages
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : create banner button clicked
   * downstreamName: create banner button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when the user clicks on Create Banner' button on the banners page
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {CreateBannerButtonClicked} [props] - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  createBannerButtonClicked,
  /**
   * this action tracks the users who assigns the pages to banners in order to show the banner on those pages
   *
   * Action Definition:
   * ------------------------------------------------------
   * status        : active
   * id            :
   * name          : pages assign button clicked
   * downstreamName: pages assign button clicked
   * owner         : red
   * phase         : engagement
   * release       : v2.0
   * version       :
   * type          : track
   * multiStep     :  no
   * trigger       : this action is triggered when user clicks on 'Assign' in the select 'Pages' modal
   * destinations  : datadog,Snowflake,Mixpanel
   * sdk           : analytics.js
   * ------------------------------------------------------
   *
   * @param {PagesAssignButtonClicked} props - The analytics properties that will be sent to RudderStack.
   * @param {Object} [options] - A dictionary of options. For example, enable or disable specific destinations for the call.
   */
  pagesAssignButtonClicked
};

const bannersAnalyticsClient = new Proxy<typeof clientAPI>(clientAPI, {
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

export default bannersAnalyticsClient;
