/**
 * ------------------------------------------------------------------------------------
 * This client was automatically generated. ** Do Not Edit **
 * ------------------------------------------------------------------------------------
 */
import * as React from 'react';
import { useContext, useCallback } from 'react';
import { usePageActions } from '@cvent/sli-nextjs-metrics';
import { useIdentityManagement, IdentityInfo, LoginInfo } from '@cvent/cdp-tools';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { RudderSDKVersion } from './commonTypes';

const LOG = LoggerFactory.create('IdentityProvider');

const noop = () => undefined;
type IdentityContextProps = {
  // product in use by the user
  product: string;
  // Id that identifies a user
  userId: string;
  // Whether or not this user logged in from CVII
  isCVIIUser: boolean;
  // The name of the app's tracking plan. Used by CDP framework to append it to page_load and update_profile_with_custom_tratis actions
  trackingPlanName: string;
  // The type of persona the user is identified as (ie. attendee, planner, visitor, etc)
  persona: string;
  // Whether or not this is an automation user
  isAutomationAccount: boolean;
  /**
   * userTraits is the decrypted user information from the rl_trait cookie
   * Note: see more details on the Rudderstack documentation below:
   * https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/data-storage-cookies/#cookies
   */
  hasProfileChanged?: (userTraits: Record<string, unknown>) => boolean;
  // Reach childrens
  children: React.ReactNode;
};
export type CDPUserTraits = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  accountName: string;
  persona: string;
  license?: string;
  subscription?: string;
};
type CustomUserTraits = Record<string, unknown>;
interface IdentityContextInterface {
  updateProfile: (props: Record<string, unknown>) => void;
  identify: (traits: CDPUserTraits, customTraits?: Record<string, unknown>) => void;
  userTraits: string;
  appendUserProperty: (name: string, value: string) => void;
  appendUserProperties: (props: Record<string, string>) => void;
  incrementUserProperty: (name: string, value: number) => void;
  incrementUserProperties: (props: Record<string, number>) => void;
}

/**
 * Provide a default context
 */
export const IdentityContext = React.createContext<IdentityContextInterface>({
  updateProfile: noop,
  identify: noop,
  appendUserProperty: noop,
  appendUserProperties: noop,
  incrementUserProperty: noop,
  incrementUserProperties: noop,
  userTraits: ''
});
// Export api as a hook for better developer experience
export const useIdentityApi = () => useContext(IdentityContext);

/**
 * Identity context api to create and update profiles in all downstream tools.
 * API exposes two methods:
 *
 * - identify. This function will identify a user with the required CDP user traits and create a user profile
 *   in all your supported downstream tools. Example:
 * ------------------------------------------------------------------------------------------------------------
 *   const { identify } = useIdentityProvider();
 *   // Somwhere in your application where you have all the cdp required user traits
 *   identify({
 *      userId,
 *      firstName,
 *      lastName,
 *      email,
 *      company,
 *      accountName,
 *      license,
 *      subscrription
 *    });
 * ------------------------------------------------------------------------------------------------------------
 *
 * - updateProfile. This function will update a user profile in all supported downstream tools. It is executed
 *   internally by the functions in the usePageActionsApi hook for actions that receive traits as options or when
 *   the application calls it directly. Example:
 * ------------------------------------------------------------------------------------------------------------
 *   const { updateProfile } = useIdentityProvider();
 *   // Somewhere in the application where you have the user traits you would like to upsert
 *   updateProfile({ nextWebinarDate, lastWebinarDate });
 * ------------------------------------------------------------------------------------------------------
 *
 * Note: This file is updated every time the api is generated to get the latest rules from the customUserTraits in your plan.json
 */
export const IdentityProvider = ({
  children,
  userId,
  isCVIIUser,
  trackingPlanName,
  persona,
  product,
  isAutomationAccount,
  hasProfileChanged
}: IdentityContextProps) => {
  // Initialize identity management
  const {
    updateProfile: cdpUpdateProfile,
    identify: cdpIdentify,
    userTraits,
    appendUserProperty,
    appendUserProperties,
    incrementUserProperty,
    incrementUserProperties
  } = useIdentityManagement({
    sdkVersion: RudderSDKVersion.Latest,
    userId,
    isCVIIUser,
    trackingPlanName,
    product,
    persona,
    hasProfileChanged
  });

  const { updateMetricData } = usePageActions();

  /**
   * Updates a user profile in all supported downstream tools. It validates the props passed against the auto generated schema
   * and drops the ones that are not defined to enforce data governance around user profiles. In order to be able to update a
   * user profile with the data passed, each property must be defined in the plan.json under the customUserTraits entry
   */
  const updateProfile = useCallback(
    (data: Record<string, unknown>) => {
      const schemaProps = [];
      const userProps = Object.keys(data);
      const diff = userProps.filter(prop => !schemaProps.includes(prop));

      if (diff.length > 0) {
        LOG.warn(
          'You are trying to update the user profile with properties that are not defined in the `customUserTraits` entry in your plan.json',
          `\n\nMissing Props:[${diff.join(', ')}]`,
          '\n\nPlease add the missing props under the `customUserTraits` entry so that they can be included in the updateProfile call'
        );
        // drop properties that are not defined
        diff.forEach(key => delete data[key]);
      }

      // Update user profile with the properties that were not dropped if any
      if (Object.keys(data).length > 0) {
        cdpUpdateProfile(data);
      }
    },
    [cdpUpdateProfile]
  );

  /**
   * identifies a user with the required CDP user traits to create a user profile in all your supported
   * downstream tools.
   */
  const identify = useCallback(
    (traits: CDPUserTraits, customTraits?: CustomUserTraits) => {
      const info: IdentityInfo = {
        user: {
          persona: traits.persona,
          id: traits.userId,
          firstName: traits.firstName,
          lastName: traits.lastName,
          email: traits.email,
          company: traits.company,
          accountName: traits.accountName,
          subscription: traits.subscription,
          isCVIIUser
        },
        customInfo: undefined
      };
      const loginInfo: LoginInfo = {
        loginLicenseType: traits.license,
        product
      };

      // Identify the user using the CDP identify call
      const userGroup = cdpIdentify(info, loginInfo, isAutomationAccount);
      updateMetricData({ userGroup });

      if (customTraits) {
        // Update profile with custom application traits to optimize cookie storage
        updateProfile(customTraits);
      }
    },
    [updateProfile, updateMetricData]
  );

  const context = {
    updateProfile,
    identify,
    userTraits,
    appendUserProperty,
    appendUserProperties,
    incrementUserProperty,
    incrementUserProperties
  };
  return <IdentityContext.Provider value={context}>{children}</IdentityContext.Provider>;
};
