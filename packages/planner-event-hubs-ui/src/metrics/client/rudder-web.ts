/**
 * This client was automatically generated. ** Do Not Edit **
 */

import { ViolationHandler } from './validators';

/**
 * The analytics.js snippet should be available via window.analytics.
 * You can install it by following instructions at: https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk#2-installing-the-rudderstack-javascript-sdk
 */
declare global {
  interface Window {
    analytics: any;
  }
}

/** The Schema object which is being used by Ajv to validate the message */
export interface Schema {
  $schema?: string;
  description?: string;
  properties?: object;
  title?: string;
  type?: string;
}

/** A dictionary of options. For example, enable or disable specific destinations for the call. */
export interface Options {
  /**
   * Selectivly filter destinations. By default all destinations are enabled.
   * https://docs.rudderstack.com/stream-sources/rudderstack-sdk-integration-guides/rudderstack-javascript-sdk#4-how-to-filter-selective-destinations-to-send-event-data
   */
  integrations?: {
    [key: string]: boolean | { [key: string]: any };
  };
  /**
   * A dictionary of extra context to attach to the call.
   */
  context?: Context;
}

/**
 * Context is a dictionary of extra information that provides useful context about a datapoint.
 */
export interface Context extends Record<string, any> {
  active?: boolean;
  app?: {
    name?: string;
    version?: string;
    build?: string;
  };
  campaign?: {
    name?: string;
    source?: string;
    medium?: string;
    term?: string;
    content?: string;
  };
  device?: {
    id?: string;
    manufacturer?: string;
    model?: string;
    name?: string;
    type?: string;
    version?: string;
  };
  ip?: string;
  locale?: string;
  location?: {
    city?: string;
    country?: string;
    latitude?: string;
    longitude?: string;
    region?: string;
    speed?: string;
  };
  network?: {
    bluetooth?: string;
    carrier?: string;
    cellular?: string;
    wifi?: string;
  };
  os?: {
    name?: string;
    version?: string;
  };
  page?: {
    hash?: string;
    path?: string;
    referrer?: string;
    search?: string;
    title?: string;
    url?: string;
  };
  referrer?: {
    type?: string;
    name?: string;
    url?: string;
    link?: string;
  };
  screen?: {
    density?: string;
    height?: string;
    width?: string;
  };
  timezone?: string;
  groupId?: string;
  traits?: Record<string, any>;
  userAgent?: string;
}

let analytics: () => any | undefined = () => {
  return window.analytics;
};

/** Options to customize the runtime behavior of a RudderTyper client. */
export interface RudderTyperOptions {
  /**
   * Underlying analytics instance where analytics calls are forwarded on to.
   * Defaults to window.analytics.
   */
  analytics?: any;
  /**
   * Handler fired when if an event does not match its spec. This handler
   * does not fire in production mode, because it requires inlining the full
   * JSON Schema spec for each event in your Tracking Plan.
   *
   * By default, it will throw errors if NODE_ENV = "test" so that tests will fail
   * if a message does not match the spec. Otherwise, errors will be logged to stderr.
   */
  onViolation?: ViolationHandler;
}

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
export function setRudderTyperOptions(options: RudderTyperOptions) {
  analytics = options.analytics ? () => options.analytics || window.analytics : analytics;
}

/**
 * Helper to attach metadata on RudderTyper to outbound requests.
 * This is used for attribution and debugging by the RudderStack team.
 */
export function withRudderTyperContext(message: Options = {}): Options {
  return {
    ...message,
    context: {
      ...(message.context || {}),
      ruddertyper: {
        sdk: 'analytics.js',
        language: 'typescript',
        rudderTyperVersion: '',
        trackingPlanId: 'TBD',
        trackingPlanVersion: ''
      }
    }
  };
}

export const getAnalyticsInstance = () => analytics();
