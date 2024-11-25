import { ACCOUNT_BEARER_CACHE_TTL, SUBSCRIPTION_TOKEN_TTL } from '@utils/constants';

export interface CacheConfig {
  key: string;
  options?: { ttl?: number };
}

export const getS3ProxyCacheKey = (fullFilePath: string): CacheConfig => {
  return {
    key: `tempimagecache:${fullFilePath}`,
    options: { ttl: Number(process.env.S3_PROXY_CALLBACK_PAYLOAD_TTL) }
  };
};

export const getAccountBearerCacheKey = (videoCenterId: string, memberId: string): CacheConfig => {
  return {
    key: `accountBearerToken:${videoCenterId}:${memberId}`,
    options: { ttl: ACCOUNT_BEARER_CACHE_TTL }
  };
};

export const getSubscriptionCacheKey = (oneTimeToken: string, centerId: string, contactId: string): CacheConfig => {
  return {
    key: `OneTimeToken::${oneTimeToken}::center::${centerId}::contact::${contactId}`,
    options: { ttl: SUBSCRIPTION_TOKEN_TTL }
  };
};
