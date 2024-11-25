import queryString, { ParsedUrlQueryInput } from 'querystring';
import { NextRouter } from 'next/router';
import getConfig from 'next/config';

interface RedirectObject {
  destination: string;
  permanent: boolean;
}

interface RedirectResponse {
  redirect: RedirectObject;
}

/**
 * create query string to be pass to error page
 * @param queryParams
 */
export const queryStringFromObject = (queryParams: ParsedUrlQueryInput): string => {
  return queryString.stringify(queryParams);
};

/**
 *  redirect to other page if on server side
 * @param redirectionPath
 * @param redirectionParam
 */
export const redirectServerSide = (
  redirectionPath: string,
  redirectionParam: ParsedUrlQueryInput
): RedirectResponse => {
  return {
    redirect: {
      destination: `${redirectionPath}?${queryStringFromObject(redirectionParam)}`,
      permanent: false
    }
  };
};

/**
 * redirect to other page if on client side
 * @param router
 * @param redirectionPath
 * @param redirectionParam
 */
export const redirectClientSide = (
  router: NextRouter,
  redirectionPath: string,
  redirectionParam: ParsedUrlQueryInput
): Promise<boolean> => {
  return router.push(`${redirectionPath}?${queryStringFromObject(redirectionParam)}`);
};

/**
 *
 * @param url
 * @param param
 * @param value
 */
export const updateUrlQueryParam = (url: string, param: string, value: string) => {
  const { publicRuntimeConfig } = getConfig();
  const urlObject = new URL(publicRuntimeConfig.VIDEO_HUB_WEB + url);
  urlObject.searchParams.delete(param);
  urlObject.searchParams.set(param, value);
  return urlObject.href.replace(publicRuntimeConfig.VIDEO_HUB_WEB, '');
};
