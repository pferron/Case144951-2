/**
 * ------------------------------------------------------------------------------------
 * This client was automatically generated. ** Do Not Edit **
 * ------------------------------------------------------------------------------------
 */

export enum RudderSDKVersion {
  Latest = 'latest',
  Deprecated = 'deprecated'
}

export enum UserGroup {
  // These users fall within the automation group (i.e. dd synthetics, load tests, automation tests)
  Automation = 'automation',
  // These users are Cventers. Whenever a user is identify, the email, company name, account name and initial refferer are properties that are used to determine if this is an internal user
  Internal = 'internal',
  // These users are considered actual customers. If an internal user didn't follow the rules when creating accounts they will be placed in the external group
  External = 'external',
  // This user is an annonymous user. Once they login or signup, they will be placed under one of the other groups
  Unknown = 'unknown'
}
export enum Persona {
  // These users are users that attend an event either in person or virtually
  Attendee = 'attendee',
  // These users are users that plan and coordinate all aspects of an event or webinar
  Planner = 'planner',
  // These users are users that present a topic or a talk during an event or webinar
  Speaker = 'speaker',
  // These users are annonymous users that visit any of our web sites (i.e cvent.com, knowledge center, etc)
  Visitor = 'visitor'
}

export interface BaseProperties {
  // The current application version. Value should be grabbed from your app's package.json file
  appVersion: string;
  // Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more
  product: string;
  // Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more
  businessUnit: string;
  // Unique identifier to reference the application that is sending the action to the downstream tools
  component: string;
  // Identifier to reference the environment where the action was sent from
  environmentName: string;
  // Identifier to reference the user that executed the action
  userId?: string;
  // Identifier to reference the group a user belongs to
  userGroup: UserGroup;
  // The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string
  utmCampaign?: string;
  // The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string
  utmSource?: string;
  // Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string
  utmMedium?: string;
  // Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string
  utmTerm?: string;
  // Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string
  utmContent?: string;
  // Identifier to represent the user's characteristics
  persona: Persona;
  // Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application
  isCVIIUser: boolean;
  // Identifier to reference the name of the tracking plan this action is associated with
  trackingPlanName: string;
}

export interface MeasureProperties {
  /**
   * In case this action ends in an error, this property value should have the reason why it failed
   */
  error?: string;
  /**
   * In case this action needs to be tracked as an expected error, this property value should have the expected error message
   */
  expected_error?: string;
  /**
   * In case this action needs to be tracked as incomplete, this property value should have the reason why it could not be measured/completed
   */
  incomplete_measure?: string;
}

export interface TrackProperties {
  /**
   * In case this action ends in an error, this property value should have the reason why it failed
   */
  error?: string;
  /**
   * In case this action needs to be tracked as an expected error, this property value should have the expected error message
   */
  expected_error?: string;
}

export type RudderAnalyticsProperties = MeasureProperties & BaseProperties;
