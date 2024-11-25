const getAuthMetadata = (auth): Record<string, string> => {
  return auth?.authorization?.metadata || {};
};

const getEnvironment = (auth): string => {
  return getAuthMetadata(auth)?.environment;
};

const getAccessToken = (auth): string => {
  return auth?.accessToken;
};

const getAccountMappingId = (auth): string => {
  return auth?.authorization?.metadata?.accountMappingId;
};

const getMemberId = (auth): string => {
  return auth?.authorization?.metadata?.MemberId;
};

const getAccountId = (auth): string => {
  return auth?.authorization?.metadata.AccountId ?? auth?.authorization?.metadata.accountId;
};

const checkMemberId = (auth): boolean => {
  return getMemberId(auth) != null;
};

export {
  getEnvironment,
  getAccessToken,
  getAccountMappingId,
  getAuthMetadata,
  getMemberId,
  getAccountId,
  checkMemberId
};
