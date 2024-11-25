import { convertBannerAssociation, convertHub, convertHubV2, mapHubForSave } from '../../videoCenterService/mappers';
import HubDataSourceItem from '../../__TestUtils__/fixtures/HubDataSourceItem.json';
import HubDataSourceItemV2 from '../../__TestUtils__/fixtures/HubDataSourceItemV2.json';

const UnpersistedHubDataSourceItem: HubDataSourceItem = {
  locale: HubDataSourceItem.locale,
  url: HubDataSourceItem.url,
  title: HubDataSourceItem.title,
  ownerEmail: HubDataSourceItem.ownerEmail,
  ownerFirstName: HubDataSourceItem.ownerFirstName,
  ownerLastName: HubDataSourceItem.ownerLastName,
  actionColor: HubDataSourceItem.actionColor,
  backgroundColor: HubDataSourceItem.backgroundColor,
  mainColor: HubDataSourceItem.mainColor,
  logoImageRelativePath: HubDataSourceItem.logoImageRelativePath,
  logoImageUrl: HubDataSourceItem.logoImageUrl,
  logoAltText: HubDataSourceItem.logoAltText,
  backgroundImageUrl: HubDataSourceItem.backgroundImageUrl,
  backgroundOriginalImageUrl: HubDataSourceItem.backgroundOriginalImageUrl,
  calendarId: HubDataSourceItem.calendarId,
  moodColor: HubDataSourceItem.moodColor,
  themeSafeMode: HubDataSourceItem.themeSafeMode,
  helpEmailAddress: HubDataSourceItem.helpEmailAddress,
  faviconUrl: HubDataSourceItem.faviconUrl,
  headingsFontId: HubDataSourceItem.headingsFontId,
  bodyFontId: HubDataSourceItem.bodyFontId,
  loginType: HubDataSourceItem.loginType,
  organizationId: HubDataSourceItem.organizationId
};

const HubGraphItem = {
  id: HubDataSourceItem.id,
  status: HubDataSourceItem.status,
  config: {
    title: HubDataSourceItem.title,
    ownerEmail: HubDataSourceItem.ownerEmail,
    ownerFirstName: HubDataSourceItem.ownerFirstName,
    ownerLastName: HubDataSourceItem.ownerLastName,
    locale: HubDataSourceItem.locale,
    url: HubDataSourceItem.url,
    helpEmailAddress: HubDataSourceItem.helpEmailAddress,
    loginType: HubDataSourceItem.loginType,
    organizationId: HubDataSourceItem.organizationId
  },
  theme: {
    actionColor: HubDataSourceItem.actionColor,
    backgroundColor: HubDataSourceItem.backgroundColor,
    mainColor: HubDataSourceItem.mainColor,
    logoImageRelativePath: HubDataSourceItem.logoImageRelativePath,
    logoImageUrl: HubDataSourceItem.logoImageUrl,
    logoAltText: HubDataSourceItem.logoAltText,
    backgroundImageUrl: HubDataSourceItem.backgroundImageUrl,
    backgroundOriginalImageUrl: HubDataSourceItem.backgroundOriginalImageUrl,
    moodColor: HubDataSourceItem.moodColor,
    safeMode: HubDataSourceItem.themeSafeMode,
    faviconUrl: HubDataSourceItem.faviconUrl,
    headingsFont: HubDataSourceItem.headingsFontId,
    bodyFont: HubDataSourceItem.bodyFontId
  },
  calendar: {
    id: HubDataSourceItem.calendarId
  }
};

const HubGraphItemV2 = {
  id: HubDataSourceItemV2.id,
  status: HubDataSourceItemV2.status,
  config: {
    title: HubDataSourceItemV2.title,
    ownerEmail: HubDataSourceItemV2.owner.email,
    ownerFirstName: HubDataSourceItemV2.owner.firstName,
    ownerLastName: HubDataSourceItemV2.owner.lastName,
    locale: HubDataSourceItemV2.locale,
    url: HubDataSourceItemV2.url,
    helpEmailAddress: HubDataSourceItemV2.helpEmailAddress,
    loginType: HubDataSourceItemV2.login.type,
    organizationId: HubDataSourceItemV2.login.organizationId
  },
  theme: {
    actionColor: HubDataSourceItemV2.colors.action,
    backgroundColor: HubDataSourceItemV2.colors.background,
    mainColor: HubDataSourceItemV2.colors.main,
    logoImageUrl: HubDataSourceItemV2.logo.url,
    logoAltText: HubDataSourceItemV2.logo.altText,
    backgroundImageUrl: HubDataSourceItemV2.background.url,
    backgroundOriginalImageUrl: HubDataSourceItemV2.background.originalUrl,
    moodColor: HubDataSourceItemV2.colors.mood,
    safeMode: HubDataSourceItemV2.themeSafeMode,
    faviconUrl: HubDataSourceItemV2.faviconUrl,
    headingsFont: HubDataSourceItemV2.fonts.headingId,
    bodyFont: HubDataSourceItemV2.fonts.bodyId
  },
  calendar: {
    id: HubDataSourceItemV2.calendar.id
  }
};

const BannerAssociationItem = {
  banner: '1234-abcd',
  displayOrder: 1
};

const BannerIdAssociationItem = {
  banner: {
    id: '1234-abcd'
  },
  displayOrder: 1
};

describe('convertHub(HubDataSourceRecord)', () => {
  it('maps HubDataSourceRecord representation to Hub GraphQL representation', () => {
    expect(convertHub(HubDataSourceItem)).toEqual(HubGraphItem);
  });
});

describe('convertHubV2(HubDataSourceRecord)', () => {
  it('maps HubDataSourceRecord representation to Hub GraphQL representation', () => {
    expect(convertHubV2(HubDataSourceItemV2)).toEqual(HubGraphItemV2);
  });
});

describe('mapHubForSave()', () => {
  it('maps Hub GraphQL representation to HubDataSourceRecord representation', () => {
    expect(mapHubForSave(HubGraphItem)).toEqual(UnpersistedHubDataSourceItem);
  });
});

describe('convertBannerAssociation(BannerAssociationItem))', () => {
  it('maps graphQL bannerAssociation representation to VHS bannerIdAssocation representation', () => {
    expect(convertBannerAssociation(BannerAssociationItem)).toEqual(BannerIdAssociationItem);
  });
});
