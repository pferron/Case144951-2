export type ApplicationAuthorization = {
  appId: number;
  roles: string[];
};

export type AccessToken = {
  accessToken: string;
  refreshToken?: string;
  csrfToken: string;
  created?: number;
  accessTokenTTL: number;
  refreshTokenTTL?: number;
};

export type Authorization = {
  metadata?: AuthMetadata;
  roles?: string[];
  grantedAuthorizations?: ApplicationAuthorization[];
};

export type AuthMetadata = {
  UserStub?: string;
  eventId?: string;
  UserLoginName?: string;
  LocaleId?: number;
  AccountId?: number;
  IsLoggedInFromCvii?: boolean;
  isSelfServiceLicense?: boolean;
  environment?: string;
  accountStub?: string;
  platformUserId?: string;
  accountMappingId: string;
  locale?: string;
};

export type Auth = {
  appId: number;
  created: number;
  lastModified: number;
  apiKey: string;
  apiSecret: string;
  accessToken: string;
  refreshToken: string;
  csrfToken: string;
  accessTokenTTL: number;
  refreshTokenTTL: number;
  authorization: Authorization;
};
