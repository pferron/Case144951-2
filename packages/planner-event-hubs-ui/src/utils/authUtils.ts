import { AuthClient, GrantedAccessToken } from '@cvent/auth-client';
import { validateAndGetEnvironmentVariables } from '@cvent/nextjs/utils/validateAndGetEnvironmentVariables';
import { NextApiRequest } from 'next';
import { ApplicationAuthorization } from '@utils/authTypes';

let authClient: AuthClient = null;

export async function verifyAccessTokenHelper(accessToken: string): Promise<GrantedAccessToken> {
  if (!authClient) {
    const [endpoint, apiKey] = validateAndGetEnvironmentVariables('AUTH_SERVICE', 'API_KEY');
    authClient = new AuthClient({
      endpoint,
      apiKey,
      cacheOptions: {}
    });
  }
  return authClient.verifyAccessToken({
    accessToken,
    refreshAccessToken: true
  });
}

export const extractAccessToken = (req: NextApiRequest): string => {
  return req.headers.authorization?.toLowerCase()?.replace('bearer ', '').trim() ?? undefined;
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const hasAuthMetadata = (auth: Record<string, any>): boolean => {
  return !!auth?.authorization?.metadata;
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAuthMetadata = (auth: Record<string, any>): any => {
  return auth?.authorization?.metadata || {};
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAccessToken = (auth: Record<string, any>): string => {
  return auth.accessToken;
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAccountMappingId = (auth: Record<string, any>): string => {
  return getAuthMetadata(auth).accountMappingId || '';
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isCviiLogin = (auth: Record<string, any>): boolean => {
  return !!getAuthMetadata(auth).IsLoggedInFromCvii;
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getAccountId = (auth: Record<string, any>): string => {
  return getAuthMetadata(auth).AccountId || '';
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getEnvironment = (auth: Record<string, any>): string => {
  return getAuthMetadata(auth).environment;
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPlatformUserId = (auth: Record<string, any>): string => {
  return getAuthMetadata(auth).platformUserId || '';
};

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getUserStub = (auth: Record<string, any>): string => {
  const authMetadata = getAuthMetadata(auth);
  return authMetadata.UserStub || authMetadata.userStub || '';
};

// Default locale -> en-US
const DEFAULT_LOCALE = 'en-US';

// RED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getLocale = (auth: Record<string, any>): any => {
  return getAuthMetadata(auth).locale || DEFAULT_LOCALE;
};

export const isSelfServiceAccount = (auth): boolean => {
  return !!getAuthMetadata(auth).isSelfServiceLicense;
};

/**
 * This function is responsible for returning granted authorizations for universal video for video replace functionality
 * */
export const universalVideoGrant: ApplicationAuthorization[] = [
  {
    appId: Number(process.env.UNIVERSAL_VIDEO_SERVICE_APP_ID),
    roles: ['videos:write', 'videos:read', 'video:ignore-storage-quota']
  }
];
