import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { UserSoaPermissions, UserDetails } from '@cvent/planner-event-hubs-model/types';
import { getAccountId } from '@utils/authUtils';
import { CvestDataSource } from '@dataSources/CvestDataSource';
import { RequestOptions } from '@dataSources/RESTDataSource/RESTDataSource';
import { normalizeRawOrJSONResponseToJSON } from '../../../server/utils';

const LOG = LoggerFactory.create('user-soa-client');

export class UserSOAClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.USER_SOA_SERVICE}/v1`;
  }

  /**
   * Fetches Permissions from User SOA.  Returns very small set
   * of User SOA data, just what's needed by VideoCenter today.
   *
   * @returns UserPermissions
   */
  public async getPermissions(): Promise<UserSoaPermissions> {
    LOG.debug('getPermissions()');
    // RED
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = normalizeRawOrJSONResponseToJSON(await this.get('/permissions')) as any;

    return {
      AccountId: response.AccountId,
      RoleStub: response.RoleStub,
      EventRoleStubs: response.EventRoleStubs,
      Permissions: {
        CVENT_VIDEO_LIBRARY_ACCESS: response.Permissions.CVENT_VIDEO_LIBRARY_ACCESS,
        CVENT_VIDEO_CENTER_CONFIGURATION: response.Permissions.CVENT_VIDEO_CENTER_CONFIGURATION,
        CVENT_VIDEO_CENTER_CREATION: response.Permissions.CVENT_VIDEO_CENTER_CREATION,
        CVENT_VIDEO_UPLOAD: response.Permissions.CVENT_VIDEO_UPLOAD,
        CVENT_VIDEO_EDIT: response.Permissions.CVENT_VIDEO_EDIT,
        CVENT_VIDEO_CENTER_ACCESS: response.Permissions.CVENT_VIDEO_CENTER_ACCESS,
        CVENT_VIDEO_STORAGE_MANAGEMENT: response.Permissions.CVENT_VIDEO_STORAGE_MANAGEMENT,
        CVENT_EVENTS_PLUS_CUSTOM_HEADER: response.Permissions.CVENT_EVENTS_PLUS_CUSTOM_HEADER
      }
    };
  }

  public setStandardHeaders(request: RequestOptions): void {
    request.headers.set('Account-Id', getAccountId(this.context.auth));
    super.setStandardHeaders(request);
  }

  public async getDetails(userStub): Promise<UserDetails> {
    LOG.debug('getDetails - Full list info of user');
    return this.get('/FullInfoList', { userStub });
  }
}
