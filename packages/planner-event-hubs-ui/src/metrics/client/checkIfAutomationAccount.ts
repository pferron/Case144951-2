import { AUTOMATION_TEST_ACCOUNTS } from '@cvent/shared-core-events-ui';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import type { GetServerSidePropsContext } from 'next';

const LOG = LoggerFactory.create('AutomationUtils');
const AUTOMATION_TESTS_COOKIE_NAME = 'is-automation-account';
const SYNTHETIC_TESTS_COOKIE_NAME = 'is-synthetic-account';

/**
 * Checks if the request is coming from a synthetic datadog browser test
 * @param ctx
 * @returns
 */
export const checkIfSyntheticAccount = (ctx: GetServerSidePropsContext): boolean => {
  const cookies = (ctx?.req?.cookies as { [key: string]: string }) || {};
  return cookies?.[SYNTHETIC_TESTS_COOKIE_NAME] === 'true';
};

interface AutomationData {
  isAutomationAccount: boolean;
  isSyntheticAccount: boolean;
  [key: string]: unknown;
}

/**
 * Checks if the request is coming from an automation test via the WDIO framework
 * @param ctx
 * @param accountMappingId
 * @returns
 */
export const checkIfAutomationAccount = (ctx: GetServerSidePropsContext, accountMappingId: string): AutomationData => {
  const cookies = (ctx?.req?.cookies as { [key: string]: string }) || {};
  // automation tests need to set this cookie so we know if the request came from an automation test account
  // we use this value for things like Datadog so we can ignore the automation data from the SLIs and to determine
  // if we should send data to Rudderstack. By defaul we don't want actions produced by automation tests to be ingested
  // into the CDP and the downstream tools
  let automationData: Record<string, unknown>;
  try {
    const automationDataString = cookies[AUTOMATION_TESTS_COOKIE_NAME] || '{}';
    automationData = JSON.parse(automationDataString);
    if (Object.keys(automationData).length === 0) {
      throw new Error('No automation data found. Falling back to initial WDIO cookie implementation.');
    }
  } catch (_) {
    const isAutomationAccount =
      cookies?.[AUTOMATION_TESTS_COOKIE_NAME] === 'true' || AUTOMATION_TEST_ACCOUNTS.includes(accountMappingId);

    return {
      isAutomationAccount,
      isSyntheticAccount: checkIfSyntheticAccount(ctx)
    };
  }

  // Read the value of the automation account if any
  const isAutomationAccount =
    Object.keys(automationData).length > 0 || AUTOMATION_TEST_ACCOUNTS.includes(accountMappingId);

  const result = {
    isAutomationAccount,
    isSyntheticAccount: checkIfSyntheticAccount(ctx),
    ...(automationData as Record<string, unknown>)
  };

  LOG.info('checkIfAutomationAccount result >>>>>>', result);
  return result;
};
