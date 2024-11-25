import {
  AccountLocale,
  AccountVideoCenterConfig,
  Resolvers,
  UserPermissions,
  UserSoaPermissions,
  AccountDetails
} from '@cvent/planner-event-hubs-model/types';

const applyPermissions = (
  userSOAPermissions: UserSoaPermissions,
  accountConfig: AccountVideoCenterConfig
): UserPermissions => {
  const appliedPermissions: UserPermissions = {
    VideoCenter: false,
    VideoLibrary: false,
    VideoStorage: false,
    EventsPlusCustomHeader: false
  };

  if (!accountConfig?.AccountFeatures?.Blades?.AllowVideosBlade) {
    return appliedPermissions;
  }

  if (
    accountConfig?.VideoManagementFeatures?.VideoCenterFlag &&
    userSOAPermissions?.Permissions?.CVENT_VIDEO_CENTER_ACCESS === 1
  ) {
    appliedPermissions.VideoCenter = true;
    if (userSOAPermissions?.Permissions?.CVENT_EVENTS_PLUS_CUSTOM_HEADER === 1) {
      appliedPermissions.EventsPlusCustomHeader = true;
    }
  }

  if (userSOAPermissions?.Permissions?.CVENT_VIDEO_LIBRARY_ACCESS === 1) {
    appliedPermissions.VideoLibrary = true;
  }

  if (userSOAPermissions?.Permissions?.CVENT_VIDEO_STORAGE_MANAGEMENT === 1) {
    appliedPermissions.VideoStorage = true;
  }

  return appliedPermissions;
};

const resolver: Resolvers = {
  Query: {
    accountConfig: async (_parent, _args, { dataSources }, _info): Promise<AccountVideoCenterConfig> => {
      return dataSources.accountSOAClient.getAccountConfig();
    },
    userPermissions: async (_parent, _args, { dataSources }, _info): Promise<UserPermissions> => {
      const userPermissions = await dataSources.userSOAClient.getPermissions();
      const accountConfig = await dataSources.accountSOAClient.getAccountConfig();

      return applyPermissions(userPermissions, accountConfig);
    },
    accountLocale: async (_parent, _args, { dataSources }, _info): Promise<AccountLocale[]> => {
      return dataSources.accountSOAClient.getAccountLocale();
    },
    accountDetails: async (_parent, _args, { dataSources }, _info): Promise<AccountDetails> => {
      return dataSources.accountSOAClient.getAccountDetails();
    }
  }
};

export default resolver;
