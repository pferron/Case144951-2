import { CvestDataSource } from '@dataSources/CvestDataSource';
import { RequestOptions } from '@dataSources/RESTDataSource/RESTDataSource';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { isEmpty } from 'lodash';

const LOG = LoggerFactory.create('identity-mapping-client');

export class IdentityMappingClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.IDENTITY_MAPPING_SERVICE_URL}/v2`;
  }

  public setStandardHeaders(request: RequestOptions): void {
    request.headers.set('x-skip-cache', '1');
    request.headers.set('Authorization', `API_KEY ${process.env.API_KEY}`);
    this.setLoggingHeaders(request);
  }

  public async getAccountId(accountMappingId: string, environment: string): Promise<string> {
    LOG.info('getAccountId(accountMappingId, environment)', accountMappingId, environment);
    const currentEnvironment = process.env.EXPERIMENT_ENVIRONMENT;
    const response = await this.get(`accountmapping/${accountMappingId}`, {
      environment: isEmpty(environment) ? currentEnvironment : environment
    });
    let accountId = '';
    if (response.accounts) {
      const coreAccounts = response.accounts.filter(obj => {
        return obj.type === 'CORE';
      });
      accountId = coreAccounts[0].id;
    }
    return accountId;
  }
}
