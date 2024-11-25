import {
  BannerIdAssociationCreate,
  BannerSearch,
  ChannelOrderInput,
  FileImportHistoryInput,
  FilterInput,
  Hubs,
  SettingsInput,
  TranslationInput,
  UpdateRegistrationFormSettingInput
} from '@cvent/planner-event-hubs-model/types';
import { randomUUID } from 'crypto';
import { RegistrationFieldCode } from '@cvent/planner-event-hubs-model/src/types';
import { memberListFilter, VideoCenterClient } from '../../videoCenterService/client';

let dataSource: VideoCenterClient;
let hubId: string;
let pageId: string;
let sectionId: string;

// Mocking approach inspired by https://github.com/NickTomlin/apollo-datasource-rest-testing/blob/master/__tests__/dataSourceTestUtil.ts
beforeEach(() => {
  dataSource = new VideoCenterClient();
  // Manually set context on the data source since it is not attached to an ApolloServer instance
  dataSource.context = {};
  hubId = '1234-abcd';
  pageId = '5678-efgh';
  sectionId = '2345-yuio';
});

describe('Fetching data', () => {
  beforeEach(() => {
    dataSource.get = jest.fn().mockImplementation(async () => null);
    dataSource.put = jest.fn().mockImplementation(async () => null);
    dataSource.post = jest.fn().mockImplementation(async () => null);
  });
  describe('getHub(hubId)', () => {
    it('sends GET /{hubId}', async () => {
      await dataSource.getHub(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/hubs/${hubId}`, {}, { headers: { 'x-skip-cache': '1' } });
    });
  });

  describe('getHubs()', () => {
    const input: Hubs = [];
    it('sends GET /', async () => {
      await dataSource.getHubs(input);
      expect(dataSource.get).toHaveBeenCalledWith('/hubs/', input);
    });
  });

  describe('filterChannels(hubId, filterInput)', () => {
    it('sends GET /channels', async () => {
      const filterInput: FilterInput = {
        filter: 'title',
        sort: 'asc',
        limit: 100
      };
      const filterInputExpected: FilterInput = {
        filter: `title AND hubId eq '${hubId}'`,
        sort: 'asc',
        limit: 100
      };
      await dataSource.filterChannels(hubId, filterInput);
      expect(dataSource.get).toHaveBeenCalledWith('/channels', filterInputExpected, {
        headers: { 'x-skip-cache': '1' }
      });
    });
  });

  describe('getHubPages(hubId)', () => {
    it('sends GET /channels', async () => {
      const serviceResponse = { data: [], paging: { currentToken: '' } };
      dataSource.get = jest.fn().mockImplementation(async () => serviceResponse);
      await dataSource.getHubPages(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(
        '/channels',
        {
          filter: `hubId eq '${hubId}'`,
          token: undefined
        },
        { headers: { 'x-skip-cache': '1' } }
      );
    });
    it('sends GET /{hubId}/channels and loops through more than one page', async () => {
      const serviceResponse = {
        data: [{ id: 'not-real', title: 'before' }],
        paging: { currentToken: 'a', nextToken: 'b' }
      };
      const serviceResponseTwo = { data: [{ id: 'really-not-real', title: 'nice' }], paging: { currentToken: 'b' } };
      dataSource.get = jest
        .fn()
        .mockImplementationOnce(async () => serviceResponse)
        .mockImplementationOnce(async () => serviceResponseTwo);
      await dataSource.getHubPages(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(
        '/channels',
        {
          token: 'b'
        },
        { headers: { 'x-skip-cache': '1' } }
      );
      expect(dataSource.get).toHaveBeenCalledTimes(2);
    });
  });

  describe('getHubPagesWithBanner(hubId)', () => {
    it('sends GET /channels and GET /banners/associations', async () => {
      const serviceResponse = { data: [], paging: { currentToken: '' } };
      const bannerId = '1234-abcd';
      const bannerAssociationSearch = {
        bannerId,
        centerId: hubId
      };
      const bannerHubSearch = {
        hubId,
        bannerId
      };
      dataSource.get = jest.fn().mockImplementation(async () => serviceResponse);
      await dataSource.getHubPagesWithBanner(bannerHubSearch);
      expect(dataSource.get).toHaveBeenNthCalledWith(
        1,
        '/channels',
        {
          filter: `hubId eq '${hubId}'`
        },
        { headers: { 'x-skip-cache': '1' } }
      );
      expect(dataSource.get).toHaveBeenNthCalledWith(
        2,
        `/video-hubs/${bannerAssociationSearch.centerId}/banners/associations`,
        bannerAssociationSearch
      );
    });
  });

  describe('getHubSettings(hubId)', () => {
    it('sends GET /{hubId}/settings', async () => {
      await dataSource.getHubSettings(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/settings`);
    });
  });

  describe('getBannerAssociations(bannerCarouselSearch)', () => {
    it('sends GET /{bannerSearch.centerId}/banners/associations', async () => {
      const bannerAssociationSearch = {
        centerId: hubId,
        limit: 1,
        entityType: 'Homepage'
      };
      await dataSource.getBannerAssociations(bannerAssociationSearch);
      expect(dataSource.get).toHaveBeenCalledWith(
        `/video-hubs/${bannerAssociationSearch.centerId}/banners/associations`,
        bannerAssociationSearch
      );
    });
  });

  describe('getHubBanners(bannerSearch)', () => {
    let bannerSearch: BannerSearch;
    beforeEach(() => {
      bannerSearch = {
        hubId
      };
    });

    it('sends GET /{bannerSearch.hubId}/banners', async () => {
      await dataSource.getHubBanners(bannerSearch);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/banners`, {});
    });

    it('includes limit param when available in bannerSearch', async () => {
      bannerSearch.limit = 100;
      await dataSource.getHubBanners(bannerSearch);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/banners`, { limit: bannerSearch.limit });
    });

    it('includes token param when available in bannerSearch', async () => {
      bannerSearch.token = 'stable-coin';
      await dataSource.getHubBanners(bannerSearch);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/banners`, { token: bannerSearch.token });
    });

    it('includes both limit and token when available in bannerSearch', async () => {
      bannerSearch.token = 'gesture';
      bannerSearch.limit = 50;
      await dataSource.getHubBanners(bannerSearch);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/banners`, {
        token: bannerSearch.token,
        limit: bannerSearch.limit
      });
    });
  });

  describe('getHubTermsEditPermission(hubId)', () => {
    it('sends GET /{hubId}/allow-terms-update', async () => {
      await dataSource.getHubTermsEditPermission(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/allow-terms-update`);
    });
  });

  describe('getGoogleAnalytics(hubId)', () => {
    it('sends GET /{hubId}/google-analytics', async () => {
      await dataSource.fetchGoogleAnalytics(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/google-analytics`);
    });
  });

  describe('filterMemberList(input)', () => {
    it('sends POST /{hubId}/members/filter?limit={input.pageLimit} with the filter as request body', async () => {
      const input = {
        centerId: hubId,
        searchTerm: 'abc',
        pageLimit: 10
      };
      const filter = memberListFilter(input.searchTerm);
      await dataSource.filterMemberList(input);
      expect(dataSource.post).toHaveBeenCalledWith(`/hubs/${hubId}/members/filter?limit=${input.pageLimit}`, {
        filter
      });
    });
  });

  describe('getMemberProfile(hubId, contactId)', () => {
    it('sends GET /{hubId}/contacts/{contactId}/profile', async () => {
      const contactId = 'ET-phone-home';
      await dataSource.getMemberProfile(hubId, contactId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/contacts/${contactId}/profile`);
    });
  });

  describe('getCodeSnippets(hubId)', () => {
    it('sends GET /{hubId}/code-snippets', async () => {
      await dataSource.getCodeSnippets(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/code-snippets`);
    });
  });

  describe('getRegistrationFormSettings(hubId)', () => {
    it('sends GET /{hubId}/registration-form-fields', async () => {
      await dataSource.getRegistrationFormSettings(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/registration-form-fields`);
    });
  });

  describe('getHubTermsOfUse(hubId, contactId)', () => {
    it('sends GET /{hubId}/contacts/{contactId}/terms-consent', async () => {
      const contactId = 'ET-phone-home';
      await dataSource.getHubTermsOfUse(hubId, contactId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/contacts/${contactId}/terms-consent`);
    });
  });

  describe('initiateMemberLogin(memberLoginInput)', () => {
    it('sends POST /{hubId}/login-request', async () => {
      const memberLoginInput = {
        hubId,
        memberInfo: {
          firstName: 'Fred',
          lastName: 'Flintstone',
          email: 'fred@flintstones.bedrock'
        }
      };
      await dataSource.initiateMemberLogin(memberLoginInput);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/login-request`, memberLoginInput.memberInfo);
    });
  });

  describe('filterHubs(filterInput)', () => {
    it('sends GET /video-hubs?filter={filterInput}', async () => {
      const filterInput = {
        filter: 'id eq "d3422b98-ac69-4a67-ac75-142c7abfc978"'
      };
      await dataSource.filterHubs(filterInput);
      expect(dataSource.get).toHaveBeenCalledWith('/video-hubs', filterInput);
    });
  });

  describe('getEmailDomains(input)', () => {
    it('sends GET /{hubId}/email-domains', async () => {
      const input = {
        id: hubId
      };
      await dataSource.getEmailDomains(input);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/email-domains`);
    });
  });

  describe('getAllowedContactGroups(input)', () => {
    it('sends GET /{hubId}/contact-groups', async () => {
      const input = {
        id: hubId
      };
      await dataSource.getAllowedContactGroups(input);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/contact-groups`);
    });
  });

  describe('getAllowedContactTypes(input)', () => {
    it('sends GET /{hubId}/contact-types', async () => {
      const input = {
        id: hubId
      };
      await dataSource.getAllowedContactTypes(input);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/contact-types`);
    });
  });

  describe('getBlockedContacts(input)', () => {
    it('sends GET /{hubId}/blocked-contacts', async () => {
      const input = {
        id: hubId
      };
      await dataSource.getBlockedContacts(input);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/blocked-contacts`);
    });
  });

  describe('updateMemberStatus(hubId, request)', () => {
    it('sends PUT /video-hubs/{hubId}/members/status with request body', async () => {
      const request = {
        memberIds: ['member1', 'member2'],
        status: 'DELETED'
      };
      await dataSource.updateMemberStatus(hubId, request);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/members/status`, request);
    });
  });

  describe('getBlockedContactGroups(input)', () => {
    it('sends GET /{hubId}/blocked-contact-groups', async () => {
      const input = {
        id: hubId
      };
      await dataSource.getBlockedContactGroups(input);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/blocked-contact-groups`);
    });
  });

  describe('listVideoHubsInBatches(videoHubIds)', () => {
    it('sends GET /video-hubs with chunks of hubIds as filter query', async () => {
      const videoHubIds: string[] = [];
      let batchOneFilter = '';
      let batchTwoFilter = '';
      while (videoHubIds.length < 36) {
        const id = randomUUID();
        videoHubIds.push(id);
        if (videoHubIds.length <= 35) {
          batchOneFilter = batchOneFilter.length > 0 ? `${batchOneFilter} or id eq '${id}'` : `id eq '${id}'`;
        } else {
          batchTwoFilter = `id eq '${id}'`;
        }
      }
      await dataSource.listVideoHubsInBatches(videoHubIds);
      expect(dataSource.get).toHaveBeenNthCalledWith(1, `/video-hubs`, { filter: batchOneFilter });
      expect(dataSource.get).toHaveBeenNthCalledWith(2, `/video-hubs`, { filter: batchTwoFilter });
    });
  });

  describe('getHubLocales(hubId)', () => {
    it('sends GET /{hubId}/locales', async () => {
      await dataSource.listHubLocales(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/locales`);
    });
  });

  describe('getHubLocalesDetailed(hubId)', () => {
    it('sends GET /{hubId}/locales/detailed', async () => {
      await dataSource.listHubLocalesDetailed(hubId);
      expect(dataSource.get).toHaveBeenCalledWith(`/video-hubs/${hubId}/locales/detailed`);
    });
  });

  describe('getUtmOverrides(centerId)', () => {
    it('sends GET /video-hubs/{hubId}/utm-overrides', async () => {
      await dataSource.getUtmOverrides(hubId);
      expect(dataSource.get).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/utm-overrides`);
    });
  });

  describe('getTranslations(centerId, locale, translationFilter, typeFilter, limit, sortDirection, token)', () => {
    it('sends GET /video-hubs/{hubId}/translations/{locale}', async () => {
      await dataSource.getTranslations(hubId, 'en-US', 'ALL', 'ALL', 'search', 10, 'ASC', 'token');
      expect(dataSource.get).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/translations/en-US`, {
        limit: 10,
        sort: 'ASC',
        token: 'token',
        translations: 'ALL',
        type: 'ALL',
        translationText: 'search'
      });
    });
  });

  describe('getPage(centerId)', () => {
    it('sends GET /video-hubs/{hubId}/pages', async () => {
      await dataSource.getPage(hubId);
      expect(dataSource.get).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/pages`);
    });
  });

  describe('File Import History', () => {
    it('sends GET /file-import/video-hubs/{hubId}/history/{schemaName}', async () => {
      const schemaName = 'video-hub-translation-import';
      const fileImportHistoryInput: FileImportHistoryInput = { locale: 'en-US', schemaName };

      await dataSource.getFileImportHistory(hubId, fileImportHistoryInput);

      expect(dataSource.get).toHaveBeenCalledWith(`/file-import/video-hubs/${hubId}/history/${schemaName}`, {
        locale: fileImportHistoryInput.locale
      });
    });
  });
});

describe('Updating data', () => {
  let hubData: object;

  beforeEach(async () => {
    dataSource.put = jest.fn().mockImplementation(async () => null);
    dataSource.post = jest.fn().mockImplementation(async () => null);
    dataSource.delete = jest.fn().mockImplementation(async () => null);
    hubData = { ownerFirstName: 'Bob', ownerLastName: 'Smith', title: 'Hello World' };
  });

  describe('hubUpdate(hubId, input)', () => {
    it('sends PUT /{hubId}', async () => {
      await dataSource.hubUpdate(hubId, hubData);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}`, hubData, {
        cacheRefreshOptions: { update: true }
      });
    });
  });

  describe('hubCreate(input)', () => {
    it('sends POST /', async () => {
      await dataSource.hubCreate(hubData);
      expect(dataSource.post).toHaveBeenCalledWith('/video-hubs/', hubData);
    });
  });

  describe('HubUpdateStatus(hubId, input)', () => {
    it('sends POST /{hubId}/status', async () => {
      await dataSource.hubStatusUpdate(hubId, { id: hubId, status: 'Active' });
      expect(dataSource.post).toHaveBeenCalledWith(
        `/video-hubs/${hubId}/status`,
        { id: hubId, status: 'Active' },
        {
          cacheRefreshOptions: {
            evict: true,
            keyResolver: expect.any(Function)
          }
        }
      );
    });
  });

  describe('hubDelete(hubId)', () => {
    it('sends DELETE /{hubId', async () => {
      await dataSource.hubDelete(hubId);
      expect(dataSource.delete).toHaveBeenCalledWith(`/video-hubs/${hubId}`, undefined, {
        cacheRefreshOptions: { evict: true }
      });
    });
  });

  describe('updateSettings(hubId, input)', () => {
    it('sends PUT /{hubId}/settings', async () => {
      const settings: SettingsInput = { displayCventPrivacyPolicy: true, displayPrivacyPolicy: true };
      await dataSource.updateSettings(hubId, settings);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/settings`, settings);
    });
  });

  describe('updateRegistrationFormSettings(hubId, input)', () => {
    it('sends PUT /{hubId}/update-registration-form-fields', async () => {
      const input: UpdateRegistrationFormSettingInput = {
        hubId,
        data: [
          {
            code: RegistrationFieldCode.JobTitle,
            order: 3,
            required: false,
            included: true
          }
        ]
      };
      await dataSource.updateRegistrationFormSettings(input);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/update-registration-form-fields`, input);
    });
  });

  describe('addBannerToVideoCenter(centerId, bannerId', () => {
    it('sends POST /{hubId}/banners/{bannerId}', async () => {
      const bannerId = '1234-abcd';
      await dataSource.addBannerToVideoCenter(hubId, bannerId);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/banners/${bannerId}`);
    });
  });

  describe('setBannerAssociations(input)', () => {
    it('sends PUT /{hubId}/banners/associations', async () => {
      const input: BannerIdAssociationCreate = {
        centerId: hubId,
        entityId: hubId,
        entityType: 'Homepage',
        bannerAssociation: [
          {
            banner: { id: '1234-abed' },
            displayOrder: 1
          }
        ]
      };
      await dataSource.setBannerAssociations(input);
      expect(dataSource.put).toHaveBeenCalledWith(
        `/video-hubs/${input.centerId}/banners/associations?entityType=${input.entityType}&entityId=${input.entityId}`,
        input.bannerAssociation
      );
    });
  });

  describe('Google Analytics', () => {
    it('sends POST /{hubId}/google-analytics', async () => {
      const measurementId = '12345';
      await dataSource.addGoogleAnalytics(hubId, measurementId);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/google-analytics`, {
        measurementId: `G-${measurementId}`
      });
    });

    it('sends PUT /{hubId}/google-analytics', async () => {
      const measurementId = '97865';
      await dataSource.updateGoogleAnalytics(hubId, measurementId);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/google-analytics`, {
        measurementId: `G-${measurementId}`
      });
    });

    it('sends DELETE /{hubId}/google-analytics', async () => {
      await dataSource.deleteGoogleAnalytics(hubId);
      expect(dataSource.delete).toHaveBeenCalledWith(`/video-hubs/${hubId}/google-analytics`);
    });
  });

  describe('updateChannelsOrder(hubId, channelOrderInput)', () => {
    beforeEach(() => {
      dataSource.put = jest.fn().mockImplementation(async () => null);
    });
    it('sends PUT "video-hubs/{hubId}/channels/order" correctly', async () => {
      const channelOrderInputList: ChannelOrderInput[] = [
        { id: 'test channel 1', order: 1, existingOrder: 2 },
        { id: 'test channel 2', order: 2, existingOrder: 1 }
      ];
      await dataSource.updateChannelsOrder(hubId, channelOrderInputList);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/channels/order`, channelOrderInputList);
    });
  });

  describe('saveEmailDomains(input)', () => {
    it('sends PUT /{hubId}/email-domains', async () => {
      const input = {
        id: hubId,
        emailDomains: ['one.com', 'two.com']
      };
      await dataSource.saveEmailDomains(input);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/email-domains`, {
        emailDomains: input.emailDomains
      });
    });
  });

  describe('saveAllowedContactGroups(input)', () => {
    it('sends POST /{hubId}/contact-groups', async () => {
      const input = {
        id: hubId,
        contactGroups: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ]
      };
      await dataSource.saveAllowedContactGroups(input);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/contact-groups`, {
        contactGroups: input.contactGroups
      });
    });
  });

  describe('saveAllowedContactTypes(input)', () => {
    it('sends POST /{hubId}/contact-types', async () => {
      const input = {
        id: hubId,
        contactTypes: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ]
      };
      await dataSource.saveAllowedContactTypes(input);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/contact-types`, {
        contactTypes: input.contactTypes
      });
    });
  });

  describe('deleteAllowedContactTypes(input)', () => {
    it('sends DELETE /{hubId}/contact-types with list of contactTypes on input as request body', async () => {
      const input = {
        id: hubId,
        contactTypes: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ]
      };
      await dataSource.deleteAllowedContactTypes(input);
      expect(dataSource.delete).toHaveBeenCalledWith(`/video-hubs/${hubId}/contact-types`, undefined, {
        body: JSON.stringify({
          contactTypes: input.contactTypes
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  describe('saveBlockedContacts(input)', () => {
    it('sends POST /{hubId}/blocked-contacts with list of blockedContacts on input as request body', async () => {
      const input = {
        id: hubId,
        blockedContacts: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ]
      };
      await dataSource.saveBlockedContacts(input);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/blocked-contacts`, {
        blockedContacts: input.blockedContacts
      });
    });
  });

  describe('deleteBlockedContacts(input)', () => {
    it('sends DELETE /{hubId}/blocked-contacts with list of blockedContacts on input as request body', async () => {
      const input = {
        id: hubId,
        blockedContacts: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ]
      };
      await dataSource.deleteBlockedContacts(input);
      expect(dataSource.delete).toHaveBeenCalledWith(`/video-hubs/${hubId}/blocked-contacts`, undefined, {
        body: JSON.stringify({
          blockedContacts: input.blockedContacts
        }),
        headers: { 'Content-Type': 'application/json' }
      });
    });
  });

  describe('saveBlockedContactGroups(input)', () => {
    it('sends POST /{hubId}/blocked-contact-groups with list of blockedContactGroups on input as request body', async () => {
      const input = {
        id: hubId,
        blockedContactGroups: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ]
      };
      await dataSource.saveBlockedContactGroups(input);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/blocked-contact-groups`, {
        contactGroups: input.blockedContactGroups
      });
    });
  });

  describe('deleteBlockedContactGroups(input)', () => {
    it('sends DELETE /{hubId}/blocked-contact-groups with list of blockedContactGroups on input as request body', async () => {
      const input = {
        id: hubId,
        blockedContactGroups: [
          'dcef630b-42c2-4ef4-8718-c2fcf3093b1b',
          '4d216d63-91cb-4ff7-8dfd-49b741b631b9',
          '68585c5e-e4ef-4e55-aa44-dc7cbb265486'
        ]
      };
      await dataSource.deleteBlockedContactGroups(input);
      let i = 1;
      for (const group of input.blockedContactGroups) {
        expect(dataSource.delete).toHaveBeenNthCalledWith(
          i,
          `/video-hubs/${hubId}/blocked-contact-groups/${group}`,
          undefined,
          {
            body: JSON.stringify({
              contactGroups: input.blockedContactGroups
            }),
            headers: { 'Content-Type': 'application/json' }
          }
        );
        i++;
      }
    });
  });

  describe('saveCodeSnippetsForHub(input, hubId)', () => {
    it('sends POST /{hubId}/code-snippets/{codeSnippetId} with request body props "applicableOn", "targetWebPages"', async () => {
      const input = {
        id: hubId,
        codeSnippetId: 'code-snippet-id',
        applicableOn: [],
        targetWebPages: []
      };
      await dataSource.saveCodeSnippetForHub(input, hubId);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/code-snippets/${input.codeSnippetId}`, {
        applicableOn: input.applicableOn,
        targetWebpages: input.targetWebPages
      });
    });
  });

  describe('updateCodeSnippetForHub(input, hubId)', () => {
    it('sends PUT /{hubId}/code-snippets/{codeSnippetId} with request body props "applicableOn", "targetWebPages"', async () => {
      const input = {
        id: hubId,
        codeSnippetId: 'code-snippet-id',
        applicableOn: [],
        targetWebPages: []
      };
      await dataSource.updateCodeSnippetForHub(input, hubId);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/code-snippets/${input.codeSnippetId}`, {
        applicableOn: input.applicableOn,
        targetWebpages: input.targetWebPages
      });
    });
  });

  describe('updateHubLocales(hubId, locales)', () => {
    it('sends POST /{hubId}/contact-types', async () => {
      const locales = { locales: ['en-US', 'fr-CA'] };
      await dataSource.updateHubLocales(hubId, locales);
      expect(dataSource.put).toHaveBeenCalledWith(`/video-hubs/${hubId}/locales`, locales);
    });
  });

  describe('registrationCount(hubId, startDate, endDate)', () => {
    it('sends POST /{hubId}/registration-counts with request body', async () => {
      const startDateStr = '2023-08-14';
      const endDateStr = '2023-10-14';
      await dataSource.registrationCount(hubId, startDateStr, endDateStr);
      expect(dataSource.post).toHaveBeenCalledWith(`/video-hubs/${hubId}/registration-counts`, {
        startDate: startDateStr,
        endDate: endDateStr
      });
    });
  });

  describe('setUtmOverrides(centerId, data)', () => {
    it('sends PUT /video-hubs/{hubId}/utm-overrides with request body', async () => {
      await dataSource.setUtmOverrides(hubId, [{ key: 'a', value: 'b' }]);
      expect(dataSource.put).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/utm-overrides`, {
        data: [{ key: 'a', value: 'b' }]
      });
    });
  });

  describe('setTranslations(centerId, locale, data)', () => {
    it('sends PUT /video-hubs/{hubId}/translations/{locale} with request body', async () => {
      const data: [TranslationInput] = [{ id: 'id', locale: 'en-US', translatedValue: 'translation', type: 'type' }];
      await dataSource.setTranslations(hubId, 'en-US', data);
      expect(dataSource.put).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/translations/en-US`, {
        data
      });
    });
  });

  describe('resetTranslations(centerId, locale, type)', () => {
    it('sends DELETE /video-hubs/{hubId}/translations/{locale}?type={type}', async () => {
      await dataSource.resetTranslations(hubId, 'en-US', undefined);
      expect(dataSource.delete).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/translations/en-US?type=all`);
    });
  });

  describe('createPage(page)', () => {
    it('sends POST /video-hubs/{hubId}/pages', async () => {
      const page = { pageId, videoCenterId: hubId };
      await dataSource.createPage(page);
      expect(dataSource.post).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/pages`, page);
    });
  });

  describe('updatePage(page)', () => {
    it('sends PUT /video-hubs/{hubId}/pages/{pageId}', async () => {
      const page = { pageId, videoCenterId: hubId };
      await dataSource.updatePage(page);
      expect(dataSource.put).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/pages/${pageId}`, page);
    });
  });

  describe('createSection(centerId, section)', () => {
    it('sends POST /video-hubs/{hubId}/sections', async () => {
      const section = { sectionId, originPageId: pageId };
      await dataSource.createSection(hubId, section);
      expect(dataSource.post).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/sections`, section);
    });
  });

  describe('updateSection(centerId, section)', () => {
    it('sends PUT /video-hubs/{hubId}/sections/{sectionId}', async () => {
      const section = { sectionId, originPageId: pageId };
      await dataSource.updateSection(hubId, section);
      expect(dataSource.put).toHaveBeenLastCalledWith(`/video-hubs/${hubId}/sections/${sectionId}`, section);
    });
  });
});
