import { CvestDataSource } from '@dataSources/CvestDataSource';
import { getRequestOptionsWithCacheOptions } from '@utils/util';
import { CustomDomain, CustomDomainMapping } from '@cvent/planner-event-hubs-model/types';
import { getAccountId } from '@resolvers/common/utils/authMetadataUtils';
import { NOT_FOUND_ERROR_CODE } from '@utils/constants';

export class CustomDomainServiceClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.CUSTOM_DOMAIN_SERVICE_URL}/v1`;
  }

  getCustomDomainForHub = async (hubId: string): Promise<CustomDomainMapping> => {
    try {
      const response = await this.get(
        `/custom-domains/events-plus/${hubId}`,
        {},
        getRequestOptionsWithCacheOptions(true)
      );
      return {
        customDomainId: response.accountDomain.id,
        entityId: response.id,
        trailingName: response.customUrlName
      };
    } catch (error) {
      if (error.code === NOT_FOUND_ERROR_CODE) {
        return null;
      }
      throw error;
    }
  };

  getCustomDomainForAccount = async (): Promise<Array<CustomDomain>> => {
    const accountId = getAccountId(this.context.auth);
    return this.get(
      `/custom-domain/${accountId}`,
      {},
      getRequestOptionsWithCacheOptions(true, { headers: { authorization: `API_KEY ${process.env.API_KEY}` } })
    );
  };

  createCustomDomainMapping = async (hubCustomDomain: CustomDomainMapping): Promise<CustomDomainMapping> => {
    const response = await this.post(
      `/custom-domains/events-plus/${hubCustomDomain.entityId}`,
      {
        accountDomain: { id: hubCustomDomain.customDomainId },
        landingPageId: 0,
        customUrlName: hubCustomDomain.trailingName
      },
      getRequestOptionsWithCacheOptions(false, {})
    );
    return {
      customDomainId: response.accountDomain.id,
      entityId: response.id,
      trailingName: response.customUrlName
    };
  };

  updateCustomDomainMapping = async (hubCustomDomain: CustomDomainMapping): Promise<CustomDomainMapping> => {
    const response = await this.put(
      `/custom-domains/events-plus/${hubCustomDomain.entityId}`,
      {
        accountDomain: { id: hubCustomDomain.customDomainId },
        landingPageId: 0,
        customUrlName: hubCustomDomain.trailingName
      },
      getRequestOptionsWithCacheOptions(false, {})
    );
    return {
      customDomainId: response.accountDomain.id,
      entityId: response.id,
      trailingName: response.customUrlName
    };
  };

  deleteCustomDomainMapping = async (hubId: string): Promise<boolean> => {
    await this.delete(`/custom-domains/events-plus/${hubId}`);
    return true;
  };
}
