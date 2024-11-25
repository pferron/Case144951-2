import { GrantedAuthorization } from '@cvent/auth-client';

/**
 * When the grantedAuthorizations is changed, ensure the version number is incremented. This
 * guarantees the new grants are immediately used.
 * @returns number
 */
function getVersion(): number {
  return 1;
}

function getRoles(): string[] {
  return [];
}

function universalVideoGrant(): GrantedAuthorization {
  return {
    appId: Number(process.env.UNIVERSAL_VIDEO_APP_ID),
    roles: ['videos:read']
  };
}

function videoHubGrant(): GrantedAuthorization {
  return {
    appId: Number(process.env.VIDEO_HUB_SERVICE_APP_ID),
    roles: ['video-center:anonymous', 'video-center:read']
  };
}

function getGrantedAuthorizations(): GrantedAuthorization[] {
  return [universalVideoGrant(), videoHubGrant()];
}

const grantedAuthorizations = getGrantedAuthorizations();
const roles = getRoles();
const version = getVersion();
const applicationAllowedList = [];
export { grantedAuthorizations, roles, version, applicationAllowedList };
