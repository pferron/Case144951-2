import { ApolloClient, FetchResult, NormalizedCacheObject } from '@apollo/client';
import {
  Hub,
  HubCreate,
  HubSearch,
  HubUpdate,
  HubUpdateSettings,
  Settings,
  BannerAssociationSearch,
  BannerSearch,
  BannerAssociationPaging,
  BannerPagingResponse,
  Feature,
  FeatureInput,
  BannerAssociationCreate,
  HubsPagingResponse,
  Hubs,
  MemberLoginInput,
  MemberLoginResponse,
  HubPages,
  BannerHubSearch,
  HubLocalesWithDefault,
  UtmOverride,
  TranslationSearch,
  TranslationPagingResponse,
  TranslationUpdateResponse,
  CustomizationsInput,
  ResetTranslationSearch,
  Customizations,
  RegistrationFormSettings,
  UpdateRegistrationFormSettingInput,
  PageInput,
  PageWithSections,
  PageSectionInput,
  PageSection,
  Page,
  PageWithSection
} from '@cvent/planner-event-hubs-model/types';
import {
  hub,
  newHub,
  existingHub,
  deleteHub,
  updateSettings,
  hubSettings,
  publishHub,
  hubBanners,
  updateBannerAssociations,
  bannerAssociations,
  getHubTermsEditPermission,
  centerFeatures,
  updateCenterFeature,
  hubs,
  hubPages,
  hubPagesWithBanner,
  hubLocales,
  addHubLocales,
  updateBrandingImages,
  getUtmOverrides,
  setUtmOverrides,
  setTranslations,
  getTranslations,
  resetTranslations,
  registrationFormSettings,
  updateRegistrationFormSettingsMutation,
  deleteToken
} from '@queries/hub';
import { memberLogin } from '@cvent/planner-event-hubs-model/operations/login';
import {
  createPageMutation,
  createSectionMutation,
  getPageQuery,
  updatePageMutation,
  updateSectionMutation,
  getPublishedPageOrDefaults as getPublishedPageOrDefaultsQuery
} from '@cvent/planner-event-hubs-model/operations/homepageCustomization';
import {
  getHubCustomizationsQuery,
  upsertHubCustomizationsMutation
} from '@cvent/planner-event-hubs-model/operations/hub';
import {} from '@cvent/planner-event-hubs-model/operations/index';

export const rawCreateHub = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubCreate
): Promise<FetchResult> => {
  return client.mutate({
    mutation: newHub,
    variables: {
      input
    }
  });
};

export const createHub = async (client: ApolloClient<NormalizedCacheObject>, input: HubCreate): Promise<string> => {
  return (await rawCreateHub(client, input)).data.hubCreate;
};

export const rawUpdateHub = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubUpdate
): Promise<FetchResult> => {
  return client.mutate({
    mutation: existingHub,
    variables: {
      input
    }
  });
};

export const rawUpdateHubSettings = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubUpdateSettings
): Promise<FetchResult> => {
  return client.mutate({
    mutation: updateSettings,
    variables: {
      input
    }
  });
};

export const rawDeleteHub = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubSearch
): Promise<FetchResult> => {
  return client.mutate({
    mutation: deleteHub,
    variables: {
      input
    }
  });
};

export const rawDeleteToken = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubSearch
): Promise<FetchResult> => {
  return client.mutate({
    mutation: deleteToken,
    variables: {
      input
    }
  });
};

export const centerFeatureUpdate = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: FeatureInput
): Promise<Feature> => {
  const response = await client.mutate({
    mutation: updateCenterFeature,
    variables: {
      input
    }
  });
  return response.data.updateCenterFeature;
};

export const getHubs = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: Hubs = {}
): Promise<HubsPagingResponse> => {
  const response = await client.query({
    query: hubs,
    variables: {
      input
    }
  });
  return response.data.hubs;
};

export const getHub = async (client: ApolloClient<NormalizedCacheObject>, id: string): Promise<Hub> => {
  const response = await client.query({
    query: hub,
    variables: {
      id: {
        id
      }
    }
  });
  return response.data.hub;
};

export const getHubPages = async (client: ApolloClient<NormalizedCacheObject>, id: string): Promise<HubPages> => {
  const response = await client.query({
    query: hubPages,
    variables: {
      id: {
        id
      }
    }
  });
  return response.data.hubPages;
};

export const getHubPagesWithBanner = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: BannerHubSearch
): Promise<HubPages> => {
  const response = await client.query({
    query: hubPagesWithBanner,
    variables: {
      input
    }
  });
  return response.data.hubPagesWithBanner;
};

export const getHubSettings = async (client: ApolloClient<NormalizedCacheObject>, id: string): Promise<Settings> => {
  const response = await client.query({
    query: hubSettings,
    variables: {
      id: {
        id
      }
    }
  });
  return response.data;
};

export const getHubTermsEditAllowed = async (
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<string> => {
  const response = await client.query({
    query: getHubTermsEditPermission,
    variables: {
      id: {
        id
      }
    }
  });
  return response.data;
};

export const hubPublish = async (client: ApolloClient<NormalizedCacheObject>, input: HubSearch): Promise<void> => {
  await client.mutate({
    mutation: publishHub,
    variables: {
      input
    }
  });
};

export const getHubBanners = async (
  client: ApolloClient<NormalizedCacheObject>,
  bannerSearch: BannerSearch
): Promise<BannerPagingResponse> => {
  const response = await client.query({
    query: hubBanners,
    variables: {
      bannerSearch
    }
  });
  return response.data.hubBanners;
};

export const getBannerAssociations = async (
  client: ApolloClient<NormalizedCacheObject>,
  bannerAssociationSearch: BannerAssociationSearch
): Promise<BannerAssociationPaging> => {
  const response = await client.query({
    query: bannerAssociations,
    variables: {
      bannerAssociationSearch
    }
  });
  return response.data.bannerAssociations;
};

export const setBannerAssociations = async (
  client: ApolloClient<NormalizedCacheObject>,
  bannerAssociationCreate: BannerAssociationCreate
): Promise<BannerAssociationPaging> => {
  const response = await client.mutate({
    mutation: updateBannerAssociations,
    variables: {
      input: bannerAssociationCreate
    }
  });
  return response.data.setBannerAssociations;
};

export const getRegistrationFormSettings = async (
  client: ApolloClient<NormalizedCacheObject>,
  hubId: string
): Promise<RegistrationFormSettings> => {
  const response = await client.query({
    query: registrationFormSettings,
    variables: {
      input: {
        hubId
      }
    }
  });
  return response.data.getRegistrationFormSettings;
};

export const updateRegistrationFormSettings = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: UpdateRegistrationFormSettingInput
): Promise<RegistrationFormSettings> => {
  const response = await client.mutate({
    mutation: updateRegistrationFormSettingsMutation,
    variables: {
      input: {
        hubId: input.hubId,
        data: input.data
      }
    }
  });
  return response.data.updateRegistrationFormSettings;
};

export const getCenterFeatures = async (
  client: ApolloClient<NormalizedCacheObject>,
  id: HubSearch
): Promise<Feature[]> => {
  const response = await client.query({
    query: centerFeatures,
    variables: {
      id
    }
  });
  return response.data.getCenterFeatures;
};

// login flow

export const initiateMemberLogin = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: MemberLoginInput
): Promise<MemberLoginResponse> => {
  const response = await client.query({
    query: memberLogin,
    variables: {
      memberLoginInput: input
    }
  });
  return response.data.memberLogin;
};

export const getHubLocales = async (
  client: ApolloClient<NormalizedCacheObject>,
  id
): Promise<HubLocalesWithDefault> => {
  const response = await client.query({
    query: hubLocales,
    variables: {
      id
    }
  });
  return response.data.getHubLocales;
};

export const AddToHubLocales = async (
  client: ApolloClient<NormalizedCacheObject>,
  input
): Promise<HubLocalesWithDefault> => {
  const response = await client.mutate({
    mutation: addHubLocales,
    variables: input
  });
  return response.data.addHubLocales;
};

export const rawUpdateBrandingImages = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubUpdate
): Promise<FetchResult> => {
  return client.mutate({
    mutation: updateBrandingImages,
    variables: {
      input
    }
  });
};

export const getHubUtmOverrides = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubSearch
): Promise<UtmOverride[]> => {
  const response = await client.query({
    query: getUtmOverrides,
    variables: {
      input
    }
  });
  return response.data.getUtmOverrides;
};

export const setHubUtmOverrides = async (
  client: ApolloClient<NormalizedCacheObject>,
  input,
  data
): Promise<UtmOverride[]> => {
  const response = await client.mutate({
    mutation: setUtmOverrides,
    variables: {
      input,
      data
    }
  });
  return response.data.setUtmOverrides;
};

export const getHubTranslations = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: TranslationSearch
): Promise<TranslationPagingResponse> => {
  const response = await client.query({
    query: getTranslations,
    variables: {
      input
    }
  });
  return response.data.getTranslations;
};

export const setHubTranslations = async (
  client: ApolloClient<NormalizedCacheObject>,
  input,
  locale,
  data
): Promise<TranslationUpdateResponse> => {
  const response = await client.mutate({
    mutation: setTranslations,
    variables: {
      input,
      locale,
      data
    }
  });
  return response.data.setTranslations;
};

export const resetHubTranslations = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: ResetTranslationSearch
): Promise<FetchResult> => {
  return client.mutate({
    mutation: resetTranslations,
    variables: {
      input
    }
  });
};

export const getHubCustomizations = async (
  client: ApolloClient<NormalizedCacheObject>,
  id: string
): Promise<Customizations> => {
  const response = await client.query({
    query: getHubCustomizationsQuery,
    variables: {
      id: {
        id
      }
    }
  });
  return response.data.getHubCustomizations;
};

export const upsertHubCustomizations = async (
  client: ApolloClient<NormalizedCacheObject>,
  id: HubSearch,
  input: CustomizationsInput
): Promise<Customizations> => {
  const response = await client.mutate({
    mutation: upsertHubCustomizationsMutation,
    variables: {
      id,
      input
    }
  });
  return response.data.upsertHubCustomizations;
};

export const getPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  id: HubSearch
): Promise<PageWithSections> => {
  const response = await client.mutate({
    mutation: getPageQuery,
    variables: {
      input: id
    }
  });
  return response.data.getPage;
};

export const createPage = async (
  client: ApolloClient<NormalizedCacheObject>,
  page: PageInput,
  newSection?: PageSectionInput
): Promise<PageWithSection> => {
  const response = await client.mutate({
    mutation: createPageMutation,
    variables: {
      page,
      newSection
    }
  });
  return response.data.createPage;
};

export const updatePage = async (client: ApolloClient<NormalizedCacheObject>, data: PageInput): Promise<Page> => {
  const response = await client.mutate({
    mutation: updatePageMutation,
    variables: {
      data
    }
  });
  return response.data.updatePage;
};

export const createSection = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubSearch,
  data: PageSectionInput
): Promise<PageSection> => {
  const response = await client.mutate({
    mutation: createSectionMutation,
    variables: {
      input,
      data
    }
  });
  return response.data.createSection;
};

export const updateSection = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubSearch,
  data: PageSectionInput
): Promise<PageSection> => {
  const response = await client.mutate({
    mutation: updateSectionMutation,
    variables: {
      input,
      data
    }
  });
  return response.data.updateSection;
};

export const getPublishedPageOrDefaults = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: HubSearch
): Promise<PageWithSections> => {
  const response = await client.query({
    query: getPublishedPageOrDefaultsQuery,
    variables: {
      input
    }
  });
  return response.data.getPublishedPageOrDefaults;
};
