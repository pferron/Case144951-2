/**
 * ------------------------------------------------------------------------------------
 * This file is only generated once so feel free to update it as per your app requirements.
 * The useFetchUserTraits hook is a mock implementation that should be replaced with your own
 * logic to fetch the user details. The custom traits are optional in case you need to pass
 * additional user information that is unique to your product.
 * ------------------------------------------------------------------------------------
 */
import { useEffect, useMemo } from 'react';
import { CDPUserTraits, useIdentityApi } from './IdentityProvider';
import { useIsMetricsInitialized } from './MetricsProvider';
import {
  GetAccountDetailsDocument,
  GetAccountConfigDocument,
  GetUserDetailsDocument
} from '@cvent/planner-event-hubs-model/operations';
import { EventLicenseType } from '@utils/constants';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { useQuery } from '@apollo/client';

const LOG = LoggerFactory.create('UserTraitsComponent');

type UserDetail = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  accountName: string;
  license: string;
};

type UserData = {
  userTraits: UserDetail;
  customTraits: {};
};

/**
 * Hook to fetch the user details. This is a mock implementation
 * that should be replaced with your own logic to fetch the user details.
 * The custom traits are optional in case you need to pass additional user
 * information that is unique to your product.
 *
 * @returns
 */
export const useFetchUserTraits = (userId): UserData => {
  const {
    loading: loadingAccountDetails,
    error: errorAccountDetails,
    data: accountDetailsData
  } = useQuery(GetAccountDetailsDocument);

  const {
    loading: loadingAccountConfig,
    error: errorAccountConfig,
    data: accountConfigsData
  } = useQuery(GetAccountConfigDocument);

  const { loading: loadingUserData, error: errorUserData, data: userDataFromNav } = useQuery(GetUserDetailsDocument);

  const userData = useMemo(() => {
    if (!loadingAccountDetails && !loadingUserData && !loadingAccountConfig) {
      return {
        userTraits: {
          id: userId,
          firstName: userDataFromNav?.user.firstName,
          lastName: userDataFromNav?.user.lastName,
          email: userDataFromNav?.user.email,
          company: userDataFromNav?.user.company !== '' ? userDataFromNav?.user.company : 'not provided',
          accountName: accountDetailsData?.accountDetails?.AccountName,
          license: EventLicenseType[accountConfigsData?.accountConfig?.EventFeatures?.GeneralFeatures?.LicenseTypeId]
        }
      };
    }
    if (errorUserData) {
      LOG.error('Failed to fetch the user traits >>>>', errorUserData);
    }
    if (errorAccountConfig) {
      LOG.error('Failed to fetch the account configs to use in user traits>>>>', errorAccountConfig);
    }
    if (errorAccountDetails) {
      LOG.error('Failed to fetch the account details to use in user traits>>>>', errorAccountDetails);
    }
    return {};
  }, [
    loadingAccountDetails,
    loadingUserData,
    loadingAccountConfig,
    userDataFromNav,
    accountDetailsData,
    accountConfigsData,
    errorUserData,
    errorAccountConfig
  ]);

  const customTraits = {};

  return {
    userTraits: userData?.userTraits,
    customTraits: customTraits
  };
};

/**
 * Wrapper Component to centralized the fetching of the User Details so
 * we can identify users
 *
 * @param param0
 * @returns
 */
export default function UserTraits({ children, isCVIIUser, userId }): JSX.Element {
  const { userTraits, customTraits } = useFetchUserTraits(userId);
  // Use identity api to identify the user
  const { identify } = useIdentityApi();
  const isMetricsInitialized = useIsMetricsInitialized();

  /**
   * Effect to identify the user as soon as the data is available
   */
  useEffect(() => {
    if (typeof userTraits !== 'undefined' && isMetricsInitialized && !isCVIIUser) {
      const cdpTraits: CDPUserTraits = {
        persona: 'planner',
        userId: userTraits.id,
        firstName: userTraits.firstName,
        lastName: userTraits.lastName,
        email: userTraits.email,
        company: userTraits.company,
        accountName: userTraits.accountName,
        license: userTraits.license
      };
      identify(cdpTraits, customTraits);
    }
  }, [userTraits, customTraits, isMetricsInitialized, identify]);

  return children;
}
