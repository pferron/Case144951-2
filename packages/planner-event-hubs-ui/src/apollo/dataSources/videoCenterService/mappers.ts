import {
  BannerAssociation,
  BannerIdAssociation,
  Channel,
  Hub,
  HubCreate,
  Paging,
  HubDataSourceRecord
} from '@cvent/planner-event-hubs-model/types';
import { HubDataSourceRecordV2 } from '@dataSources/videoCenterService/client';

// transform hub returned from API to graphql Hub type
const convertHubV2 = (hub: HubDataSourceRecordV2): Hub => {
  return {
    id: hub.id,
    status: hub.status,
    config: {
      title: hub?.title,
      ownerFirstName: hub?.owner?.firstName,
      ownerLastName: hub?.owner?.lastName,
      ownerEmail: hub?.owner?.email,
      url: hub?.url,
      locale: hub?.locale,
      accountMappingId: hub?.accountMappingId,
      helpEmailAddress: hub?.helpEmailAddress,
      utmOverride: hub?.utmOverride,
      autoDetectBrowserLocale: hub?.autoDetectBrowserLocale,
      customDomain: hub?.customDomain,
      loginType: hub?.login?.type,
      organizationId: hub?.login?.organizationId
    },
    theme: {
      actionColor: hub?.colors?.action,
      backgroundColor: hub?.colors?.background,
      logoImageUrl: hub?.logo?.url,
      logoOriginalImageUrl: hub?.logo?.originalUrl,
      backgroundImageUrl: hub?.background?.url,
      backgroundOriginalImageUrl: hub?.background?.originalUrl,
      backgroundImageAltText: hub?.background?.altText,
      mainColor: hub?.colors?.main,
      logoAltText: hub?.logo?.altText,
      moodColor: hub?.colors?.mood,
      safeMode: hub?.themeSafeMode,
      faviconUrl: hub?.faviconUrl,
      headingsFont: hub?.fonts?.headingId,
      bodyFont: hub?.fonts?.bodyId
    },
    calendar: {
      id: hub?.calendar?.id
    }
  };
};

// transform hub returned from API to graphql Hub type
const convertHub = (hub: HubDataSourceRecord): Hub => {
  return {
    id: hub.id,
    status: hub.status,
    config: {
      title: hub?.title,
      ownerFirstName: hub?.ownerFirstName,
      ownerLastName: hub?.ownerLastName,
      ownerEmail: hub?.ownerEmail,
      url: hub?.url,
      locale: hub?.locale,
      accountMappingId: hub?.accountMappingId,
      helpEmailAddress: hub?.helpEmailAddress,
      utmOverride: hub?.utmOverride,
      autoDetectBrowserLocale: hub?.autoDetectBrowserLocale,
      customDomain: hub?.customDomain,
      loginType: hub?.loginType,
      organizationId: hub?.organizationId
    },
    theme: {
      actionColor: hub?.actionColor,
      backgroundColor: hub?.backgroundColor,
      logoImageRelativePath: hub?.logoImageRelativePath,
      logoImageUrl: hub?.logoImageUrl,
      logoOriginalImageUrl: hub?.logoOriginalImageUrl,
      backgroundImageUrl: hub?.backgroundImageUrl,
      backgroundOriginalImageUrl: hub?.backgroundOriginalImageUrl,
      backgroundImageAltText: hub?.backgroundImageAltText,
      mainColor: hub?.mainColor,
      logoAltText: hub?.logoAltText,
      moodColor: hub?.moodColor,
      safeMode: hub?.themeSafeMode,
      faviconUrl: hub?.faviconUrl,
      headingsFont: hub?.headingsFontId,
      bodyFont: hub?.bodyFontId
    },
    calendar: {
      id: hub?.calendarId
    }
  };
};

// transform a hubCreate back into a hub for the service
const mapHubForSave = (input: HubCreate): HubDataSourceRecord => {
  return {
    title: input.config?.title,
    ownerFirstName: input.config?.ownerFirstName,
    ownerLastName: input.config?.ownerLastName,
    ownerEmail: input.config?.ownerEmail,
    locale: input.config?.locale,
    helpEmailAddress: input.config?.helpEmailAddress,
    actionColor: input.theme?.actionColor,
    backgroundColor: input.theme?.backgroundColor,
    logoImageRelativePath: input.theme?.logoImageRelativePath,
    logoImageUrl: input.theme?.logoImageUrl,
    logoOriginalImageUrl: input.theme?.logoOriginalImageUrl,
    backgroundImageUrl: input?.theme?.backgroundImageUrl,
    backgroundOriginalImageUrl: input?.theme?.backgroundOriginalImageUrl,
    backgroundImageAltText: input?.theme?.backgroundImageAltText,
    logoAltText: input.theme?.logoAltText,
    mainColor: input.theme?.mainColor,
    url: input.config?.url,
    calendarId: input.calendar?.id,
    themeSafeMode: input.theme?.safeMode,
    moodColor: input.theme?.moodColor,
    faviconUrl: input.theme?.faviconUrl,
    utmOverride: input.config?.utmOverride,
    headingsFontId: input.theme?.headingsFont,
    bodyFontId: input.theme?.bodyFont,
    autoDetectBrowserLocale: input.config?.autoDetectBrowserLocale,
    customDomain: input.config?.customDomain,
    loginType: input.config?.loginType,
    organizationId: input.config?.organizationId
  };
};

// transform banner association into banner id association item for VHS
const convertBannerAssociation = (input: BannerAssociation): BannerIdAssociation => {
  return {
    banner: {
      id: input.banner
    },
    displayOrder: input.displayOrder
  };
};

export interface PaginatedChannels {
  paging: Paging;
  data: Channel[];
}

export { convertHub, convertHubV2, mapHubForSave, convertBannerAssociation };
