// MAUVE
/* eslint-disable @typescript-eslint/no-explicit-any */
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import {
  AllowedContactGroups,
  AllowedContactTypes,
  AllowedDomains,
  ApplicableOn,
  BannerAssociationPaging,
  BannerAssociationSearch,
  BannerHubSearch,
  BannerIdAssociationCreate,
  BannerPagingResponse,
  BannerSearch,
  BlockedContacts,
  BlockedContactsInput,
  BlockedContactGroups,
  BlockedContactGroupsInput,
  ChannelOrderInput,
  ChannelOrder,
  CodeSnippetHubRequest,
  CodeSnippetHubResponse,
  ContactTypesInput,
  DeleteContactTypesResponse,
  Feature,
  FeatureStatusInput,
  FilterInput,
  GetAllowedContactGroupsInput,
  GetAllowedContactTypesInput,
  GetBlockedContactsInput,
  GetBlockedContactGroupsInput,
  GetEmailDomainsInput,
  HubDataSourceRecord,
  HubPages,
  Hubs,
  HubStatusInput,
  MemberLoginInput,
  MemberLoginResponse,
  MemberProfile,
  MemberProfileUpdate,
  MemberProfileVisible,
  Paging,
  SearchMemberInput,
  Settings,
  SettingsInput,
  SocialMediaLinks,
  Success,
  TargetWebPages,
  Url,
  VideoHubChannel,
  UtmOverrideInput,
  UtmOverride,
  Customizations,
  CustomizationsInput,
  TranslationInput,
  TranslationPagingResponse,
  TranslationUpdateResponse,
  RegistrationFormSettings,
  UpdateRegistrationFormSettingInput,
  Page,
  PageWithSections,
  PageInput,
  PageSectionInput,
  PageSection,
  FileImportHistory,
  FileImportHistoryInput,
  FileImportHistoryParams,
  PagingResponse,
  LoginType
} from '@cvent/planner-event-hubs-model/types';
import { Request, Response } from 'apollo-server-env';
import { getRequestOptionsWithCacheOptions, createFilterQuery, splitIntoChunks } from '@utils/util';
import { NOT_FOUND_ERROR_CODE } from '@utils/constants';
import { CvestDataSource } from '../CvestDataSource';

const LOG = LoggerFactory.create('video-center-api');

const redirectStatuses = [301, 302, 303, 307, 308];

export interface PaginatedChannels {
  paging: Paging;
  data: VideoHubChannel[];
}

export interface EmailDomains {
  id: string;
  emailDomains: Array<string>;
}

export interface ContactGroupsInput {
  id: string;
  contactGroups: Array<string>;
}

interface ExistingMember {
  id: string;
  firstname: string;
  lastname: string;
  emailAddress: string;
  designation: string;
  prefix: string;
  companyName: string;
  jobTitle: string;
  socialMediaLinks: SocialMediaLinks;
  registrationDate: string;
  lastLoginDate: string;
  mobileNumber: string;
  profileImageUrl: Url;
}

export interface CodeSnippetsResponse {
  id: string;
  created: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
  applicableOn: ApplicableOn;
  targetWebpages: TargetWebPages[];
}

interface PaginatedMemberListResponse {
  paging: Paging;
  data: ExistingMember[];
}

interface GoogleAnalyticsResponse {
  measurementId: string;
  created: string;
  createdBy: string;
  lastModified: string;
  lastModifiedBy: string;
}
export interface RegistrationCountRow {
  date: string;
  count: number;
}

export type Owner = {
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type Colors = {
  action?: string;
  background?: string;
  main?: string;
  mood?: string;
};

export type Logo = {
  url?: string;
  originalUrl?: string;
  altText?: string;
};

export type Background = {
  url?: string;
  originalUrl?: string;
  altText?: string;
};

export type Calendar = {
  id: string;
};

export type Font = {
  headingId?: string;
  bodyId?: string;
};

export type Login = {
  type?: LoginType;
  organizationId?: string;
  idpUrl?: string;
};

export type HubDataSourceRecordV2 = {
  id: string;
  status: string;
  title: string;
  owner?: Owner;
  customDomain?: string;
  url: string;
  colors?: Colors;
  background?: Background;
  locale: string;
  accountMappingId: string;
  calendar?: Calendar;
  themeSafeMode: boolean;
  logo?: Logo;
  helpEmailAddress?: string;
  autoDetectBrowserLocale?: boolean;
  faviconUrl?: string;
  utmOverride?: string;
  fonts?: Font;
  login?: Login;
};

export interface HubDataSourceListV2 {
  data: [HubDataSourceRecordV2];
  paging: PagingResponse;
}

export interface RegistrationCountResponseData {
  data: Array<RegistrationCountRow>;
}
export const memberListFilter = (searchTerm: string): string => {
  return `firstName contains '${searchTerm}' or lastName contains '${searchTerm}' or emailAddress contains '${searchTerm}'`;
};

export class VideoCenterClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.VIDEO_HUB_SERVICE}/v1`;
  }

  // overriding method of RestDataSource
  protected async didReceiveResponse<TResult = any>(response: Response, _request: Request): Promise<TResult> {
    if (response.ok) {
      return this.parseBody(response) as any as Promise<TResult>;
    }
    if (redirectStatuses.includes(response.status)) {
      return response as any as Promise<TResult>;
    }
    throw await this.errorFromResponse(response);
  }

  getHub = async (hubId: string): Promise<HubDataSourceRecordV2> => {
    LOG.debug('getHub()', hubId);
    return this.get(`/hubs/${hubId}`, {}, getRequestOptionsWithCacheOptions(false));
  };

  getHubs = async (input: Hubs): Promise<HubDataSourceListV2> => {
    LOG.debug('getHubs()', input);
    return this.get('/hubs/', input);
  };

  getHubPages = async (hubId: string): Promise<HubPages> => {
    LOG.debug('getHubPages()', hubId);
    const homePage = 'Homepage';
    const filterInput: FilterInput = {};
    const hubPages: HubPages = {
      data: [
        {
          entityType: homePage,
          entityId: hubId,
          name: homePage
        }
      ]
    };
    let channels: PaginatedChannels = await this.filterChannels(hubId, filterInput);
    for (const channel of channels.data) {
      hubPages.data.push({
        entityType: 'Channel',
        entityId: channel.id,
        name: channel.title
      });
    }
    while (channels.paging.nextToken !== undefined) {
      filterInput.token = channels.paging.nextToken;
      // RED
      // Since the token from each await is needed for the next iteration, we cannot avoid an await-in-loop
      // eslint-disable-next-line no-await-in-loop
      channels = await this.filterChannels(hubId, filterInput);
      for (const channel of channels.data) {
        hubPages.data.push({
          entityType: 'Channel',
          entityId: channel.id,
          name: channel.title
        });
      }
    }
    hubPages.data.sort((a, b) => a.name.localeCompare(b.name));
    return hubPages;
  };

  getHubPagesWithBanner = async (input: BannerHubSearch): Promise<HubPages> => {
    LOG.debug('getHubPagesWithBanner()', input);
    const hubPages = await this.getHubPages(input.hubId);
    const bannerAssociationSearch: BannerAssociationSearch = {
      centerId: input.hubId,
      bannerId: input.bannerId
    };
    const pageIds = await this.getAssociatedPageIds(bannerAssociationSearch);
    return { data: hubPages.data.filter(a => pageIds.includes(a.entityId)) };
  };

  getAssociatedPageIds = async (input: BannerAssociationSearch): Promise<string[]> => {
    const bannerAssociationSearch = input;
    let hubBannerAssociations = await this.getBannerAssociations(bannerAssociationSearch);
    let pages = hubBannerAssociations.data;
    while (hubBannerAssociations.paging.nextToken !== undefined) {
      bannerAssociationSearch.token = hubBannerAssociations.paging.nextToken;
      // RED
      // Since the token from each await is needed for the next iteration, we cannot avoid an await-in-loop
      // eslint-disable-next-line no-await-in-loop
      hubBannerAssociations = await this.getBannerAssociations(bannerAssociationSearch);
      pages = pages.concat(hubBannerAssociations.data);
    }
    const pageIds = pages.map(a => a.entityId);
    return pageIds;
  };

  hubUpdate = async (hubId: string, input: HubDataSourceRecord): Promise<string> => {
    LOG.debug('hubUpdate(hubId, input)', hubId, input);
    return this.put(`/video-hubs/${hubId}`, input, { cacheRefreshOptions: { update: true } });
  };

  hubCreate = async (input: HubDataSourceRecord): Promise<string> => {
    LOG.debug('hubCreate(input)', input);
    return this.post('/video-hubs/', input);
  };

  hubStatusUpdate = async (hubId: string, input: HubStatusInput): Promise<string> => {
    LOG.debug('hubStatusUpdate(hubId, input)', hubId, input);
    return this.post(`/video-hubs/${hubId}/status`, input, {
      cacheRefreshOptions: {
        evict: true,
        keyResolver: (keyOfCurrentOperation: string): string => {
          return keyOfCurrentOperation.replace('/status', '');
        }
      }
    });
  };

  hubDelete = async (hubId: string): Promise<string> => {
    LOG.debug('hubDelete(hubId)', hubId);
    return this.delete(`/video-hubs/${hubId}`, undefined, { cacheRefreshOptions: { evict: true } });
  };

  updateSettings = async (hubId: string, input: SettingsInput): Promise<Settings> => {
    LOG.debug('updateSettings(hubId, input)', hubId, input);
    return this.put(`/video-hubs/${hubId}/settings`, input);
  };

  filterChannels = async (hubId: string, filterInput: FilterInput, useCache = false): Promise<PaginatedChannels> => {
    LOG.debug('filterChannels(hubId, filterInput)', hubId, filterInput);
    let updatedFilterInput = filterInput;
    if (!filterInput?.token) {
      updatedFilterInput = {
        ...filterInput,
        filter: filterInput?.filter ? `${filterInput.filter} AND hubId eq '${hubId}'` : `hubId eq '${hubId}'`
      };
    }
    return this.get('/channels', updatedFilterInput, getRequestOptionsWithCacheOptions(useCache, {}));
  };

  getHubSettings = async (hubId: string): Promise<Settings> => {
    LOG.debug('getHubSettings(hubId)', hubId);
    return this.get(`/video-hubs/${hubId}/settings`);
  };

  initiateMemberLogin = async (memberLoginInput: MemberLoginInput): Promise<MemberLoginResponse> => {
    LOG.debug('initiateMemberLogin(memberLoginInput)', memberLoginInput);
    const { hubId, memberInfo } = memberLoginInput;
    return this.post(`/video-hubs/${hubId}/login-request`, memberInfo);
  };

  getHubTermsEditPermission = async (hubId: string): Promise<string> => {
    LOG.debug('getHubTermsEditPermission hubId = ', hubId);
    return this.get(`/video-hubs/${hubId}/allow-terms-update`);
  };

  getHubBanners = async (bannerSearch: BannerSearch): Promise<BannerPagingResponse> => {
    LOG.debug('getHubBanners(bannerSearch)', bannerSearch);

    const params: { token?: string; limit?: number } = {};

    if (bannerSearch?.token) {
      params.token = bannerSearch.token;
    }

    if (bannerSearch?.limit) {
      params.limit = bannerSearch.limit;
    }

    return this.get(`/video-hubs/${bannerSearch.hubId}/banners`, params);
  };

  getBannerAssociations = async (
    bannerAssociationSearch: BannerAssociationSearch
  ): Promise<BannerAssociationPaging> => {
    LOG.debug('getBannerAssociations(bannerAssociationSearch)', bannerAssociationSearch);
    return this.get(`/video-hubs/${bannerAssociationSearch.centerId}/banners/associations`, bannerAssociationSearch);
  };

  addBannerToVideoCenter = async (centerId: string, bannerId: string): Promise<void> => {
    LOG.debug('addBannerToVideoCenter', centerId, bannerId);
    return this.post(`/video-hubs/${centerId}/banners/${bannerId}`);
  };

  getHubTermsOfUse = async (hubId: string, contactId: string): Promise<Response> => {
    LOG.debug('getHubTermsOfUse(hubId,contactId)', hubId, contactId);
    return this.get(`/video-hubs/${hubId}/contacts/${contactId}/terms-consent`);
  };

  getCenterFeatures = async (centerId: string): Promise<Feature[]> => {
    LOG.debug('getCenterFeatures(centerId)', centerId);
    return this.get(`/video-hubs/${centerId}/features`);
  };

  getCodeSnippets = async (hubId: string): Promise<CodeSnippetsResponse[]> => {
    LOG.debug('getCodeSnippets(hubId)', hubId);
    return this.get(`/video-hubs/${hubId}/code-snippets`);
  };

  getMemberProfileVisibility = async (centerId: string, contactId: string): Promise<MemberProfileVisible> => {
    LOG.debug('getMemberProfileVisibility(centerId,contactId)', centerId, contactId);
    return this.get(`/video-hubs/${centerId}/contacts/${contactId}/visibility`);
  };

  getMemberProfile = async (centerId: string, contactId: string): Promise<MemberProfile> => {
    LOG.debug('getMemberProfile(centerId, contactId)', centerId, contactId);
    return this.get(`/video-hubs/${centerId}/contacts/${contactId}/profile`);
  };

  updateCenterFeature = async (centerId: string, code: string, input: FeatureStatusInput): Promise<Feature> => {
    LOG.debug('updateCenterFeature(centerId, code)', centerId, code);
    return this.put(`/video-hubs/${centerId}/features/${code}`, input);
  };

  updateMemberVisibility = async (
    centerId: string,
    contactId: string,
    input: MemberProfileVisible
  ): Promise<MemberProfileVisible> => {
    LOG.debug('updateProfileVisibility(centerId,contactId)', centerId, contactId);
    return this.put(`/video-hubs/${centerId}/contacts/${contactId}/visibility`, input);
  };

  updateMemberProfile = async (
    centerId: string,
    contactId: string,
    input: MemberProfileUpdate
  ): Promise<MemberProfile> => {
    LOG.debug('updateMemberProfile(centerId,contactId)', centerId, contactId);
    return this.put(`/video-hubs/${centerId}/contacts/${contactId}/profile`, input);
  };

  setBannerAssociations = async (input: BannerIdAssociationCreate): Promise<BannerAssociationPaging> => {
    LOG.debug('setBannerAssociations(input)', input);
    return this.put(
      `/video-hubs/${input.centerId}/banners/associations?entityType=${input.entityType}&entityId=${input.entityId}`,
      input.bannerAssociation
    );
  };

  filterMemberList = async (input: SearchMemberInput): Promise<PaginatedMemberListResponse> => {
    const { centerId, searchTerm, pageLimit, token, sort } = input;
    LOG.debug('filterMemberList(input)', centerId, searchTerm);
    const queryParams = new URLSearchParams();

    if (token) {
      queryParams.set('token', token);
    }
    if (pageLimit) {
      queryParams.set('limit', pageLimit.toString());
    }

    if (sort) {
      queryParams.set('sort', sort);
    }

    const body = searchTerm === null ? null : { filter: memberListFilter(searchTerm) };
    return this.post(`/hubs/${centerId}/members/filter?${queryParams.toString()}`, body);
  };

  updateChannelsOrder = async (
    hubId: string,
    channelOrderInputList: Array<ChannelOrderInput>
  ): Promise<Array<ChannelOrder>> => {
    LOG.debug('updateChannelOrder', hubId);
    return this.put(`/video-hubs/${hubId}/channels/order`, channelOrderInputList);
  };

  public async fetchGoogleAnalytics(hubId: string): Promise<GoogleAnalyticsResponse> {
    LOG.debug('fetching google measurement id for hubId: ', hubId);
    return this.get(`/video-hubs/${hubId}/google-analytics`);
  }

  public async addGoogleAnalytics(hubId: string, measurementId: string): Promise<GoogleAnalyticsResponse> {
    LOG.debug('saving google measurement id for hubId: ', hubId);
    return this.post(`/video-hubs/${hubId}/google-analytics`, { measurementId: `G-${measurementId}` });
  }

  public async updateGoogleAnalytics(hubId: string, measurementId: string): Promise<GoogleAnalyticsResponse> {
    LOG.debug('updating google measurement id for hubId: ', hubId);
    return this.put(`/video-hubs/${hubId}/google-analytics`, { measurementId: `G-${measurementId}` });
  }

  public async deleteGoogleAnalytics(hubId: string): Promise<string> {
    LOG.debug('deleting google measurement id for hubId: ', hubId);
    return this.delete(`/video-hubs/${hubId}/google-analytics`);
  }

  filterHubs = async (filterInput: FilterInput): Promise<HubDataSourceRecord[]> => {
    LOG.debug('filterHubs(filterInput)', filterInput);
    return this.get(`/video-hubs`, filterInput);
  };

  saveEmailDomains = async (input: EmailDomains): Promise<AllowedDomains> => {
    LOG.debug('saveEmailDomains(input)', input);
    return this.put(`/video-hubs/${input.id}/email-domains`, { emailDomains: input.emailDomains });
  };

  getEmailDomains = async (input: GetEmailDomainsInput): Promise<AllowedDomains> => {
    LOG.debug('getEmailDomains(input)', input);
    return this.get(`/video-hubs/${input.id}/email-domains`);
  };

  saveAllowedContactGroups = async (input: ContactGroupsInput): Promise<AllowedContactGroups> => {
    LOG.debug('saveAllowedContactGroups(input)', input);
    return this.put(`/video-hubs/${input.id}/contact-groups`, { contactGroups: input.contactGroups });
  };

  getAllowedContactGroups = async (input: GetAllowedContactGroupsInput): Promise<AllowedContactGroups> => {
    LOG.debug('getAllowedContactGroups(input)', input);
    return this.get(`/video-hubs/${input.id}/contact-groups`);
  };

  saveAllowedContactTypes = async (input: ContactTypesInput): Promise<AllowedContactTypes> => {
    LOG.debug('saveAllowedContactTypes(input)', input);
    return this.post(`/video-hubs/${input.id}/contact-types`, { contactTypes: input.contactTypes });
  };

  deleteAllowedContactTypes = async (input: ContactTypesInput): Promise<DeleteContactTypesResponse> => {
    LOG.debug('deleteAllowedContactTypes(input)', input);
    return this.delete(`/video-hubs/${input.id}/contact-types`, undefined, {
      body: JSON.stringify({ contactTypes: input.contactTypes }),
      headers: { 'Content-Type': 'application/json' }
    });
  };

  getAllowedContactTypes = async (input: GetAllowedContactTypesInput): Promise<AllowedContactTypes> => {
    LOG.debug('getAllowedContactTypes(input)', input);
    return this.get(`/video-hubs/${input.id}/contact-types`);
  };

  saveBlockedContacts = async (input: BlockedContactsInput): Promise<BlockedContacts> => {
    LOG.debug('saveAllowedBlockedContacts(input)', input);
    return this.post(`/video-hubs/${input.id}/blocked-contacts`, { blockedContacts: input.blockedContacts });
  };

  deleteBlockedContacts = async (input: BlockedContactsInput): Promise<Success> => {
    LOG.debug('deleteAllowedBlockedContacts(input)', input);
    await this.delete(`/video-hubs/${input.id}/blocked-contacts`, undefined, {
      body: JSON.stringify({ blockedContacts: input.blockedContacts }),
      headers: { 'Content-Type': 'application/json' }
    });
    return { success: true };
  };

  getBlockedContacts = async (input: GetBlockedContactsInput): Promise<BlockedContacts> => {
    LOG.debug('getAllowedBlockedContacts(input)', input);
    return this.get(`/video-hubs/${input.id}/blocked-contacts`);
  };

  getBlockedContactGroups = async (input: GetBlockedContactGroupsInput): Promise<BlockedContactGroups> => {
    LOG.debug('getBlockedContactGroups(input)', input);
    return this.get(`/video-hubs/${input.id}/blocked-contact-groups`);
  };

  saveBlockedContactGroups = async (input: BlockedContactGroupsInput): Promise<BlockedContactGroups> => {
    LOG.debug('saveBlockedContactGroups(input)', input);
    return this.post(`/video-hubs/${input.id}/blocked-contact-groups`, {
      contactGroups: input.blockedContactGroups
    });
  };

  deleteBlockedContactGroups = async (input: BlockedContactGroupsInput): Promise<Success> => {
    LOG.debug('deleteBlockedContactGroups(input)', input);
    try {
      for (const contactGroup of input.blockedContactGroups) {
        // todo: these should be kicked off in parallel
        // RED
        // Ported from PVS without time to clean-up lint
        // eslint-disable-next-line no-await-in-loop
        await this.delete(`/video-hubs/${input.id}/blocked-contact-groups/${contactGroup}`, undefined, {
          body: JSON.stringify({
            contactGroups: input.blockedContactGroups
          }),
          headers: { 'Content-Type': 'application/json' }
        });
      }
      return { success: true };
    } catch (error) {
      LOG.error(`Failed to delete blocked contact groups with hubId: ${input.id}`, error);
      throw error;
    }
  };

  saveCodeSnippetForHub = async (input: CodeSnippetHubRequest, hubId: string): Promise<CodeSnippetHubResponse> => {
    LOG.debug('saveCodeSnippetForHub(input, hubId)', input, hubId);
    return this.post(`/video-hubs/${hubId}/code-snippets/${input.codeSnippetId}`, {
      applicableOn: input.applicableOn,
      targetWebpages: input.targetWebPages
    });
  };

  updateCodeSnippetForHub = async (input: CodeSnippetHubRequest, hubId: string): Promise<CodeSnippetHubResponse> => {
    LOG.debug('updateCodeSnippetForHub', input, hubId);
    return this.put(`/video-hubs/${hubId}/code-snippets/${input.codeSnippetId}`, {
      applicableOn: input.applicableOn,
      targetWebpages: input.targetWebPages
    });
  };

  listVideoHubsInBatches = async (videoHubIds: string[]): Promise<HubDataSourceRecord[]> => {
    LOG.debug('listVideoHubsInBatches', videoHubIds);

    const chunks = splitIntoChunks(videoHubIds, 35);
    const response = await Promise.all(
      chunks.map(idChunk =>
        this.filterHubs({
          filter: createFilterQuery('id', idChunk)
        })
      )
    );
    return response.filter(n => n).flat();
  };

  listHubLocales = async (hubId: string): Promise<string[]> => {
    LOG.debug('listHubLocales', hubId);
    return this.get(`/video-hubs/${hubId}/locales`);
  };

  listHubLocalesDetailed = async (hubId: string): Promise<string[]> => {
    LOG.debug('listHubLocalesDetailed', hubId);
    return this.get(`/video-hubs/${hubId}/locales/detailed`);
  };

  updateHubLocales = async (hubId: string, locales: { locales: string[] }) => {
    LOG.debug('updateHubLocales', hubId, locales);
    return this.put(`/video-hubs/${hubId}/locales`, locales);
  };

  removeCodeSnippet = async (hubId: string, codeSnippetId: string): Promise<string> => {
    LOG.debug('removeCodeSnippet', hubId);
    return this.delete(`/video-hubs/${hubId}/code-snippets/${codeSnippetId}`);
  };

  updateMemberStatus = async (hubId: string, request: { memberIds: string[]; status: string }) => {
    LOG.debug('updateMemberStatus', hubId, request);
    return this.put(`/video-hubs/${hubId}/members/status`, request);
  };

  registrationCount = async (
    hubId: string,
    startDate: string,
    endDate: string
  ): Promise<RegistrationCountResponseData> => {
    LOG.debug('getTotalRegistrationCountByHubId()', hubId);
    return this.post(`/video-hubs/${hubId}/registration-counts`, {
      startDate,
      endDate
    });
  };

  getUtmOverrides = async (hubId: string): Promise<[UtmOverride]> => {
    LOG.debug('fetchUtmOverrides', hubId);
    return this.get(`/video-hubs/${hubId}/utm-overrides`);
  };

  setUtmOverrides = async (hubId: string, data: [UtmOverrideInput]): Promise<[UtmOverride]> => {
    LOG.debug('fetchUtmOverrides', hubId);
    return this.put(`/video-hubs/${hubId}/utm-overrides`, { data });
  };

  /**
   * Type and translations parameters are defined in the documentation below:
   * https://backstage.core.cvent.org/catalog/default/api/video-hub-service#tag/Video-Hub/operation/getTranslations
   */
  getTranslations = async (
    hubId: string,
    locale,
    translations,
    type,
    translationText,
    limit,
    sort,
    token
  ): Promise<TranslationPagingResponse> => {
    LOG.debug('fetchTranslations', hubId);
    const filterInput: any = {};
    if (translations !== undefined) {
      filterInput.translations = translations;
    }
    if (type !== undefined) {
      filterInput.type = type;
    }
    if (limit !== undefined) {
      filterInput.limit = limit;
    }
    if (sort !== undefined) {
      filterInput.sort = sort;
    }
    if (token !== undefined) {
      filterInput.token = token;
    }
    if (translationText !== undefined) {
      filterInput.translationText = translationText;
    }
    return this.get(`/video-hubs/${hubId}/translations/${locale}`, filterInput);
  };

  setTranslations = async (
    hubId: string,
    locale: string,
    data: [TranslationInput]
  ): Promise<TranslationUpdateResponse> => {
    LOG.debug('setTranslations', hubId);
    return this.put(`/video-hubs/${hubId}/translations/${locale}`, { data });
  };

  resetTranslations = async (hubId: string, locale: string, type: string): Promise<string> => {
    LOG.debug('resetTranslations', hubId);
    let sentType = type;
    if (sentType === undefined) {
      sentType = 'all';
    }
    return this.delete(`/video-hubs/${hubId}/translations/${locale}?type=${sentType}`);
  };

  getHubCustomizations = async (hubId: string): Promise<Customizations> => {
    try {
      return await this.get(`/video-hubs/${hubId}/customizations`);
    } catch (e) {
      if (e.code === NOT_FOUND_ERROR_CODE) {
        return null;
      }
      throw e;
    }
  };

  upsertHubCustomizations = async (hubId: string, customizations: CustomizationsInput): Promise<Customizations> => {
    return this.put(`/video-hubs/${hubId}/customizations`, {
      ...customizations
    });
  };

  getRegistrationFormSettings = async (hubId: string): Promise<RegistrationFormSettings> => {
    LOG.debug('getRegistrationFormSettings(input)', hubId);
    return this.get(`/video-hubs/${hubId}/registration-form-fields`);
  };

  updateRegistrationFormSettings = async (
    input: UpdateRegistrationFormSettingInput
  ): Promise<RegistrationFormSettings> => {
    LOG.debug('updateRegistrationFormSettings(input)', input);
    return this.put(`/video-hubs/${input.hubId}/update-registration-form-fields`, input);
  };

  getPage = async (hubId: string): Promise<PageWithSections> => {
    LOG.debug('Getting currently published hub(input)', hubId);
    return this.get(`/video-hubs/${hubId}/pages`);
  };

  createPage = async (page: PageInput): Promise<Page> => {
    LOG.debug('Getting currently published hub(input)', page.videoCenterId);
    return this.post(`/video-hubs/${page.videoCenterId}/pages`, page);
  };

  updatePage = async (page: PageInput): Promise<Page> => {
    LOG.debug('Getting currently published hub(input)', page.videoCenterId);
    return this.put(`/video-hubs/${page.videoCenterId}/pages/${page.pageId}`, page);
  };

  createSection = async (hubId: string, section: PageSectionInput): Promise<PageSection> => {
    LOG.debug('Getting currently published hub(input)', hubId);
    return this.post(`/video-hubs/${hubId}/sections`, section);
  };

  updateSection = async (hubId: string, section: PageSectionInput): Promise<PageSection> => {
    LOG.debug('Getting currently published hub(input)', hubId);
    return this.put(`/video-hubs/${hubId}/sections/${section.sectionId}`, section);
  };

  getFileImportHistory = async (hubId: string, args: FileImportHistoryInput): Promise<FileImportHistory> => {
    LOG.debug(`Getting file import history for ${hubId} locale: ${args.locale}`);
    const params: FileImportHistoryParams = {};
    if (args.locale) {
      params.locale = args.locale;
    }
    return this.get(`/file-import/video-hubs/${hubId}/history/${args.schemaName}`, params);
  };
}
