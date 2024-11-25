import { AppConfigs, appConfigsVar } from '@pages/_app';

export const getAppConfig = (): AppConfigs => appConfigsVar();

export const getEnvironment = (): string => appConfigsVar().environment;

export const getEnvironmentForImage = (): string => {
  return isDevEnvironment() ? 'T2' : appConfigsVar().environment;
};

export const isDevEnvironment = (): boolean => {
  const { ENVIRONMENT_TYPE } = appConfigsVar();
  return ENVIRONMENT_TYPE === 'dev' || ENVIRONMENT_TYPE === 'local';
};

export const isStagingEnvironment = (): boolean => {
  const { ENVIRONMENT_TYPE } = appConfigsVar();
  return ENVIRONMENT_TYPE === 'staging';
};

export const getApiRouteBasePath = (): string => {
  const { apiRouteBasePath } = appConfigsVar();
  return apiRouteBasePath;
};

export const getImageProcessingUrl = (): string => {
  const { environment, imageProcessingServiceUrl } = appConfigsVar();
  return `${imageProcessingServiceUrl}${isDevEnvironment() ? 'T2' : environment}`;
};

export const getBearerToken = (): string => {
  const { bearerToken } = appConfigsVar();
  return bearerToken;
};

const ADDITIONAL_CALENDAR_ITEM_MEDIA_RELATIVE_URL =
  '/subscribers/events2/EventCalendar/AdditionalCalendarItemMedia/Index/View';
export const getAdditionalCalendarItemMediaPageUrl = (additionalCalendarId): string => {
  const { normandyBaseUrl } = appConfigsVar();
  return `${normandyBaseUrl}${ADDITIONAL_CALENDAR_ITEM_MEDIA_RELATIVE_URL}?additionalCalendarStub=${additionalCalendarId}`;
};
