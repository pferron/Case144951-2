import type { IncomingHttpHeaders } from 'http';
import { GetServerSidePropsContext } from 'next/types';
import { httpLogPageLoadId } from '@cvent/nucleus-networking/lib';
import { v4 } from 'uuid';
import locales from '@locales/index';

/**
 * Get cookies from a request
 *
 * @param req http request
 * @return {Map} of cookie name to cookie value
 */
export function parseCookies(req: { headers: IncomingHttpHeaders }): Map<string, string> {
  const cookies = new Map<string, string>();
  if (req.headers.cookie) {
    req.headers.cookie.split(/; */).forEach(cookie => {
      const [k, v] = cookie.split('=');
      cookies.set(k as string, v as string);
    });
  }
  return cookies;
}

export const extractFileName = (path: string): string => {
  return path.split('/').pop();
};

export const extractFileExtension = (filename: string): string => {
  return filename.split('.').pop();
};

export const extractFileBaseName = (filename: string): string => {
  const parts = filename.split('.');
  parts.pop(); // drop the extension
  return parts.join('.'); // re-join to support any dots in filenames before extension part
};

export const updateCtxHeaders = (ctx: GetServerSidePropsContext): GetServerSidePropsContext => {
  const _ctx = { ...ctx };
  _ctx.req.headers.HttpLogPageLoadId = httpLogPageLoadId;
  _ctx.req.headers.HttpLogRequestId = v4();
  delete _ctx.req.headers.host;
  return _ctx;
};

export const normalizeRawOrJSONResponseToJSON = (rawOrJSONResponse: string | object) => {
  let response = rawOrJSONResponse;
  // RED
  // hack until core standardizes response headers
  // https://cvent.slack.com/archives/C04L1DP598R/p1694469995935649?thread_ts=1694459376.857109&cid=C04L1DP598R
  if (typeof rawOrJSONResponse === 'string') {
    response = JSON.parse(rawOrJSONResponse);
  }

  return response;
};

export enum Product {
  VIDEO_LIBRARY = 'Video Library'
}

export const getDefaultLocales = async (locale, stringKey) => {
  const localesResults = await locales;
  const localesWithLocale = await localesResults[locale]();

  return localesWithLocale[stringKey];
};
