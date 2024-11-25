import {
  AllowTermsEdit,
  BannerAssociationPaging,
  BannerPagingResponse,
  ConfigStatus,
  Customizations,
  EntityType,
  Feature,
  Hub,
  HubDataSourceRecord,
  HubLocalesWithDefault,
  HubPages,
  HubsPagingResponse,
  NavigationAlignment,
  NavigationLinkHighlightStyle,
  Page,
  PageSection,
  PageSectionInput,
  PageWithSection,
  PageWithSections,
  RegistrationFormSettings,
  Resolvers,
  Settings,
  TranslationPagingResponse,
  TranslationUpdateResponse,
  UtmOverride
} from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import {
  convertBannerAssociation,
  convertHub,
  convertHubV2,
  mapHubForSave
} from '@dataSources/videoCenterService/mappers';
import { CONFLICT_ERROR_CODE } from '@utils/constants';
import { getVideoCenterMemberHomePageUrl, getVideoCenterShortUrlTag } from '@resolvers/common/utils/urlUtils';
import { getAccountMappingId, getEnvironment } from '@resolvers/common/utils/authMetadataUtils';
import { moveResource, publishImage } from '@resolvers/common/dataAccess/upload';
import { isProduction } from '@utils/environmentUtil';
import { RegistrationCountResponse } from '@cvent/planner-event-hubs-model/src/operations';
import { getTotalRegistrationCount } from '@resolvers/common/dataAccess/registrations';
import { omit } from 'lodash';
import { randomUUID } from 'crypto';
import { getDefaultLocales } from '@server/utils';
import { processNewSectionImage } from '@resolvers/common/dataAccess/pageSection';
import { contentLimit } from '@components/homepage-customization/HomePageSectionMeta';
import { switchChineseLocale } from '@locales/index';

const LOG = LoggerFactory.create('hub-resolver');

// parent, args, context, info
const resolver: Resolvers = {
  Query: {
    hubs: async (_parent, args, { dataSources }, _info): Promise<HubsPagingResponse> => {
      LOG.debug('getting hubs');
      const response = await dataSources.videoCenterClient.getHubs(args.input);
      return {
        __typename: 'HubsPagingResponse',
        data: response.data.map(convertHubV2),
        paging: response.paging
      };
    },
    hub: async (_parent, { id }, { dataSources }, _info): Promise<Hub> => {
      LOG.debug('getting hub id =', id);
      const response = await dataSources.videoCenterClient.getHub(id.id);
      return convertHubV2(response);
    },
    hubPages: async (_parent, { id }, { dataSources }): Promise<HubPages> => {
      LOG.debug('getting hub pages for hub id =', id);
      return dataSources.videoCenterClient.getHubPages(id.id);
    },
    hubBanners: async (_parent, args, { dataSources }, _info): Promise<BannerPagingResponse> => {
      LOG.debug('getting hub banners', args);
      return dataSources.videoCenterClient.getHubBanners(args.bannerSearch);
    },
    hubPagesWithBanner: async (_parent, { input }, { dataSources }): Promise<HubPages> => {
      LOG.debug('getting hub pages with a specific banner for hub id =', input.hubId);
      return dataSources.videoCenterClient.getHubPagesWithBanner(input);
    },
    bannerAssociations: async (_parent, args, { dataSources }, _info): Promise<BannerAssociationPaging> => {
      LOG.debug('getting banner associations', args);
      return dataSources.videoCenterClient.getBannerAssociations(args.bannerAssociationSearch);
    },
    getHubSettings: async (parent, { id }, { dataSources }): Promise<Settings> => {
      LOG.debug('getting privacy settings for hub id =', id);
      return dataSources.videoCenterClient.getHubSettings(id.id);
    },
    getHubTermsEditPermission: async (parent, { id }, { dataSources }): Promise<AllowTermsEdit> => {
      LOG.debug('Allowed terms consent for hub id =', id);
      try {
        await dataSources.videoCenterClient.getHubTermsEditPermission(id.id);
        return AllowTermsEdit.Allowed;
      } catch (error) {
        switch (error.code) {
          case CONFLICT_ERROR_CODE:
            return AllowTermsEdit.NotAllowed;
          default:
            LOG.error('Unhandled error fetching HubTermsEditPermission', error);
            throw error;
        }
      }
    },
    getCenterFeatures: async (_parent, { id }, { dataSources }, _info): Promise<Feature[]> => {
      LOG.debug('Get feature list for video center =', id.id);
      return dataSources.videoCenterClient.getCenterFeatures(id.id);
    },
    getHubLocales: async (_parent, { id }, { dataSources }, _info): Promise<HubLocalesWithDefault> => {
      LOG.debug('Get locales for video center =', id.id);
      // get the hub
      const hub = await dataSources.videoCenterClient.getHub(id.id);
      // get the hub languages
      const { locales: localesDetailed } = await dataSources.videoCenterClient.listHubLocalesDetailed(id.id);
      // make sure hub is in the list
      if (!localesDetailed.map(row => row.locale).includes(hub.locale)) {
        localesDetailed.push({
          locale: hub.locale,
          customized: false,
          translationStatus: 'Not-Started'
        });
      }
      // return list of locales with hub locale set as default
      const response = localesDetailed.map(row => ({
        ...row,
        default: row.locale === hub.locale,
        locale: row.locale
      }));
      return { data: response };
    },
    getRegistrationCount: async (_parent, { input }, { dataSources }): Promise<RegistrationCountResponse> => {
      LOG.debug('registrationCountRequest', input);
      return getTotalRegistrationCount(dataSources.videoCenterClient, input.hubId, input.startDate, input.endDate);
    },
    getUtmOverrides: async (_parent, { input }, { dataSources }, _info): Promise<UtmOverride[]> => {
      LOG.debug('Get UTM overrides list for video center =', input.id);
      return dataSources.videoCenterClient.getUtmOverrides(input.id);
    },
    getTranslations: async (_parent, { input }, { dataSources }, _info): Promise<TranslationPagingResponse> => {
      LOG.debug('Get translations for video center =', input.hubId);
      return dataSources.videoCenterClient.getTranslations(
        input.hubId,
        input.locale,
        input.translations,
        input.type,
        input.translationText,
        input.limit,
        input.sort,
        input.token
      );
    },
    getHubCustomizations: async (_parent, { id }, { dataSources }): Promise<Customizations> => {
      LOG.debug('getHubCustomizations', id.id);
      const hubCustomizations = await dataSources.videoCenterClient.getHubCustomizations(id.id);
      const defaultLinkTextSize = 12;
      return {
        ...hubCustomizations,
        showUpcomingEvents: hubCustomizations?.showUpcomingEvents ?? true,
        showLogin: hubCustomizations?.showLogin ?? true,
        showChannels: hubCustomizations?.showChannels ?? true,
        showLogo: hubCustomizations?.showLogo ?? true,
        showVideos: hubCustomizations?.showVideos ?? true,
        showNavigation: hubCustomizations?.showNavigation ?? true,
        showHomePage: hubCustomizations?.showHomePage ?? true,
        showCustomHeader: hubCustomizations?.showCustomHeader ?? false,
        navigationAlignment: hubCustomizations?.navigationAlignment ?? NavigationAlignment.Center,
        navigationLinkTextSize: hubCustomizations?.navigationLinkTextSize ?? defaultLinkTextSize,
        navigationLinkHighlightStyle:
          hubCustomizations?.navigationLinkHighlightStyle ?? NavigationLinkHighlightStyle.Filled
      };
    },
    getRegistrationFormSettings: async (_parent, { input }, { dataSources }): Promise<RegistrationFormSettings> => {
      LOG.debug('getRegistrationSettings', input.hubId);
      return dataSources.videoCenterClient.getRegistrationFormSettings(input.hubId);
    },

    getPage: async (_parent, { input }, { dataSources }): Promise<PageWithSections> => {
      LOG.debug('getPage', input.id);
      try {
        return await dataSources.videoCenterClient.getPage(input.id);
      } catch (error) {
        if (error.code === '404' && error.response.message === 'No Published Page found for hub') {
          return {};
        }
        throw error;
      }
    },

    getPublishedPageOrDefaults: async (_parent, { input }, { dataSources }): Promise<PageWithSections> => {
      LOG.debug('getPublishedPageOrDefaults', input.id);

      return dataSources.videoCenterClient
        .getPage(input.id)
        .then(async pageWithSections => {
          return pageWithSections;
        })
        .catch(async (error: { code: string; response: { message: string } }) => {
          if (error.code !== '404' && error.response.message !== 'No Published Page found for hub') {
            throw error;
          }

          // With no publish paged found, we know this Hub has not yet had a homepage customized
          // In order to present the planner with a view that represents the current homepage, we will create relevant sections
          // 1. UpcomingEvents section will be created if the hub has a calendar ID. This reflects current member-side homepage logic
          // 2. Channels section will always be created. Member-side logic will not display this carousel if there are no Channels
          // 3. Videos section will always be created. Member-side logic will not display this carousel if there are no Videos

          const hub = await dataSources.videoCenterClient.getHub(input.id);
          hub.locale = switchChineseLocale(hub.locale);
          const shouldCreateUpcomingEvents = !!hub.calendar?.id;
          const sectionCreatePromises: Promise<PageSection>[] = [];

          const newPageId = randomUUID();
          const upcomingEventSectionId = randomUUID();
          const channelSectionId = randomUUID();
          const videoSectionId = randomUUID();
          const sectionIds = [channelSectionId, videoSectionId];

          if (shouldCreateUpcomingEvents) {
            sectionIds.unshift(upcomingEventSectionId);
          }

          const draftPage = await dataSources.videoCenterClient.createPage({
            pageId: newPageId,
            videoCenterId: input.id,
            status: 'Draft',
            sectionIds
          });

          if (shouldCreateUpcomingEvents) {
            sectionCreatePromises.push(
              dataSources.videoCenterClient.createSection(input.id, {
                originPageId: draftPage.pageId,
                sectionId: upcomingEventSectionId,
                pageSectionTemplate: 'DefaultUpcomingEvents',
                title: await getDefaultLocales(hub.locale, 'video_hub_branding_preview_upcoming_events_title'),
                contentLimitOnInitialLoad: contentLimit.UP_TO_3,
                layout: 'Tile'
              })
            );
          }

          sectionCreatePromises.push(
            dataSources.videoCenterClient.createSection(input.id, {
              originPageId: draftPage.pageId,
              sectionId: channelSectionId,
              pageSectionTemplate: 'DefaultChannels',
              title: await getDefaultLocales(hub.locale, 'video_hub_branding_preview_channels_title'),
              contentLimitOnInitialLoad: contentLimit.UP_TO_4,
              visibleFields: ['channel.name'],
              layout: 'Tile'
            })
          );

          sectionCreatePromises.push(
            dataSources.videoCenterClient.createSection(input.id, {
              originPageId: draftPage.pageId,
              sectionId: videoSectionId,
              pageSectionTemplate: 'Videos',
              title: await getDefaultLocales(hub.locale, 'video_hub_branding_preview_whats_new_title'),
              contentFilterType: 'new-videos'
            })
          );

          const sectionPromiseResults = await Promise.allSettled<PageSection>(sectionCreatePromises);

          if (sectionPromiseResults.some(p => p.status === 'rejected')) {
            throw new Error(
              `Failed to create sections: ${JSON.stringify(sectionPromiseResults.filter(p => p.status === 'rejected'))}`
            );
          }

          // This unfortunate map conditional dance is to appease lint
          const newSections = sectionPromiseResults.map(p => {
            if (p.status === 'fulfilled') {
              return p.value as PageSection;
            }
            return null;
          });

          LOG.info('Created default sections for first-time planner changes', newSections);

          LOG.debug('Returning new draft page with new default sections', { page: draftPage, sections: newSections });
          return {
            page: draftPage,
            sections: newSections
          };
        });
    }
  },
  Mutation: {
    hubUpdate: async (_parent, { input }, { dataSources, auth }): Promise<string> => {
      LOG.debug('hubUpdate', input);
      const hub = input;

      const accountMappingId = getAccountMappingId(auth);
      if (hub?.theme?.newLogoImageUrl) {
        const { originalImageUrl, optimizedImageUrl } = await publishImage(
          {
            newImageUrl: hub.theme?.newLogoImageUrl,
            newOriginalImageUrl: hub.theme?.newLogoOriginalImageUrl,
            imageUrl: hub.theme?.logoImageUrl,
            originalImageUrl: hub.theme?.logoOriginalImageUrl
          },
          {
            accountMappingId,
            centerId: hub.id,
            entityId: hub.id,
            entityType: EntityType.Logo
          },
          dataSources
        );
        hub.theme.logoImageUrl = optimizedImageUrl;
        hub.theme.logoOriginalImageUrl = originalImageUrl;
      }

      // Fetch hubData:-
      // This GQL is used on UI to update (PUT - full update) video hub table and while doing that UI passes data from getHub cache instead of source of truth(DB).
      // but there are few fields in the table that are of diff scope and are governed [fetched and update] by their respective GQLs.
      // So the hub cache doesn't always have the latest data and this gql overwrite some fields with null/old data in DB.
      // This will also affect cases when multiple tabs are opened in by same user or diff users.
      // We can use one of the below solution or something else :-
      // ******************************************
      // *** 1. [Preferred] We have to update UI to use data from source of truth while calling this GQL (update).
      // *** 2. Update GQLs created to update data in video hub table to always update cache of all GQLs that fetch hub data from video hub table (now or in future).
      // ******************************************
      // As of now we are going to fetch these details here and use them for update and later work on make permanent fix after discussing and agreed by all teams.
      // Below data is present in video hub table but not governed by this GQL.
      // customDomain, favicon and logo

      const existingData: HubDataSourceRecord = await dataSources.videoCenterClient.getHub(hub.id);
      const updatedData = mapHubForSave(hub);

      updatedData.customDomain = existingData.customDomain;

      const response = await dataSources.videoCenterClient.hubUpdate(hub.id, updatedData);
      // query locales for hubid
      const { locales: localesDetailed } = await dataSources.videoCenterClient.listHubLocales(input.id);
      // make sure hub is in the list
      if (!localesDetailed.includes(input.config.locale)) {
        localesDetailed.push(input.config.locale);
        dataSources.videoCenterClient.updateHubLocales(input.id, { locales: localesDetailed });
      }
      return response.id;
    },
    hubCreate: async (_parent, { input }, { dataSources, auth }): Promise<string> => {
      LOG.debug('hubCreate', input);
      const hub: HubDataSourceRecord = mapHubForSave(input);
      const response = await dataSources.videoCenterClient.hubCreate(hub);
      const videoCenterId = response.id;
      let url = getVideoCenterMemberHomePageUrl(videoCenterId, {
        customDomain: null,
        absoluteUrl: true
      });
      const environment = getEnvironment(auth);
      if (environment !== process.env.ENVIRONMENT_NAME && !isProduction()) {
        // We need to set the env when it is not the default, for example when S606 is used
        url = `${url}?env=${environment}`;
      }
      try {
        const weeUrl = await dataSources.weeClient.createShortUrl(url, [getVideoCenterShortUrlTag(videoCenterId)]);
        hub.url = weeUrl.shortUrl;
      } catch (error) {
        LOG.error(`Unable to create shortened url from wee-service for new hub ${videoCenterId}`);
        hub.url = url;
      }
      await dataSources.videoCenterClient.hubUpdate(videoCenterId, hub);
      // set languages for hub to list with current language
      const hubLocales = [hub.locale];
      LOG.debug(`Updating locales to ${JSON.stringify(hubLocales)}`);
      dataSources.videoCenterClient.updateHubLocales(videoCenterId, { locales: hubLocales });
      return videoCenterId;
    },
    hubPublish: async (_parent, { input }, { dataSources }): Promise<string> => {
      LOG.debug('hubPublish', input);
      const response = await dataSources.videoCenterClient.hubStatusUpdate(input.id, {
        id: input.id,
        status: ConfigStatus.Active
      });
      return response.id;
    },
    hubDraft: async (_parent, { input }, { dataSources }): Promise<string> => {
      LOG.debug('hubDraft', input);
      const response = await dataSources.videoCenterClient.hubStatusUpdate(input.id, {
        id: input.id,
        status: ConfigStatus.Inactive
      });
      return response.id;
    },
    hubDelete: async (_parent, { input }, { dataSources }): Promise<string> => {
      LOG.debug('hubDelete', input);
      await dataSources.videoCenterClient.hubDelete(input.id);
      return input.id;
    },
    deleteToken: async (_parent, { input }, { dataSources }): Promise<string> => {
      LOG.debug('deleteToken', input);
      await dataSources.videoHubUiClient.deleteToken(input.id);
      return input.id;
    },
    hubUpdateSettings: async (_parent, { input }, { dataSources }): Promise<Settings> => {
      LOG.debug('hubUpdateSettings', input);
      return dataSources.videoCenterClient.updateSettings(input.id, input.hubSettings);
    },
    updateCenterFeature: async (_parent, { input }, { dataSources }): Promise<Feature> => {
      LOG.debug('updateCenterFeature', input);
      return dataSources.videoCenterClient.updateCenterFeature(input.centerId, input.code, {
        enabled: input.enabled
      });
    },
    setBannerAssociations: async (_parent, { input }, { dataSources }): Promise<BannerAssociationPaging> => {
      const bannerIdAssociation = [];
      for (let i = 0; i < input.bannerAssociation.length; i++) {
        bannerIdAssociation.push(convertBannerAssociation(input.bannerAssociation[i]));
      }
      const bannerIdAssociationCreate = {
        centerId: input.centerId,
        entityId: input.entityId,
        entityType: input.entityType,
        bannerAssociation: bannerIdAssociation
      };
      LOG.debug('setBannerAssociations', bannerIdAssociationCreate);
      return dataSources.videoCenterClient.setBannerAssociations(bannerIdAssociationCreate);
    },
    addHubLocales: async (_parent, { input, id }, { dataSources }): Promise<HubLocalesWithDefault> => {
      LOG.debug('Adding locales for video center =', id.id);
      // get the hub
      const hub = await dataSources.videoCenterClient.getHub(id.id);
      // get the hub locales
      const { locales: hubLocales } = await dataSources.videoCenterClient.listHubLocales(id.id);
      // make sure hub is in the list
      if (!hubLocales.includes(hub.locale)) {
        hubLocales.push(hub.locale);
      }
      // add the new items to the list
      input.data.forEach(s => {
        if (!hubLocales.includes(s)) {
          hubLocales.push(s);
        }
      });
      // save the updated list
      dataSources.videoCenterClient.updateHubLocales(id.id, { locales: hubLocales });
      // return list of locales with hub locale set as default
      const response = hubLocales.map(locale => ({ locale, default: locale === hub.locale }));
      return { data: response };
    },
    updateBrandingImages: async (_parent, { input }, { dataSources, auth }): Promise<Hub> => {
      LOG.debug('updateBrandingImages', input);
      const accountMappingId = getAccountMappingId(auth);
      const hubResponse = await dataSources.videoCenterClient.getHub(input.hubId);
      const hub = convertHubV2(hubResponse);

      if (input.faviconUrl && input.faviconUrl !== hub.theme.faviconUrl) {
        const newFaviconUrlPath = await moveResource(
          input.faviconUrl,
          {
            accountMappingId,
            centerId: hub.id,
            entityId: hub.id,
            entityType: EntityType.Favicon
          },
          dataSources.s3ProxyServiceClient
        );
        hub.theme.faviconUrl = newFaviconUrlPath;
      } else {
        hub.theme.faviconUrl = input.faviconUrl;
      }

      hub.theme.logoImageUrl = input.logoUrl;
      hub.theme.logoOriginalImageUrl = input.logoOriginalUrl;
      hub.theme.logoAltText = input.logoAltText;
      if (input.newLogoUrl) {
        const { originalImageUrl, optimizedImageUrl } = await publishImage(
          {
            newImageUrl: input.newLogoUrl,
            newOriginalImageUrl: input.newLogoOriginalUrl,
            imageUrl: input.logoUrl,
            originalImageUrl: input.logoOriginalUrl
          },
          {
            accountMappingId,
            centerId: hub.id,
            entityId: hub.id,
            entityType: EntityType.Logo
          },
          dataSources
        );
        hub.theme.logoImageUrl = optimizedImageUrl;
        hub.theme.logoOriginalImageUrl = originalImageUrl;
      }

      const response: HubDataSourceRecord = await dataSources.videoCenterClient.hubUpdate(hub.id, mapHubForSave(hub));
      return convertHub(response);
    },
    updateBackgroundImages: async (_parent, { input }, { dataSources, auth }): Promise<Hub> => {
      LOG.debug('Background', input);
      const accountMappingId = getAccountMappingId(auth);
      const hubResponse = await dataSources.videoCenterClient.getHub(input.hubId);
      const hub = convertHubV2(hubResponse);

      hub.theme.backgroundImageUrl = input.backgroundImageUrl;
      hub.theme.backgroundOriginalImageUrl = input.backgroundOriginalImageUrl;
      hub.theme.backgroundImageAltText = input.backgroundImageAltText;
      if (input.newBackgroundImageUrl && input.newBackgroundImageUrl !== input.backgroundImageUrl) {
        const { originalImageUrl, optimizedImageUrl } = await publishImage(
          {
            newImageUrl: input.newBackgroundImageUrl,
            newOriginalImageUrl: input.newBackgroundOriginalImageUrl,
            imageUrl: input.backgroundImageUrl,
            originalImageUrl: input.backgroundOriginalImageUrl
          },
          {
            accountMappingId,
            centerId: hub.id,
            entityId: hub.id,
            entityType: EntityType.BackgroundImage
          },
          dataSources
        );
        hub.theme.backgroundImageUrl = optimizedImageUrl;
        hub.theme.backgroundOriginalImageUrl = originalImageUrl;
      }

      const response: HubDataSourceRecord = await dataSources.videoCenterClient.hubUpdate(hub.id, mapHubForSave(hub));
      return convertHub(response);
    },
    setUtmOverrides: async (_parent, { input, data }, { dataSources }, _info): Promise<UtmOverride[]> => {
      LOG.debug('set UTM overrides list for video center =', input.id);
      return dataSources.videoCenterClient.setUtmOverrides(input.id, data);
    },
    setTranslations: async (
      _parent,
      { input, locale, data },
      { dataSources },
      _info
    ): Promise<TranslationUpdateResponse> => {
      LOG.debug('set translations for video center =', input.id);
      return dataSources.videoCenterClient.setTranslations(input.id, locale, data);
    },
    resetTranslations: async (_parent, { input }, { dataSources }, _info): Promise<string> => {
      LOG.debug('Reset translations for video center =', input.hubId);
      return dataSources.videoCenterClient.resetTranslations(input.hubId, input.locale, input.type);
    },
    upsertHubCustomizations: async (_parent, { id, input }, { dataSources }): Promise<Customizations> => {
      LOG.debug('upsertHubCustomizations', id.id);
      let hubCustomizations = await dataSources.videoCenterClient.getHubCustomizations(id.id);
      hubCustomizations = { ...hubCustomizations, ...input };
      return dataSources.videoCenterClient.upsertHubCustomizations(id.id, hubCustomizations);
    },
    updateRegistrationFormSettings: async (_parent, { input }, { dataSources }): Promise<RegistrationFormSettings> => {
      LOG.debug('updateGetRegistrationFormSettings', input);
      return dataSources.videoCenterClient.updateRegistrationFormSettings(input);
    },
    createPage: async (_parent, { page, newSection }, { dataSources, auth }, _info): Promise<PageWithSection> => {
      LOG.debug('createPage', page.videoCenterId);
      const pageInput = omit(page, ['section']);
      const accountMappingId = getAccountMappingId(auth);
      const newPage = await dataSources.videoCenterClient.createPage(pageInput);
      if (newSection) {
        const section = await dataSources.videoCenterClient.createSection(page.videoCenterId, {
          ...newSection,
          originPageId: newPage.pageId
        });
        const processedSection = await processNewSectionImage(section, newPage.pageId, accountMappingId, dataSources);
        const finalSection = await dataSources.videoCenterClient.updateSection(page.videoCenterId, processedSection);
        return { page: newPage, newSection: finalSection };
      }
      return { page: newPage };
    },
    updatePage: async (_parent, { data }, { dataSources }, _info): Promise<Page> => {
      LOG.debug('updatePage', data.videoCenterId);
      return dataSources.videoCenterClient.updatePage(data);
    },
    createSection: async (_parent, { input, data }, { dataSources, auth }, _info): Promise<PageSection> => {
      LOG.debug('createSection', input.id, data);
      const accountMappingId = getAccountMappingId(auth);
      await dataSources.videoCenterClient.createSection(input.id, data);
      // "data" is passed here because PageSectionInput contains the newImage* properties while the PageSection returned from createSection does not
      const processedSection = await processNewSectionImage(data, input.id, accountMappingId, dataSources);
      return dataSources.videoCenterClient.updateSection(input.id, processedSection);
    },
    updateSection: async (_parent, { input, data }, { dataSources, auth }, _info): Promise<PageSection> => {
      LOG.debug('updateSection', input.id, data);
      const section: PageSectionInput = data;
      const accountMappingId = getAccountMappingId(auth);
      const processedSection = await processNewSectionImage(section, input.id, accountMappingId, dataSources);
      return dataSources.videoCenterClient.updateSection(input.id, processedSection);
    }
  }
};

export default resolver;
