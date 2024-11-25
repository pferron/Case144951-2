import { isInt, isProd } from '@cvent/environments/lib/CventEnvironment';
import { URLSearchParams } from 'apollo-server-env';
import { EVENTS_PLUS_PATH_PARAM } from '@utils/constants';
import getConfig from 'next/config';

interface MemberLoginProps {
  centerId: string;
  centerUrl?: string;
  requestId?: string;
}

export const buildMemberLoginUrl = ({ centerId, centerUrl, requestId }: MemberLoginProps): string => {
  const { publicRuntimeConfig } = getConfig();
  const loginUrl = centerUrl || `${publicRuntimeConfig.VIDEO_HUB_WEB}/${EVENTS_PLUS_PATH_PARAM}/${centerId}`;
  const params = new URLSearchParams();
  if (!isProd(publicRuntimeConfig.ENVIRONMENT_TYPE) && !isInt(publicRuntimeConfig.ENVIRONMENT_TYPE)) {
    params.append('env', publicRuntimeConfig.ENVIRONMENT_NAME);
  }
  if (requestId) {
    params.append('requestId', requestId);
  }
  return `${loginUrl}?${params.toString()}`;
};
