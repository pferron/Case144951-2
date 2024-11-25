import { getConfigs } from './testConfig';

export const roles = ['IS_PLANNER'];

export function getMetadata() {
  const configs = getConfigs();
  const accountId = Number(configs.testUsers.accountId);
  return {
    LocaleId: configs.testUsers.localeId,
    AccountId: accountId,
    UserLoginName: configs.testUsers.plannerEmail,
    UserStub: configs.testUsers.userStub,
    environment: configs.silo,
    accountMappingId: configs.testUsers.accountMappingId,
    accountStub: configs.testUsers.accountStub,
    IsLoggedInFromCvii: true,
    locale: 'en-US'
  };
}

export const grantedAuthorizations = [
  {
    appId: Number(process.env.UNIVERSAL_VIDEO_SERVICE_APP_ID),
    roles: ['videos:read', 'videos:write']
  },
  {
    appId: Number(process.env.VIDEO_HUB_SERVICE_APP_ID),
    roles: ['video-hubs:write', 'video-hubs:read', 'video-center:anonymous', 'video-center:read', 'video-center:write']
  },
  {
    appId: Number(process.env.EVENT_HUBS_APP_ID),
    roles: [
      'account-config:read',
      'user-permissions:read',
      'videos:read',
      'videos:write',
      'video-center:read',
      'video-center:write'
    ]
  },
  {
    appId: Number(process.env.CUSTOM_DOMAIN_SERVICE_APP_ID),
    roles: ['DOMAIN_READ_WRITE', 'DOMAIN_DELETE']
  }
];
