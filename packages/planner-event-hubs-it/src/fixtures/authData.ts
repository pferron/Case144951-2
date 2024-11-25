const { BASE_URL } = process.env;

export const ROUTE_COOKIE = process.env.CVENT_VERSION ? ` CVENT_VERSION=${process.env.CVENT_VERSION}` : '';
export const gqlBasePath = `${BASE_URL}`;
export const roles = ['IS_PLANNER'];

export const videoHubServiceAppId = parseInt(process.env.VIDEO_HUB_SERVICE_APP_ID, 10);
export const universalVideoAppId = parseInt(process.env.UNIVERSAL_VIDEO_APP_ID, 10);
export const eventHubsAppId = parseInt(process.env.EVENT_HUBS_APP_ID, 10);
export const universalContactsAppId = parseInt(process.env.UNIVERSAL_CONTACTS_APP_ID, 10);
export const customDomainServiceAppId = parseInt(process.env.CUSTOM_DOMAIN_SERVICE_APP_ID, 10);

export const metadata = {
  AccountId: parseInt(`${process.env.TEST_ACCOUNT_ID}`, 10),
  accountMappingId: process.env.TEST_ACCOUNT_MAPPING_ID,
  accountStub: 'cd78dd5d-6522-4e91-8db8-104df6b84ec2',
  environment: process.env.ENVIRONMENT_NAME,
  locale: 'en-US',
  UserLoginName: process.env.TEST_ACCOUNT_USERNAME,
  LocalId: '1033',
  UserStub: process.env.TEST_ACCOUNT_USER_STUB
};

export const metadataATestAccount = {
  UserLoginName: process.env.TEST_ACCOUNT_USERNAME2,
  AccountId: parseInt(`${process.env.TEST_ACCOUNT_ID2}`, 10),
  environment: process.env.ENVIRONMENT_NAME,
  accountStub: '682d5c0f-e0d6-48a8-a609-8328cd25bc1e',
  accountMappingId: process.env.TEST_ACCOUNT_MAPPING_ID2,
  locale: 'en-US'
};

export const grantedAuthorizations = [
  {
    appId: eventHubsAppId,
    roles: [
      'account-config:read',
      'user-permissions:read',
      'contacts:read',
      'contact-groups:read',
      'contact-types:read',
      'video-center:read',
      'video-center:write',
      'videos:read',
      'videos:write'
    ]
  },
  {
    appId: videoHubServiceAppId,
    roles: [
      'video-center:anonymous',
      'video-center:write',
      'video-hubs:write',
      'video-center:read',
      'video-hubs:read',
      // This role is additional the roles added in normandy
      'video-hubs:member'
    ]
  },
  {
    appId: universalVideoAppId,
    roles: ['videos:write', 'videos:read']
  },
  {
    appId: universalContactsAppId,
    roles: ['contacts:read', 'contact-groups:read', 'contact-types:read']
  },
  {
    appId: customDomainServiceAppId,
    roles: ['DOMAIN_READ_WRITE', 'DOMAIN_DELETE']
  }
];
