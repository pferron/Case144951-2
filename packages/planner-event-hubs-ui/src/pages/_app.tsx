/* eslint-disable @typescript-eslint/no-empty-function */
// eslint-disable-next-line import/order
import { datadogOptions } from '../config/initBrowserLogging';
// TODO: move this css boilerplate into a next.js plugin
import 'normalize.css';
import '@cvent/carina/fonts/fonts.web.css';

import React, { useMemo } from 'react';
import { ApolloProvider, makeVar, NormalizedCacheObject } from '@apollo/client';
import { ApolloClientFactory, useApollo } from '@cvent/apollo-client';
import getConfig from 'next/config';
import { httpLogPageLoadId } from '@cvent/nucleus-networking/lib';
import { NextPage } from 'next/types';
import { useApolloClientOptions } from '@components/apolloClient';
import AppProviders from '@components/AppProviders';
import ErrorBoundary from '@components/ErrorBoundary';
import { AppFeature } from '@cvent/planner-event-hubs-model/types';
import { initRum } from '@cvent/nextjs/datadog/initRum';
import { defaultLocale } from '../../locales';
import { updateGlobalLoggerContext } from '../config/updateGlobalLoggerContext';
import MetricsProvider from '../metrics/client/MetricsProvider';

const { publicRuntimeConfig } = getConfig();
// example of app wide global state, move to another file and import here as this grows!
// to learn more options for local state management go here; https://www.apollographql.com/blog/local-state-management-with-reactive-variables/
export const darkModeVar = makeVar<boolean>(false);
export const clientVersion = makeVar<string>(String(process.env.CLIENT_VERSION) || 'unknown');
// export const hasInitDatadog = makeVar<boolean>(false);

export type AppConfigs = {
  locale?: string;
  environment?: string;
  apiRouteBasePath?: string;
  imageProcessingServiceUrl?: string;
  normandyBaseUrl?: string;
  ENVIRONMENT_TYPE?: string;
  bearerToken?: string;
  appFeatures?: Array<AppFeature>;
};

export const appConfigsVar = makeVar<AppConfigs>({});

export const isServer = (): boolean => typeof window === 'undefined';

export default function App({
  Component,
  pageProps
}: {
  pageProps: PageProps;
  Component: NextPageWithLayout;
}): JSX.Element {
  const {
    httpLogRequestId,
    normandyBaseUrl,
    appFeatures = [],
    userStub,
    isCVIIUser,
    isSyntheticAccount,
    isAutomationAccount,
    automationData,
    userPermissions = {},
    locale = defaultLocale,
    accountMappingId
  } = pageProps;

  if (typeof window !== 'undefined' && publicRuntimeConfig.IS_DEV !== 'true') {
    initRum({ ...datadogOptions });
  }

  updateGlobalLoggerContext({
    httpLogRequestId,
    httpLogPageLoadId
  });

  // initialize apollo client
  const apolloClientOptions = useApolloClientOptions();
  // what is this login url doing?
  const client = useApollo(
    pageProps,
    new ApolloClientFactory({
      initialState: {},
      loginUrl: publicRuntimeConfig.LOGIN_URL || '/_error',
      graphBasePath: publicRuntimeConfig.BASE_URL, // Not used but should not be empty or null
      graphUri: `${publicRuntimeConfig.BASE_URL}/api/graphql` // Not used but should not be empty or null
    }),
    apolloClientOptions
  );

  const appConfigs = useMemo(
    () => ({
      ...pageProps,
      locale
    }),
    [pageProps, locale]
  );
  appConfigsVar(appConfigs);

  const environment = publicRuntimeConfig.IS_DEV === 'true' ? 'dev' : publicRuntimeConfig.ENVIRONMENT_NAME;

  return (
    <ApolloProvider client={client}>
      <MetricsProvider
        environment={environment}
        userId={userStub}
        isCVIIUser={isCVIIUser}
        rudderstackWriteKey={publicRuntimeConfig.RUDDER_WRITE_KEY}
        rudderstackDataPlaneUrl={publicRuntimeConfig.RUDDER_DATA_PLANE_URL}
        rudderstackSyntheticWriteKey={publicRuntimeConfig.RUDDER_AUTOMATION_SYNTHETIC_WRITE_KEY}
        isSyntheticAccount={isSyntheticAccount}
        isAutomationAccount={isAutomationAccount}
        automationData={automationData}
        accountMappingId={accountMappingId}
      >
        <AppProviders appFeatures={appFeatures} userPermissions={userPermissions} normandyBaseUrl={normandyBaseUrl}>
          <ErrorBoundary>
            <Component {...pageProps} />
          </ErrorBoundary>
        </AppProviders>
      </MetricsProvider>
    </ApolloProvider>
  );
}

export type NextPageWithLayout = NextPage<PageProps> & {
  getLayout?: (props: PageProps) => JSX.Element;
};

type AutomationDataProp = {
  executionId: number;
  testExecutionItemId: number;
  automationSessionId: string;
};
export interface PageProps {
  locale: string;
  __APOLLO_STATE__: NormalizedCacheObject;
  serverDuration: number;
  csrfToken: string;
  httpLogRequestId: string;
  appFeatures?: AppFeature[];
  normandyBaseUrl?: string;
  accountMappingId?: string;
  userStub?: string;
  isCVIIUser?: boolean;
  isSyntheticAccount?: boolean;
  isAutomationAccount?: boolean;
  automationData?: AutomationDataProp | undefined;
  userPermissions?: Record<string, boolean>;
}
