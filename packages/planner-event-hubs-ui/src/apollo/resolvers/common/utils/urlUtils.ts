import {
  CHANNELS_PATH_PARAM,
  VIDEO_CENTER_ID_NULL,
  CHANNEL_ID_NULL,
  VIDEO_ID_NULL,
  VIDEOS_PATH_PARAM
} from '@utils/constants';
import { isEmpty } from 'lodash';
import { HTTPS } from '@components/constants';

// TODO: Check home page url to elimate /center/ ie x.y.com/video-center/123

class UrlInfo {
  customDomain: string = null;

  absoluteUrl = false;
}

export const getVideoCenterMemberHomePageUrl = (
  videoCenterId: string,
  urlInfo: UrlInfo = {
    customDomain: null,
    absoluteUrl: false
  }
) => {
  if (!videoCenterId) {
    throw new Error(VIDEO_CENTER_ID_NULL);
  }
  let url = '';
  if (urlInfo?.absoluteUrl) {
    url = urlInfo.customDomain
      ? `${HTTPS + urlInfo.customDomain}${process.env.VIDEO_HUB_BASE_PATH}/${videoCenterId}`
      : `${process.env.VIDEO_HUB_WEB}${process.env.VIDEO_HUB_BASE_PATH}/${videoCenterId}`;
  } else {
    url = `/${videoCenterId}`;
  }
  return url;
};

export const getVideoCenterMemberChannelPageUrl = (videoCenterId, channelId, customDomain): string => {
  if (!channelId) {
    throw new Error(CHANNEL_ID_NULL);
  }
  return `${getVideoCenterMemberHomePageUrl(videoCenterId, {
    customDomain,
    absoluteUrl: true
  })}/${CHANNELS_PATH_PARAM}/${channelId}`;
};

export const getVideoCenterChannelPageShortUrlTag = (videoCenterId, channelId): string => {
  if (!videoCenterId) {
    throw new Error(VIDEO_CENTER_ID_NULL);
  }
  if (!channelId) {
    throw new Error(CHANNEL_ID_NULL);
  }
  return `videocenter${videoCenterId}_channel${channelId}`;
};

/**
 * Currently defaults custom domain to null
 * If custom domain is required this method can be modified to add support for custom domain
 * @param videoCenterId
 * @param videoId
 * @param env
 */
export const getVideoCenterVideoPageUrl = (videoCenterId, videoId, env): string => {
  if (!videoId) {
    throw new Error(VIDEO_ID_NULL);
  }
  let url = `${getVideoCenterMemberHomePageUrl(videoCenterId, {
    customDomain: null,
    absoluteUrl: true
  })}/${VIDEOS_PATH_PARAM}/${videoId}`;
  if (!isEmpty(env)) {
    url = `${url}?env=${env}`;
  }
  return url;
};

export const getVideoCenterVideoPageShortUrlTag = (videoCenterId, videoId): string => {
  if (!videoCenterId) {
    throw new Error(VIDEO_CENTER_ID_NULL);
  }
  if (!videoId) {
    throw new Error(VIDEO_ID_NULL);
  }
  return `videocenter${videoCenterId}_video${videoId}`;
};

export const getVideoCenterShortUrlTag = (videoCenterId): string => {
  if (!videoCenterId) {
    throw new Error(VIDEO_CENTER_ID_NULL);
  }
  return `videocenter${videoCenterId}`;
};
