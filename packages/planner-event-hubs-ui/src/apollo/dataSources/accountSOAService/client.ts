import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { AccountLocale, AccountVideoCenterConfig, AccountDetails } from '@cvent/planner-event-hubs-model/types';
import { CvestDataSource } from '@dataSources/CvestDataSource';
import { normalizeRawOrJSONResponseToJSON } from '@server/utils';

const LOG = LoggerFactory.create('account-soa-client');

export class AccountSOAClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.ACCOUNT_SOA_SERVICE}/v1`;
  }

  /**
   * Fetches AccountConfig from Account SOA. Returns very small set
   * of AccountConfig data, just what's needed by VideoCenter today.
   *
   * @returns AccountConfig
   */
  public async getAccountConfig(): Promise<AccountVideoCenterConfig> {
    LOG.debug('getAccountConfig()');

    // RED
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = normalizeRawOrJSONResponseToJSON(await this.get('/accountconfig')) as any;

    return {
      AccountFeatures: {
        GeneralFeatures: {
          AIWritingAssistantEnabled: response?.AccountFeatures?.GeneralFeatures?.AIWritingAssistantEnabled,
          AllowCodeSnippets: response?.AccountFeatures?.GeneralFeatures?.AllowCodeSnippets,
          AllowCustomFonts: response?.AccountFeatures?.GeneralFeatures?.AllowCustomFonts,
          AllowGoogleAnalytics: response?.AccountFeatures?.GeneralFeatures?.AllowGoogleAnalytics,
          AllowOAuth: response?.AccountFeatures?.GeneralFeatures?.AllowOAuth
        },
        Blades: {
          AllowVideosBlade: response?.AccountFeatures?.Blades?.AllowVideosBlade
        }
      },
      VideoManagementFeatures: {
        VideoStorageSize: response?.VideoManagementFeatures?.VideoStorageSize,
        VideoCenterFlag: response?.VideoManagementFeatures?.VideoCenterFlag
      },
      InternationalSettings: {
        DefaultLanguageId: response?.AccountFeatures?.InternationalSettings?.DefaultLanguageId,
        DefaultCultureCode: response?.AccountFeatures?.InternationalSettings?.DefaultCultureCode
      },
      EventFeatures: {
        GeneralFeatures: {
          LicenseTypeId: response?.EventFeatures?.GeneralFeatures?.LicenseTypeId
        }
      }
    };
  }

  /**
   * Fetches AccountLocale from Account SOA.
   *
   * @returns AccountLocale
   */
  public async getAccountLocale(): Promise<AccountLocale[]> {
    LOG.debug('getAccountLocale()');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return normalizeRawOrJSONResponseToJSON(await this.get('/accountlocale')) as any;
  }

  /**
   * Fetches AccountDetails from Account SOA.
   *
   * @returns AccountLocale
   */
  public async getAccountDetails(): Promise<AccountDetails> {
    LOG.debug('getAccountDetails()');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return normalizeRawOrJSONResponseToJSON(await this.get('/accountdetailextended')) as any;
  }
}
