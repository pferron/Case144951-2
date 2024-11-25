/**
 * Injects props from server side to all pages in the app
 * Verify Auth
 */
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';
import type { AuthProps } from '@cvent/nextjs/auth';
import { getAuthPropsOrRedirect, getAccessTokenFromAuthCookie } from '@cvent/nextjs/auth';
import { ApolloCacheProps, initRemoteApolloClient } from '@cvent/apollo-client';
import { getBasePath } from '@cvent/nextjs/utils/getBasePath';
import { getAppFeatures } from '@utils/appFeatures';
import { getUserPermissions } from '@utils/userPermissions';
import { appFeatures as baseAppFeatures } from 'appFeatures';
import { updateCtxHeaders } from '@server/utils';
import { redirectServerSide } from '@utils/redirect';
import { isRouteVisible, routeExperimentMapping } from '@utils/routeVisibilityHelper';
import { v4 } from 'uuid';
import { reduceAppFeatures } from '@components/AppFeaturesProvider';
import {
  verifyAccessTokenHelper,
  getLocale,
  getAccountMappingId,
  getUserStub,
  getAccountId,
  isCviiLogin
} from '@utils/authUtils';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';
import { MetricsClient, logReporter } from '@cvent/sli-nextjs-metrics';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { accountConfig } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import { checkIfAutomationAccount } from 'src/metrics/client/checkIfAutomationAccount';
import { getHub } from '@utils/hubHelper';

const LOG = LoggerFactory.create('pageServerSidePropInjector');

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PageServerSideProps = Record<string, any> & AuthProps & ApolloCacheProps;

/**
 * Metrics client to track the time the server takes to serve the page
 */
const metricsClient = new MetricsClient([logReporter]);

const BASE_URL = process.env.appBaseUrl || 'http://localhost:3000';
const defaultLocale = 'en-US';

const getAuthToken = headers => {
  try {
    return getAccessTokenFromAuthCookie(headers);
  } catch (exception) {
    return '';
  }
};

const getAuthTokenMetadata = async (headers: IncomingMessage & { cookies: NextApiRequestCookies }) => {
  try {
    const accessToken = getAuthToken(headers);
    const tokenResponse = await verifyAccessTokenHelper(accessToken);
    return {
      locale: getLocale(tokenResponse),
      accountMappingId: getAccountMappingId(tokenResponse),
      userStub: getUserStub(tokenResponse),
      accountId: getAccountId(tokenResponse),
      isCVIIUser: isCviiLogin(tokenResponse)
    };
  } catch (exception) {
    return {
      locale: defaultLocale,
      accountMappingId: '',
      userStub: '',
      accountId: '',
      isCVIIUser: false
    };
  }
};

// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const getAccountConfigs = async (apolloClient: ApolloClient<NormalizedCacheObject>): Promise<any> => {
  if (apolloClient == null) {
    LOG.error('Cannot retrieve account configs before apolloClient initialisation');
    return;
  }

  try {
    const response = await apolloClient.query({
      query: accountConfig,
      fetchPolicy: 'network-only'
    });

    const accountConfigs = response?.data?.accountConfig?.AccountFeatures?.GeneralFeatures ?? {};
    // RED
    // eslint-disable-next-line consistent-return
    return accountConfigs;
  } catch (error) {
    LOG.error('Error fetching accountConfigs:', error);
    throw error;
  }
};

export const pageServerSidePropsInjector = async (
  ctx: GetServerSidePropsContext,
  // RED
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalProps: any = {}
): Promise<GetServerSidePropsResult<PageServerSideProps>> => {
  // Start measuring the time this page takes to fetch for data in the server
  let serverDuration = 0;
  const event = metricsClient.measureEvent('server_metrics');
  const { locale, accountMappingId, userStub, accountId, isCVIIUser } = await getAuthTokenMetadata(ctx.req);

  const {
    isSyntheticAccount,
    isAutomationAccount,
    sessionId = null,
    executionId = null,
    testExecutionItemId = null
  } = checkIfAutomationAccount(ctx, accountMappingId);

  const automationData = { isAutomationAccount, automationSessionId: sessionId, testExecutionItemId, executionId };

  const pageProps = {
    props: {
      locale,
      imageProcessingServiceUrl: process.env.imageProcessingServiceUrl,
      ENVIRONMENT_TYPE: process.env.DEV_LOGIN === 'true' ? 'local' : process.env.ENVIRONMENT_TYPE,
      bearerToken: getAuthToken(ctx.req),
      apiRouteBasePath: getBasePath(),
      environment: process.env.ENVIRONMENT_NAME,
      accountMappingId,
      accountId,
      userStub,
      isCVIIUser,
      normandyBaseUrl: process.env.normandyBaseUrl,
      isSyntheticAccount,
      isAutomationAccount,
      automationData,
      ...additionalProps
    }
  };

  const authPropOrRedirect = await getAuthPropsOrRedirect<PageServerSideProps>(ctx, pageProps.props);
  if ('redirect' in authPropOrRedirect) {
    return authPropOrRedirect;
  }

  const apolloClient = initRemoteApolloClient(
    {},
    updateCtxHeaders(ctx).req.headers as Record<string, string>,
    `${BASE_URL}/api/graphql`
  );

  const [appFeatures, userPermissions] = await Promise.all([
    getAppFeatures(apolloClient, baseAppFeatures),
    getUserPermissions(apolloClient)
  ]);

  if (!isRouteVisible(reduceAppFeatures(appFeatures), routeExperimentMapping, ctx.resolvedUrl)) {
    return redirectServerSide('/404', { pageLoadId: v4(), requestId: v4() });
  }
  const urlArray = ctx.resolvedUrl.split('/');
  if (urlArray.length > 2) {
    const hub = await getHub(apolloClient, urlArray[2]);
    if (hub?.status === 'Deleted') {
      return redirectServerSide('/404', { pageLoadId: v4(), requestId: v4() });
    }
  }
  // Record server load time and pass a function to get the duration
  event.record('success', (metricsData: Record<string, unknown>) => {
    serverDuration = metricsData.duration as number;
    return {
      ...metricsData,
      url: ctx.req.url,
      type: 'server_page_load'
    };
  });
  return {
    props: {
      ...authPropOrRedirect.props,
      serverDuration,
      appFeatures,
      userPermissions
    }
  };
};
