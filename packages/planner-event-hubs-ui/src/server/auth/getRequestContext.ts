import { AuthMethod, Authorization } from '@cvent/auth-client';
import { NextApiRequest, NextApiResponse } from 'next';
import { readAuthToken } from '@server/auth/readAuthToken';
import { getAccountTokenDetails } from '@server/auth/getAccountBearerToken';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { IncomingHttpHeaders } from 'http';
import { v4 as uuidv4 } from 'uuid';

const TEST_ACCOUNTS = [process.env.TEST_ACCOUNT_ID, process.env.TEST_ACCOUNT_ID2];

const LOG = LoggerFactory.create('getRequestContext');

export type LogIDs = {
  httplogrequestid?: string;
  HttpLogRequestId: string;
  httplogpageloadid?: string;
  HttpLogPageLoadId: string;
};

export type RequestContext = {
  accountToken?: string;
  authorization?: Authorization;
  logIds: LogIDs;
  isAutomationAccount?: boolean;
  nextApiResponse?: NextApiResponse;
};

/**
 * Method to check if the account is an automation account
 * @param accountId
 */
const checkAutomationAccount = (accountId: string): boolean => {
  return TEST_ACCOUNTS.includes(String(accountId));
};

const getHeaderValueAsString = (input: string | string[] | undefined): string | undefined => {
  if (input) {
    if (Array.isArray(input) && input?.length > 0) {
      return input[0];
    }
    return String(input);
  }
  return undefined;
};

/**
 * Get logId from header
 * @param headers
 * @returns
 */
const getLogIdFromHeader = (headers: IncomingHttpHeaders): LogIDs => {
  return {
    HttpLogRequestId:
      getHeaderValueAsString(headers?.httplogrequestid) ||
      getHeaderValueAsString(headers?.HttpLogRequestId) ||
      uuidv4().toString(),
    HttpLogPageLoadId:
      getHeaderValueAsString(headers?.httplogpageloadid) ||
      getHeaderValueAsString(headers?.HttpLogPageLoadId) ||
      uuidv4().toString()
  };
};

export const getRequestContext = () => {
  return async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }): Promise<RequestContext | null> => {
    if (!req?.headers) {
      return null;
    }

    const headers = req?.headers;

    const logIds = getLogIdFromHeader(headers);

    const { authMethod, authToken } = readAuthToken(headers);

    if (!authToken || authMethod?.toUpperCase() !== AuthMethod.BEARER) {
      LOG.debug(`
      Skip getting accountToken, one of the required value(s) is missing 
        authMethod: ${authMethod}
        token: ${authToken?.substring(0, 4)}
  `);
      return {
        logIds,
        accountToken: undefined,
        nextApiResponse: res
      };
    }

    let accountToken;
    try {
      accountToken = await getAccountTokenDetails(String(authToken));
    } catch (error) {
      // if bearer token is not valid, do not return
      return {
        logIds,
        accountToken: undefined,
        nextApiResponse: res
      };
    }

    const authorization = accountToken?.authorization;

    const isAutomationAccount: boolean = checkAutomationAccount(
      authorization?.metadata?.accountId || authorization?.metadata?.AccountId
    );
    return {
      isAutomationAccount,
      authorization,
      logIds,
      accountToken: `Bearer ${accountToken.accessToken}`,
      nextApiResponse: res
    };
  };
};
