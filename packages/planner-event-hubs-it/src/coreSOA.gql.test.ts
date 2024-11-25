import {
  accountConfig,
  userPermissions,
  accountLocale,
  accountDetails
} from '@cvent/planner-event-hubs-model/src/operations/coreSOA';
import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { skipItIfProdEnvironment } from '@utils/commonUtils';

let client;
let noAuthClient;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  noAuthClient = await connectToApiAsPlanner(unauthOptions);
});

describe('Graph objects for data from SOA services', () => {
  describe('accountConfig', () => {
    it('returns VideoCenter related AccountConfig data for planners', async () => {
      const response = await client.query({
        query: accountConfig
      });
      const config = response.data.accountConfig;
      expect(typeof config.AccountFeatures).toEqual('object');
      expect(typeof config.AccountFeatures.Blades).toEqual('object');
      expect(typeof config.AccountFeatures.Blades.AllowVideosBlade).toEqual('boolean');
      expect(typeof config.AccountFeatures.GeneralFeatures).toEqual('object');
      expect(typeof config.AccountFeatures.GeneralFeatures.AIWritingAssistantEnabled).toEqual('boolean');
      expect(typeof config.VideoManagementFeatures).toEqual('object');
      expect(typeof config.VideoManagementFeatures.VideoStorageSize).toEqual('number');
      expect(typeof config.VideoManagementFeatures.VideoCenterFlag).toEqual('boolean');
      expect(typeof config.InternationalSettings.DefaultLanguageId).toEqual('number');
      expect(typeof config.InternationalSettings.DefaultCultureCode).toEqual('string');
      expect(typeof config.EventFeatures.GeneralFeatures.LicenseTypeId).toEqual('number');
    });

    skipItIfProdEnvironment()('requires bearer to pass the account-configs:read role', async () => {
      // Red: Erroneous lint finding, setup done in beforeAll.
      // eslint-disable-next-line jest/no-standalone-expect
      await expect(async () => {
        await noAuthClient.query({
          query: accountConfig
        });
      }).rejects.toThrow('Not authorized');
    });
  });

  describe('userPermissions', () => {
    it('returns VideoCenter related UserPermissions for the logged-in planner', async () => {
      const response = await client.query({
        query: userPermissions
      });
      const config = response.data.userPermissions;
      expect(config.VideoCenter).toBeDefined();
      expect(config.VideoLibrary).toBeDefined();
      expect(config.VideoStorage).toBeDefined();
    });

    skipItIfProdEnvironment()('requires bearer to pass the user-permissions:read authorizationRule', async () => {
      // Red: Erroneous lint finding, setup done in beforeAll.
      // eslint-disable-next-line jest/no-standalone-expect
      await expect(async () => {
        await noAuthClient.query({
          query: userPermissions
        });
      }).rejects.toThrow('Not authorized');
    });
  });

  describe('Supported Locales', () => {
    describe('accountLocale', () => {
      it('returns AccountLocale data for planners', async () => {
        const response = await client.query({
          query: accountLocale
        });
        const config = response.data.accountLocale;
        expect(typeof config[0].IsDefault).toEqual('boolean');
        expect(typeof config[0].Locale).toEqual('object');
        expect(typeof config[0].Locale.Id).toEqual('number');
        expect(typeof config[0].Locale.LanguageName).toEqual('string');
        expect(typeof config[0].Locale.CountryLanguage).toEqual('string');
        expect(typeof config[0].Locale.CultureCode).toEqual('string');
        expect(typeof config[0].Locale.IsDefault).toEqual('boolean');
        expect(typeof config[0].Locale.LocalizationFlag).toEqual('boolean');
        expect(typeof config[0].Locale.AvailableCultures).toEqual('object');
        expect(typeof config[0].Locale.AvailableCultures[0].LocaleId).toEqual('number');
        expect(typeof config[0].Locale.AvailableCultures[0].CultureCountryId).toEqual('number');
        expect(typeof config[0].Locale.AvailableCultures[0].IsDefaultCulture).toEqual('boolean');
        expect(typeof config[0].Locale.AvailableCultures[0].CultureCode).toEqual('string');
      });

      skipItIfProdEnvironment()('requires bearer to pass the account-configs:read role', async () => {
        // Red: Erroneous lint finding, setup done in beforeAll.
        // eslint-disable-next-line jest/no-standalone-expect
        await expect(async () => {
          await noAuthClient.query({
            query: accountLocale
          });
        }).rejects.toThrow('Not authorized');
      });
    });
  });

  describe('accountDetails', () => {
    it('returns core accountDetails', async () => {
      const response = await client.query({
        query: accountDetails
      });
      const config = response.data.accountDetails;
      expect(typeof config.AccountId).toEqual('number');
      expect(typeof config.AccountName).toEqual('string');
      expect(typeof config.AccountStub).toEqual('string');
      expect(typeof config.AccountCompanyName).toEqual('string');
    });

    skipItIfProdEnvironment()('requires bearer to pass the account-configs:read role', async () => {
      // Red: Erroneous lint finding, setup done in beforeAll.
      // eslint-disable-next-line jest/no-standalone-expect
      await expect(async () => {
        await noAuthClient.query({
          query: accountDetails
        });
      }).rejects.toThrow('Not authorized');
    });
  });
});
