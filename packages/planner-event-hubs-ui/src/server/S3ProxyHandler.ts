import { AuthClient, GrantedAccessToken } from '@cvent/auth-client';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { RESTDataSource } from '@dataSources/RESTDataSource/RESTDataSource';
import { cacheStore } from '@pages/api/graphql';
import { ApiError } from 'next/dist/server/api-utils';
import { IncomingHttpHeaders } from 'http';
import { S3ProxyCallbackPayload } from '@cvent/planner-event-hubs-model/types';

const LOG = LoggerFactory.create('S3ProxyHandler');

export abstract class S3ProxyHandler {
  centerId!: string;

  entityId!: string;

  environment!: string;

  // RED
  /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
  public context: any;

  // RED
  /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
  public static handlers: Record<string, any> = {};

  constructor(grantedAccessToken: GrantedAccessToken, centerId: string, entityId: string, environment: string) {
    this.centerId = centerId;
    this.entityId = entityId;
    this.environment = environment;
    this.context = {
      auth: grantedAccessToken,
      dataSources: {},
      headers: {},
      environment
    };
  }

  protected setupDataSource(name: string, dataSource: RESTDataSource, headers: IncomingHttpHeaders): void {
    LOG.debug('setting up DataSource ', name, this.context);
    this.context.dataSources[name] = dataSource;
    this.context.headers = headers;
    dataSource.initialize({ context: this.context, cache: cacheStore.getCache() });
  }

  public static isSupportedEntity(entityType: string): boolean {
    return this.handlers[entityType] !== undefined;
  }

  public static newEntityHandler(
    grantedAccessToken: GrantedAccessToken,
    entityType: string,
    centerId: string,
    entityId: string,
    environment: string
  ): S3ProxyHandler {
    if (!this.isSupportedEntity(entityType)) {
      throw new ApiError(400, 'Unsupported Entity');
    }
    const Klass = S3ProxyHandler.handlers[entityType];
    return new Klass(grantedAccessToken, centerId, entityId, environment);
  }

  public static async verifyAuthorization(
    authorization: string,
    authClient: AuthClient
  ): Promise<GrantedAccessToken | boolean> {
    LOG.info('verifying authorization header');
    const accessToken = authorization?.replace(/bearer\s*/i, '');
    try {
      return await authClient.verifyAccessToken({
        accessToken
      });
    } catch (e) {
      LOG.info('Error verifying bearer token', e);
      return false;
    }
  }

  // RED
  /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
  public async handleS3ProxyCallback?(
    headers: IncomingHttpHeaders,
    payload: S3ProxyCallbackPayload,
    // RED
    /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
    clients?: Record<string, any>
  ): Promise<void | boolean>;
}
