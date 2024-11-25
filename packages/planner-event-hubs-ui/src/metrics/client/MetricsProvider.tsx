/**
 * ------------------------------------------------------------------------------------
 * This file is only generated once so feel free to update it as per your app requirements.
 * You can also add any additional base properties that you want to send and provide the datadog
 * rum configuration. You can find more information about the configuration below:
 * https://docs.datadoghq.com/real_user_monitoring/browser/
 * ------------------------------------------------------------------------------------
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/default-param-last */
import React, { useCallback, useEffect } from 'react';
import { makeVar, useReactiveVar } from '@apollo/client';
import {
  Metrics,
  datadogReporter as ddReporter,
  rudderStackReporter as rudderReporter
} from '@cvent/sli-nextjs-metrics';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { EVENT_HUB_IS_DEV_LOGIN_URL } from '@utils/constants';
import { IdentityProvider } from './IdentityProvider';
import UserTraits from './UserTraits';
import { initRudderStack } from './initRudderstack';
/**
 * Reactive variable. If you are not using @apollo/client to manage state in your application
 * you will have to manage how to access wether or not the metrics client has been initialized
 * on your own.
 */
const isMetricsInitialized = makeVar<boolean>(false);

export function useIsMetricsInitialized(): boolean {
  return useReactiveVar(isMetricsInitialized);
}

declare global {
  interface Window {
    _DATADOG_SYNTHETICS_BROWSER: boolean;
  }
}
type ActionTrackedCallback = (reporter: string, context: Record<string, unknown>) => void;
type AutomationDataProp = {
  executionId: number;
  testExecutionItemId: number;
  automationSessionId: string;
};

interface MetricsProps {
  environment: string;
  userId?: string;
  rudderstackWriteKey: string;
  rudderstackSyntheticWriteKey?: string;
  rudderstackDataPlaneUrl: string;
  isAutomationAccount: boolean;
  isSyntheticAccount: boolean;
  isCVIIUser?: boolean;
  automationData?: AutomationDataProp | undefined;
  children: JSX.Element;
  accountMappingId?: string;
}

interface AppMetricsProps {
  metricsEnabled?: boolean;
  children: JSX.Element;
  environmentName: string;
  baseData: Record<string, unknown>;
  onMetricsInit?: (instance: any) => any;
  cdpWriteKey?: string;
  cdpDataPlaneUrl?: string;
  rudderStackEnabled: boolean;
}

const DD_DESTINATIONS = ['Datadog', 'datadog'];

/**
 * Rudderstack reporter, Overrides reporter from metrics' package to transform the data as needed
 *
 * @param name
 * @param data
 * @param options
 * @param callback
 * @returns
 */
/* eslint-disable default-param-last */
export const rudderStackReporter = (
  name: string,
  data: Record<string, any> | undefined = undefined,
  options: Record<string, any> | undefined = undefined,
  callback?: ActionTrackedCallback
) => {
  // Drop event if the userGroup is set to automation to avoid sending test data via the CDP
  const { userGroup } = data || {};
  if (userGroup === 'automation') return;

  rudderReporter(name, data, options, callback);
};

/**
 * DataDog reporter. Sends metrics to data dog as custom actions. Overrides reporter from metrics'
 * package to transform the data as needed
 *
 * @param name
 * @param data
 * @param options
 * @param callback
 * @returns
 */
export const datadogReporter = (
  name: string,
  data: Record<string, any> | undefined = undefined,
  options: Record<string, any> | undefined = undefined,
  callback?: ActionTrackedCallback
) => {
  const { destinations, downstreamName } = data || {};
  // If the metric has destinations, and datadog is not one of them, skip
  if (destinations && !destinations.some((d: string) => DD_DESTINATIONS.indexOf(d) >= 0)) {
    return;
  }

  const dataCopy = { ...data };
  const eventName = downstreamName || name;

  if ('ddUserId' in dataCopy) delete dataCopy.ddUserId;

  ddReporter(eventName, { ...dataCopy, destinations: ['datadog'] }, options, callback);
};

/**
 * Application Metrics Component. Tracks application metrics to multiple destinations
 * including Data Dog, MixPanel, Intercom, etc via the Rudderstack SDK
 *
 * Note: Each reporter is responsible for checking the destination property passed in
 * the data of each action
 *
 *
 * @param param0
 * @returns
 */
export function AppMetrics({
  children,
  environmentName,
  baseData,
  onMetricsInit = (instance: any) => instance,
  cdpWriteKey,
  cdpDataPlaneUrl,
  rudderStackEnabled,
  metricsEnabled = true
}: AppMetricsProps): JSX.Element {
  useEffect(() => {
    initRudderStack({
      writeKey: cdpWriteKey,
      dataPlaneUrl: cdpDataPlaneUrl,
      metricsEnabled: metricsEnabled && rudderStackEnabled,
      environmentName,
      onLoaded: rdIntance => {
        onMetricsInit(rdIntance);
      }
    });
  }, [metricsEnabled, cdpWriteKey, rudderStackEnabled, cdpDataPlaneUrl, environmentName, onMetricsInit]);

  const config = { environmentName, metricsEnabled, skipDeprecatedDefaultPrefix: true };
  return (
    <Metrics
      config={config}
      baseData={baseData}
      reporters={[
        datadogReporter,
        // Check if we should install the rudderstack reporter
        ...(rudderStackEnabled ? [rudderStackReporter] : [])
      ]}
    >
      {children}
    </Metrics>
  );
}

/**
 * Metrics Provider. Sets up the application with performance and analytics metrics functionality
 * via the page actions api with CDP support. This component is intended to wrap your application's
 * main entry point component (usually the app.tsx file under the pages directory for nextJS apps)
 *
 * @param param0
 * @returns
 */
export default function MetricsProvider({
  environment,
  userId,
  isAutomationAccount,
  isSyntheticAccount,
  rudderstackSyntheticWriteKey,
  rudderstackWriteKey,
  rudderstackDataPlaneUrl,
  isCVIIUser = false,
  automationData,
  children,
  accountMappingId
}: MetricsProps): JSX.Element {
  const environmentName = environment;
  const { publicRuntimeConfig } = getConfig();
  const clientVersion = String(publicRuntimeConfig.CLIENT_VERSION) || 'unknown';
  // From Datadog Docs: https://docs.datadoghq.com/synthetics/guide/identify_synthetics_bots/?tab=singleandmultistepapitests#browser-variables
  const isSynthethicTest = typeof window !== 'undefined' && window._DATADOG_SYNTHETICS_BROWSER !== undefined;

  // Identity Management Props
  const trackingPlanName = 'planner events hub ui';
  const product = 'Events+';
  // TODO: Replace with the type of persona that interacts with your product
  const persona = 'planner';

  const isBotUser = isAutomationAccount || isSynthethicTest || isSyntheticAccount;
  const enableRudderstackTracking = !isBotUser;

  // Load the write key based on wether this user is a synthetic/automation user or not
  const writeKey = isBotUser ? rudderstackSyntheticWriteKey : rudderstackWriteKey;

  // Prevent making graph calls to fetch user traits in login page
  const router = useRouter();
  const isDevLoginPage = router.pathname === EVENT_HUB_IS_DEV_LOGIN_URL;

  // Application's metrics base properties. These properties will be sent as metadata for each action tracked.
  const baseData = {
    // The current application version. Value should be grabbed from your app's package.json file
    appVersion: clientVersion,
    environmentName,
    isCVIIUser,
    userId,
    persona,
    trackingPlanName,
    product,
    businessUnit: 'event',
    component: 'planner-event-hubs-ui',
    ddUserId: userId,
    accountMappingId,
    // If this is an automation account we set it as automation else as unknown. The CDP tool will update this accordingly when the user is identified
    userGroup: isBotUser ? 'automation' : 'unknown',
    // Set up automation data as base props so that we can use it in datadog for analytics purposes
    ...automationData
  };

  const metricsEnabled = true;
  const onMetricsInit = useCallback(() => {
    // It is safe to always check that metrics have been initialized before using the analytic's api. This variable is stored in a reactive variable
    // so that it is easy to retrieve anywhere within the application.
    isMetricsInitialized(true);
  }, []);

  return (
    <AppMetrics
      metricsEnabled={metricsEnabled}
      environmentName={environmentName}
      baseData={baseData}
      cdpWriteKey={writeKey}
      cdpDataPlaneUrl={rudderstackDataPlaneUrl}
      rudderStackEnabled={enableRudderstackTracking}
      onMetricsInit={onMetricsInit}
    >
      <IdentityProvider
        product={product}
        userId={userId}
        isCVIIUser={isCVIIUser}
        trackingPlanName={trackingPlanName}
        persona={persona}
        isAutomationAccount={isBotUser}
      >
        {/* Wrapper component to fetch for the minimum user data to identify the user */}
        {isDevLoginPage ? (
          children
        ) : (
          <UserTraits isCVIIUser={isCVIIUser} userId={userId}>
            {children}
          </UserTraits>
        )}
      </IdentityProvider>
    </AppMetrics>
  );
}
