import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { GrantedAccessToken } from '@cvent/auth-client';
import { AUTH_COOKIE_MAX_AGE } from '@utils/constants';
import { RequestOptions, RESTDataSource } from '../RESTDataSource/RESTDataSource';

const LOG = LoggerFactory.create('auth-api');

/**
 * This class does not extend CvestDataSource because we don't want to set all the same headers and params from here.
 * The intent of this class is to provide a path to generate a bearer for public/anonymous users when visiting a public Video Center.
 *
 * This class also provides a clear and concise example of a DataSource that does not use CvestDataSource.
 *
 * If further work is needed here, consider removing this class and using @cvent/auth-client instead.
 */
export class AuthClient extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.AUTH_SERVICE}/v1`;
  }

  public willSendRequest(request: RequestOptions): void {
    this.setStandardHeaders(request);
  }

  public setStandardHeaders(request: RequestOptions): void {
    request.headers.set('Authorization', `API_KEY ${process.env.API_KEY}`);
  }

  // TODO: remove publicLogin from authService
  public async publicLogin(
    hubId: string,
    environment: string,
    accountMappingId: string,
    accountId: string
  ): Promise<GrantedAccessToken> {
    LOG.debug('publicLogin sending metadata', { accountMappingId, hubId, environment, accountId });
    return this.post(`/access_token?accessTokenTTL=${AUTH_COOKIE_MAX_AGE}`, {
      metadata: {
        accountMappingId,
        VideoCenterId: hubId,
        environment,
        accountId,
        AccountId: accountId
      },
      grantedAuthorizations: [
        {
          appId: process.env.VIDEO_HUB_SERVICE_APP_ID,
          roles: ['video-center:anonymous']
        },
        {
          appId: process.env.UNIVERSAL_VIDEO_APP_ID,
          roles: ['videos:read']
        },
        {
          appId: process.env.UNIVERSAL_CONTACTS_APP_ID,
          roles: ['contacts:read']
        }
      ]
    });
  }

  public async verifyToken(accessToken: string): Promise<GrantedAccessToken> {
    LOG.debug('verifying Token');
    return this.get(`/access_token/${accessToken}/verify`);
  }

  public async accessTokenRefresh(accessToken: string): Promise<void> {
    LOG.debug('accessToken Refreshing');
    return this.put(`/access_token/${accessToken}/refresh`);
  }
}
