import {
  BannerPagingResponse,
  Hub,
  HubUpdateSettings,
  Feature,
  HubPages,
  HubUpdate,
  GuestVisibility,
  BrandingImagesInput,
  NavigationAlignment,
  UpdateRegistrationFormSettingInput,
  NavigationLinkHighlightStyle,
  BackgroundImagesInput
} from '@cvent/planner-event-hubs-model/types';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import {
  mockDataSource,
  getMockResolverRequestWithDataSources,
  mockDataSourceError,
  mockDataSourceOnce,
  mockDataSourceAgain
} from '@resolvers/common/testUtils/mockRequestData';
import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { ImageLookupClient } from '@dataSources/imageLookupService/client';
import { totalRegistrationData } from '@dataSources/__TestUtils__/fixtures/registrationCountData';
import { RegistrationFieldCode } from '@cvent/planner-event-hubs-model/operations';
import { VideoHubUIClient } from '@dataSources/videoHubUI/client';
import hubResolver from '../hub/index';
import hubUpdateSettingsResponse from './fixtures/hubUpdateSettingsResponse.json';
import hubResponse from './fixtures/hubResponse.json';
import hubListResponse from './fixtures/hubListResponse.json';
import getHubSettingsResponse from '../fixtures/getHubSettingsResponse.json';
import videoCenterListResponse from './fixtures/videoCenterListResponse.json';
import videoCenterResponse from './fixtures/videoCenterResponse.json';
import videoCenterUpdateFeature from './fixtures/videoCenterUpdateFeature.json';

const centerId = '0624f8ef-e9e1-4304-bbf5-63827e61a322';
const updateSettingsInput = {
  input: {
    id: centerId,
    hubSettings: {
      displayPrivacyPolicy: true,
      termsText: 'Sample Text',
      memberProfilePublic: true,
      allowTurnOffGoogleAnalytics: false,
      profileCard: {
        allowNameEdit: false
      },
      guestVisibility: GuestVisibility.VideoPlaybackPrivate,
      registrationSettings: {
        allowAllContactsRegistration: false,
        allowContactGroupsRegistration: true,
        allowContactTypesRegistration: true,
        blockContactsRegistration: true,
        blockListRegistration: true
      },
      cookieLists: {
        enableCvent: true,
        cventUrl: 'https://www.cvent.com/en/appcookies',
        enableCustom: true,
        customUrl: 'https://www.customUrl.com',
        customLinkText: 'Custom Url text'
      }
    }
  }
};
const hubInput = { id: { id: centerId } };
let hubUpdateInput: { input: HubUpdate };
const getFeaturesListResponse = [
  {
    code: 'PROFILE_SETUP',
    enabled: false
  }
];

const bannerSearchQueryArgs = {
  bannerSearch: { hubId: centerId, token: 'token', limit: 10 }
};

const hubPagesWithBannerInput = {
  input: { hubId: centerId, bannerId: '1234-abcd' }
};

const bannerAssociationInput = {
  input: { centerId, entityId: '1234-abcd', entityType: 'Channel', bannerAssociation: [] }
};

const getHubsQueryArgs = {
  getHubs: { token: 'token', limit: 10 }
};

describe('resolvers/hub/index', () => {
  let dataSources;
  let graphCall: <T>(arg0: string) => Promise<T>;

  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient(),
      videoHubUiClient: new VideoHubUIClient(),
      s3ProxyServiceClient: new S3ProxyClient(),
      imageLookupClient: new ImageLookupClient()
    };
    graphCall = <T>(mutation: string): Promise<T> =>
      resolveMutationResponse(
        hubResolver,
        mutation,
        getMockResolverRequestWithDataSources(`Mutation.${mutation}`, dataSources, updateSettingsInput)
      );
  });

  describe('getHubSettings', () => {
    it('Should fetch privacy settings of a hub', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', getHubSettingsResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubSettings', dataSources, hubInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getHubSettings', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toMatchObject(getHubSettingsResponse);
    });

    it('Should not get privacy settings: Unauthorized request', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Unauthorised', '401');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubSettings', dataSources, hubInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveQueryResponse(hubResolver, 'getHubSettings', resolverRequest);
      }).rejects.toThrow('Unauthorised');
    });
  });

  describe('hubUpdateSettings', () => {
    it('Should update settings of a hub', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', hubUpdateSettingsResponse);
      const response = await graphCall<HubUpdateSettings>('hubUpdateSettings');

      expect(response).toBeTruthy();
      expect(response).toMatchObject(hubUpdateSettingsResponse);
    });

    it('Should throw unauthorized', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'put', 'Unauthorised', '401');
      await expect(async () => {
        await graphCall('hubUpdateSettings');
      }).rejects.toThrow('Unauthorised');
    });
  });

  describe('UpdateRegistrationFormSettings', () => {
    it('Should update registration form settings of a hub', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', {
        hubId: centerId,
        data: [
          {
            code: 'JOB_TITLE',
            order: 3,
            required: false,
            included: true
          }
        ]
      });
      const response = await graphCall<UpdateRegistrationFormSettingInput>('updateRegistrationFormSettings');

      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        data: [
          {
            code: 'JOB_TITLE',
            order: 3,
            required: false,
            included: true
          }
        ]
      });
    });

    it('Should throw unauthorized', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'put', 'Unauthorised', '401');
      await expect(async () => {
        await graphCall('updateRegistrationFormSettings');
      }).rejects.toThrow('Unauthorised');
    });
  });

  describe('UpdateCenterFeature', () => {
    it('Should update feature status for a center', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', videoCenterUpdateFeature);
      const response = await graphCall<Feature>('updateCenterFeature');

      expect(response).toBeTruthy();
      expect(response).toMatchObject(videoCenterUpdateFeature);
    });

    it('Should throw unauthorized', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'put', 'Unauthorised', '401');
      await expect(async () => {
        await graphCall('updateCenterFeature');
      }).rejects.toThrow('Unauthorised');
    });
  });

  describe('hubs', () => {
    it('maps .data from dataSources.videoCenterClient response into GraphQL representation', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', hubListResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.hubs', dataSources, getHubsQueryArgs);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'hubs', resolverRequest);
      const videoCenter = videoCenterListResponse.data[0];
      const expected = {
        id: videoCenter.id,
        status: videoCenter.status,
        config: {
          title: videoCenter.title,
          url: videoCenter.url,
          locale: videoCenter.locale,
          ownerEmail: videoCenter.ownerEmail,
          ownerFirstName: videoCenter.ownerFirstName,
          ownerLastName: videoCenter.ownerLastName,
          loginType: videoCenter.loginType,
          organizationId: videoCenter.organizationId
        },
        theme: {
          actionColor: videoCenter.actionColor,
          mainColor: videoCenter.mainColor,
          backgroundColor: videoCenter.backgroundColor,
          logoImageUrl: videoCenter.logoImageUrl,
          logoAltText: videoCenter.logoAltText,
          backgroundImageUrl: videoCenter.backgroundImageUrl,
          backgroundOriginalImageUrl: videoCenter.backgroundOriginalImageUrl,
          faviconUrl: videoCenter.faviconUrl
        },
        calendar: {
          id: videoCenter.calendarId
        }
      };
      expect(response.data[0]).toMatchObject(expected);
    });

    it('maps .paging from dataSources.videoCenterClient response into GraphQL representation', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterListResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.hubs', dataSources, getHubsQueryArgs);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'hubs', resolverRequest);
      const expected = {
        nextToken: videoCenterListResponse.paging.nextToken,
        currentToken: videoCenterListResponse.paging.currentToken,
        limit: videoCenterListResponse.paging.limit,
        totalCount: videoCenterListResponse.paging.totalCount
      };
      expect(response.paging).toMatchObject(expected);
    });

    it('bubbles up errors', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Whatever', '4321');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.hubs', dataSources, hubInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveQueryResponse(hubResolver, 'hubs', resolverRequest);
      }).rejects.toThrow('Whatever');
    });
  });

  describe('hub', () => {
    it('maps from dataSources.videoCenterClient response into GraphQL representation', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', hubResponse);

      const resolverRequest = getMockResolverRequestWithDataSources('Query.hub', dataSources, hubInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'hub', resolverRequest);
      const videoCenter = videoCenterResponse;
      const expected = {
        id: videoCenter.id,
        status: videoCenter.status,
        config: {
          title: videoCenter.title,
          url: videoCenter.url,
          locale: videoCenter.locale,
          ownerEmail: videoCenter.ownerEmail,
          ownerFirstName: videoCenter.ownerFirstName,
          ownerLastName: videoCenter.ownerLastName,
          loginType: videoCenter.loginType,
          organizationId: videoCenter.organizationId
        },
        theme: {
          actionColor: videoCenter.actionColor,
          mainColor: videoCenter.mainColor,
          backgroundColor: videoCenter.backgroundColor,
          logoImageUrl: videoCenter.logoImageUrl,
          logoOriginalImageUrl: videoCenter.logoOriginalImageUrl,
          backgroundImageUrl: videoCenter.backgroundImageUrl,
          backgroundOriginalImageUrl: videoCenter.backgroundOriginalImageUrl,
          faviconUrl: videoCenter.faviconUrl
        },
        calendar: {
          id: videoCenter.calendarId
        }
      };
      expect(response).toMatchObject(expected);
    });

    it('bubbles up errors', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Whatever', '4321');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.hub', dataSources, hubInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveQueryResponse(hubResolver, 'hub', resolverRequest);
      }).rejects.toThrow('Whatever');
    });
  });

  describe('hubUpdate', () => {
    beforeEach(() => {
      hubUpdateInput = {
        input: {
          id: 'hub-update-id',
          config: {
            title: 'Updated Hub Title',
            ownerFirstName: 'Updated',
            ownerLastName: 'Hub',
            ownerEmail: 'updated@j.mail'
          },
          theme: {
            logoImageUrl: 'https://images-lower.cvent.com/bogus/imageJKLWJEF234!_!WJIOEJF89234.jpg',
            logoOriginalImageUrl: 'https://s3.amazonaws.com/cvent/account/bogus/image.jpg',
            faviconUrl: 'https://example.com',
            backgroundImageUrl: 'https://s3.amazonaws.com/bucket/scope/logo.png',
            backgroundOriginalImageUrl: 'https://example.com'
          }
        }
      };
    });
    it('updates a hub when newLogoImage fields are NOT present', async () => {
      mockDataSource(dataSources.videoCenterClient, 'listHubLocales', { locales: [] });
      mockDataSource(dataSources.videoCenterClient, 'updateHubLocales', []);
      mockDataSource(dataSources.videoCenterClient, 'put', videoCenterResponse);
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.hubUpdate', dataSources, hubUpdateInput);
      const response = await resolveMutationResponse(hubResolver, 'hubUpdate', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toEqual(videoCenterResponse.id);
    });

    it('bubbles up errors', async () => {
      mockDataSource(dataSources.videoCenterClient, 'listHubLocales', { locales: [] });
      mockDataSource(dataSources.videoCenterClient, 'updateHubLocales', []);
      mockDataSourceError(dataSources.videoCenterClient, 'put', 'Goldilocks', 'abc');
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterResponse);
      await expect(async () => {
        await graphCall('hubUpdate');
      }).rejects.toThrow('Goldilocks');
    });

    it('updates a hub when newLogoImage fields are present', async () => {
      const movedFileUrl = 'https://image-lower.cvent.com/final/resting/place/image.jpg';
      const optimizedImageUrl =
        'https://image-lower.cvent.com/final/resting/place/imageJWIKOEJFOWIEJ!_!JIOWJEF23842.jpg';
      mockDataSource(dataSources.s3ProxyServiceClient, 'moveFile', movedFileUrl);
      mockDataSource(dataSources.imageLookupClient, 'lookup', {
        data: {
          [movedFileUrl]: {
            height: 100,
            width: 100,
            hashedURL: optimizedImageUrl
          }
        }
      });
      mockDataSource(dataSources.videoCenterClient, 'listHubLocales', { locales: [] });
      mockDataSource(dataSources.videoCenterClient, 'updateHubLocales', []);
      mockDataSource(dataSources.videoCenterClient, 'hubUpdate', videoCenterResponse);
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterResponse);
      hubUpdateInput.input.theme.newLogoImageUrl = 'https://image-lower.cvent.com/eventsplus/banner/image.jpg';
      hubUpdateInput.input.theme.newLogoOriginalImageUrl = 'https://image-lower.cvent.com/eventsplus/banner/image.jpg';
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.hubUpdate', dataSources, {
        ...hubUpdateInput
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      dataSources.s3ProxyServiceClient.context = resolverRequest.context;
      dataSources.imageLookupClient.context = resolverRequest.context;
      const updateHub = await resolveMutationResponse(hubResolver, 'hubUpdate', resolverRequest);
      expect(updateHub).toEqual(videoCenterResponse.id);
    });
  });

  describe('hubCreate', () => {
    it('creates a hub, returning the id', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', videoCenterResponse);
      mockDataSource(dataSources.videoCenterClient, 'put', videoCenterResponse);
      const response = await graphCall<Hub>('hubCreate');

      expect(response).toBeTruthy();
      expect(response).toEqual(videoCenterResponse.id);
    });

    it('bubbles up errors', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', 'Goldilocks', 'abc');
      await expect(async () => {
        await graphCall('hubCreate');
      }).rejects.toThrow('Goldilocks');
    });
  });

  describe('hubPublish', () => {
    it('publishes a hub, returning the id', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', videoCenterResponse);
      const response = await graphCall<Hub>('hubPublish');

      expect(response).toBeTruthy();
      expect(response).toEqual(videoCenterResponse.id);
    });

    it('bubbles up errors', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', 'Goldilocks', 'abc');
      await expect(async () => {
        await graphCall('hubPublish');
      }).rejects.toThrow('Goldilocks');
    });
  });

  describe('hubDraft', () => {
    it('drafts a hub, returning the id', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', videoCenterResponse);
      const response = await graphCall<Hub>('hubDraft');

      expect(response).toBeTruthy();
      expect(response).toEqual(videoCenterResponse.id);
    });

    it('bubbles up errors', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', 'Goldilocks', 'abc');
      await expect(async () => {
        await graphCall('hubDraft');
      }).rejects.toThrow('Goldilocks');
    });
  });

  describe('hubPagesWithBanner', () => {
    it('Should fetch hub pages associated with a banner', async () => {
      const hubPagesWithBannerServiceResponse = { data: [], paging: [] };
      mockDataSource(dataSources.videoCenterClient, 'get', hubPagesWithBannerServiceResponse);
      const resolverRequest = getMockResolverRequestWithDataSources(
        'Query.hubPagesWithBanner',
        dataSources,
        hubPagesWithBannerInput
      );
      const response = await resolveQueryResponse(hubResolver, 'hubPagesWithBanner', resolverRequest);

      expect(response).toBeTruthy();
      expect((await (response as Promise<HubPages>)).data.length).toEqual(
        hubPagesWithBannerServiceResponse.data.length
      );
    });
  });

  describe('deleteToken', () => {
    it('deletes a shared token, returning the input.id', async () => {
      mockDataSource(dataSources.videoHubUiClient, 'delete', {});
      const response = await graphCall<Hub>('deleteToken');

      expect(response).toBeTruthy();
      expect(response).toEqual(hubInput.id.id);
    });

    it('bubbles up errors', async () => {
      mockDataSourceError(dataSources.videoHubUiClient, 'delete', 'Network error', 'abc');
      await expect(async () => {
        await graphCall('deleteToken');
      }).rejects.toThrow('Network error');
    });
  });

  describe('hubDelete', () => {
    it('deletes a hub, returning the input.id', async () => {
      mockDataSource(dataSources.videoCenterClient, 'delete', {});
      const response = await graphCall<Hub>('hubDelete');

      expect(response).toBeTruthy();
      expect(response).toEqual(hubInput.id.id);
    });

    it('bubbles up errors', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'delete', 'Goldilocks', 'abc');
      await expect(async () => {
        await graphCall('hubDelete');
      }).rejects.toThrow('Goldilocks');
    });
  });

  it('Should get planner terms edit permissions', async () => {
    mockDataSource(dataSources.videoCenterClient, 'get', {});
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Query.getHubTermsEditPermission',
      dataSources,
      hubInput
    );
    const response = await resolveQueryResponse(hubResolver, 'getHubTermsEditPermission', resolverRequest);
    expect(response).toBeTruthy();
    expect(response).toMatch('ALLOWED');
  });

  it('Should get unauthorized getting planner terms edit permissions', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'get', 'Unauthorised', '401');
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Query.getHubTermsEditPermission',
      dataSources,
      hubInput
    );
    await expect(async () => {
      await resolveQueryResponse(hubResolver, 'getHubTermsEditPermission', resolverRequest);
    }).rejects.toThrow('Unauthorised');
  });

  it('Should fetch hub banners', async () => {
    const hubBannersServiceResponse = { data: [], paging: {} };
    mockDataSource(dataSources.videoCenterClient, 'get', hubBannersServiceResponse);
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Query.hubBanners',
      dataSources,
      bannerSearchQueryArgs
    );

    const response = await resolveQueryResponse(hubResolver, 'hubBanners', resolverRequest);

    expect(response).toBeTruthy();
    expect((await (response as Promise<BannerPagingResponse>)).data.length).toEqual(
      hubBannersServiceResponse.data.length
    );
  });

  it('Should set banner associations', async () => {
    const bannerAssociationResponse = { data: [], paging: {} };
    mockDataSource(dataSources.videoCenterClient, 'put', bannerAssociationResponse);
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Mutation.setBannerAssociations',
      dataSources,
      bannerAssociationInput
    );

    const response = await resolveMutationResponse(hubResolver, 'setBannerAssociations', resolverRequest);

    expect(response).toBeTruthy();
    expect((await (response as Promise<BannerPagingResponse>)).data.length).toEqual(
      bannerAssociationResponse.data.length
    );
  });

  it('Should return Unauthorized response status for an unauthorized request', async () => {
    mockDataSourceError(dataSources.videoCenterClient, 'get', 'Unauthorized', '401');
    const resolverRequest = getMockResolverRequestWithDataSources(
      'Query.hubBanners',
      dataSources,
      bannerSearchQueryArgs
    );
    await expect(async () => {
      await resolveQueryResponse(hubResolver, 'hubBanners', resolverRequest);
    }).rejects.toThrow('Unauthorized');
  });

  describe('getCenterFeatures', () => {
    it('Should successfully return the list of features for a particular HubID', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', getFeaturesListResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getCenterFeatures', dataSources, {
        id: { id: centerId }
      });

      const response = await resolveQueryResponse(hubResolver, 'getCenterFeatures', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toBe(getFeaturesListResponse);
    });

    it('Should return Not authorized for expired access token', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Unauthorized', '401');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getCenterFeatures', dataSources, {
        id: { id: centerId }
      });
      await expect(async () => {
        await resolveQueryResponse(hubResolver, 'getCenterFeatures', resolverRequest);
      }).rejects.toThrow('Unauthorized');
    });

    it('Should return not found for an invalid hub id', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Not Found', '404');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getCenterFeatures', dataSources, {
        id: { id: centerId }
      });
      await expect(async () => {
        await resolveQueryResponse(hubResolver, 'getCenterFeatures', resolverRequest);
      }).rejects.toThrow('Not Found');
    });
  });

  describe('getHubLocales', () => {
    it('Should combine the hub locale with available locals and set default', async () => {
      const locales = {
        locales: [
          { locale: 'a', customized: true, translationStatus: 'In Progress' },
          { locale: 'b', customized: false, translationStatus: 'Not-Started' },
          { locale: 'zh-CN', customized: false, translationStatus: 'Not-Started' }
        ]
      };
      mockDataSourceOnce(dataSources.videoCenterClient, 'get', videoCenterResponse);
      mockDataSourceAgain(dataSources.videoCenterClient, 'get', locales);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubLocales', dataSources, hubInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getHubLocales', resolverRequest);
      const expected = {
        data: [
          { default: false, locale: 'a', customized: true, translationStatus: 'In Progress' },
          { default: false, locale: 'b', customized: false, translationStatus: 'Not-Started' },
          { default: false, locale: 'zh-CN', customized: false, translationStatus: 'Not-Started' },
          { default: true, locale: 'en-GB', customized: false, translationStatus: 'Not-Started' }
        ]
      };
      expect(response).toMatchObject(expected);
    });
  });

  describe('addHubLocales', () => {
    it('Should add locales to the existing list and update the hub', async () => {
      const locales = ['a', 'b'];
      mockDataSourceOnce(dataSources.videoCenterClient, 'get', videoCenterResponse);
      mockDataSourceAgain(dataSources.videoCenterClient, 'get', { locales });
      mockDataSource(dataSources.videoCenterClient, 'put', {});
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.addHubLocales', dataSources, {
        input: {
          data: ['a', 'b']
        },
        id: {
          id: '7bf8d4c8-f7da-4cc1-94b8-d7d02a4c3d12'
        }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'addHubLocales', resolverRequest);
      const expected = {
        data: [
          { default: false, locale: 'a' },
          { default: false, locale: 'b' },
          { default: true, locale: 'en-GB' }
        ]
      };
      expect(response).toMatchObject(expected);
    });
  });

  describe('updateBrandingImages', () => {
    let brandingImagesInput: { input: BrandingImagesInput };

    beforeEach(() => {
      brandingImagesInput = {
        input: {
          hubId: 'hub-update-id',
          faviconUrl: 'https://example.com',
          logoAltText: 'Test ALT Text'
        }
      };
    });

    it('Updates branding images (Logo and Favicon URL) when Logo fields are not present', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterResponse);
      mockDataSource(dataSources.videoCenterClient, 'put', videoCenterResponse);
      const resolverRequest = getMockResolverRequestWithDataSources(
        'Mutation.updateBrandingImages',
        dataSources,
        brandingImagesInput
      );
      const response = await resolveMutationResponse(hubResolver, 'updateBrandingImages', resolverRequest);

      expect(response).toBeTruthy();
      expect(response.id).toEqual(videoCenterResponse.id);
    });

    it('Updates branding images (Logo and Favicon URL) when Logo fields are present', async () => {
      const movedFileUrl = 'https://image-lower.cvent.com/final/resting/place/image.jpg';
      const optimizedImageUrl =
        'https://image-lower.cvent.com/final/resting/place/imageJWIKOEJFOWIEJ!_!JIOWJEF23842.jpg';
      mockDataSource(dataSources.s3ProxyServiceClient, 'moveFile', movedFileUrl);
      mockDataSource(dataSources.imageLookupClient, 'lookup', {
        data: {
          [movedFileUrl]: {
            height: 100,
            width: 100,
            hashedURL: optimizedImageUrl
          }
        }
      });
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterResponse);

      brandingImagesInput.input.newLogoUrl = 'https://image-lower.cvent.com/eventsplus/banner/image.jpg';
      brandingImagesInput.input.newLogoOriginalUrl = 'https://image-lower.cvent.com/eventsplus/banner/image.jpg';

      mockDataSource(dataSources.videoCenterClient, 'put', videoCenterResponse);

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.updateBrandingImages', dataSources, {
        ...brandingImagesInput
      });

      dataSources.videoCenterClient.context = resolverRequest.context;
      dataSources.s3ProxyServiceClient.context = resolverRequest.context;
      dataSources.imageLookupClient.context = resolverRequest.context;

      const response = await resolveMutationResponse(hubResolver, 'updateBrandingImages', resolverRequest);

      expect(response).toBeTruthy();
      expect(response.id).toEqual(videoCenterResponse.id);
    });
  });

  describe('updateBackgroundImages', () => {
    let backgroundImagesInput: { input: BackgroundImagesInput };

    beforeEach(() => {
      backgroundImagesInput = {
        input: {
          hubId: 'hub-update-id'
        }
      };
    });

    it('Updates background images when background image fields are not present', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterResponse);
      mockDataSource(dataSources.videoCenterClient, 'put', videoCenterResponse);
      const resolverRequest = getMockResolverRequestWithDataSources(
        'Mutation.updateBrandingImages',
        dataSources,
        backgroundImagesInput
      );
      const response = await resolveMutationResponse(hubResolver, 'updateBackgroundImages', resolverRequest);

      expect(response).toBeTruthy();
      expect(response.id).toEqual(videoCenterResponse.id);
    });

    it('Updates background images when background image fields are present', async () => {
      const movedFileUrl = 'https://image-lower.cvent.com/final/resting/place/image.jpg';
      const optimizedImageUrl =
        'https://image-lower.cvent.com/final/resting/place/imageJWIKOEJFOWIEJ!_!JIOWJEF23842.jpg';
      mockDataSource(dataSources.s3ProxyServiceClient, 'moveFile', movedFileUrl);
      mockDataSource(dataSources.imageLookupClient, 'lookup', {
        data: {
          [movedFileUrl]: {
            height: 100,
            width: 100,
            hashedURL: optimizedImageUrl
          }
        }
      });
      mockDataSource(dataSources.videoCenterClient, 'get', videoCenterResponse);

      backgroundImagesInput.input.newBackgroundImageUrl = 'https://image-lower.cvent.com/eventsplus/banner/image.jpg';
      backgroundImagesInput.input.newBackgroundOriginalImageUrl =
        'https://image-lower.cvent.com/eventsplus/banner/image.jpg';
      backgroundImagesInput.input.backgroundImageAltText = 'alt text';

      mockDataSource(dataSources.videoCenterClient, 'put', videoCenterResponse);

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.updateBackgroundImages', dataSources, {
        ...backgroundImagesInput
      });

      dataSources.videoCenterClient.context = resolverRequest.context;
      dataSources.s3ProxyServiceClient.context = resolverRequest.context;
      dataSources.imageLookupClient.context = resolverRequest.context;

      const response = await resolveMutationResponse(hubResolver, 'updateBackgroundImages', resolverRequest);

      expect(response).toBeTruthy();
      expect(response.id).toEqual(videoCenterResponse.id);
    });
  });

  const input = {
    hubId: 'baa1deee-289a-452b-9c95-190ba185775f',
    startDate: '2023-08-15T00:00:00Z',
    endDate: '2023-08-15T00:00:00Z'
  };
  describe('getRegistrationCount', () => {
    it('Should get registration count data', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', totalRegistrationData);

      const resolverRequest = getMockResolverRequestWithDataSources('getRegistrationCount', dataSources, {
        input
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getRegistrationCount', resolverRequest);
      expect(response).toBeTruthy();
    });
  });
  describe('getUtmOverrides', () => {
    it('Should successfully return the list of UTM overrides', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', []);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getUtmOverrides', dataSources, {
        input: { id: centerId }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getUtmOverrides', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual([]);
    });
  });

  describe('setUtmOverrides', () => {
    it('Should successfully set the list of UTM overrides', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', []);

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.setUtmOverrides', dataSources, {
        input: { id: centerId },
        data: []
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'setUtmOverrides', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual([]);
    });
  });

  describe('getTranslations', () => {
    it('Should successfully return the list of translations', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', []);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getTranslations', dataSources, {
        input: { hubId: centerId, locale: 'en-US' }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getTranslations', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual([]);
    });
  });

  describe('setTranslations', () => {
    it('Should successfully set the list of translations', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', []);

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.setTranslations', dataSources, {
        input: { hubID: centerId },
        locale: 'en-US',
        data: []
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'setTranslations', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual([]);
    });
  });

  describe('resetTranslations', () => {
    it('Should successfully reset translations for a hub', async () => {
      mockDataSource(dataSources.videoCenterClient, 'delete', 'mock-delete-response');

      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.resetTranslations', dataSources, {
        input: { hubID: centerId, locale: 'en-US', type: undefined }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'resetTranslations', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toEqual('mock-delete-response');
    });
  });

  describe('Test Hub Customization Resolver', () => {
    const customizations = {
      headerHtml: '<h1>Hello World</h1>',
      headerCss: 'This is test CSS',
      headerJavascript: 'This is test Javascript',
      showCustomHeader: true,
      showLogo: true,
      showLogin: true,
      showHomePage: true,
      showUpcomingEvents: true,
      showChannels: true,
      showVideos: true,
      showNavigation: true,
      navigationAlignment: NavigationAlignment.Left,
      navigationLinkTextSize: 16,
      navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Filled
    };
    it('Should get customizations for the hubId', async () => {
      mockDataSource(dataSources.videoCenterClient, 'getHubCustomizations', customizations);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubCustomizations', dataSources, {
        id: 'hubId'
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getHubCustomizations', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toMatchObject(customizations);
    });

    it('Should get default customization for the hubId not having any customizations', async () => {
      mockDataSource(dataSources.videoCenterClient, 'getHubCustomizations', null);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubCustomizations', dataSources, {
        id: 'dummyHubId'
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getHubCustomizations', resolverRequest);
      expect(response).toBeTruthy();
      expect(response.showUpcomingEvents).toBeTruthy();
      expect(response.showLogin).toBeTruthy();
      expect(response.showLogo).toBeTruthy();
      expect(response.showChannels).toBeTruthy();
      expect(response.showNavigation).toBeTruthy();
      expect(response.navigationAlignment).toBe(NavigationAlignment.Center);
      expect(response.navigationLinkTextSize).toBe(12);
      expect(response.navigationLinkHighlightStyle).toBe(NavigationLinkHighlightStyle.Filled);
    });

    it('Should throw error on receiving one', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'getHubCustomizations', 'Some error', '500');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubCustomizations', dataSources, {
        id: 'hubId'
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveQueryResponse(hubResolver, 'getHubCustomizations', resolverRequest);
      }).rejects.toThrow('Some error');
    });

    it('Should upsert customizations for the hubId', async () => {
      const customizationInput = {
        headerHtml: '<h1>Hello World</h1>',
        headerCss: 'This is test CSS',
        headerJavascript: 'This is test Javascript',
        showCustomHeader: true
      };
      mockDataSource(dataSources.videoCenterClient, 'getHubCustomizations', null);
      mockDataSource(dataSources.videoCenterClient, 'upsertHubCustomizations', customizations);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.upsertHubCustomizations', dataSources, {
        id: 'hubId',
        input: customizationInput
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveMutationResponse(hubResolver, 'upsertHubCustomizations', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toMatchObject(customizations);
    });
    it('Upsert customizations should throw error on receiving', async () => {
      const customizationInput = {
        headerHtml: '<h1>Hello World</h1>',
        headerCss: 'This is test CSS',
        headerJavascript: 'This is test Javascript',
        showCustomHeader: true
      };
      mockDataSource(dataSources.videoCenterClient, 'getHubCustomizations', customizations);
      mockDataSourceError(dataSources.videoCenterClient, 'upsertHubCustomizations', 'Unauthorized', '401');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.upsertHubCustomizations', dataSources, {
        id: 'hubId',
        input: customizationInput
      });
      await expect(resolveMutationResponse(hubResolver, 'upsertHubCustomizations', resolverRequest)).rejects.toThrow(
        'Unauthorized'
      );
    });
  });

  describe('getRegistrationFormSettings', () => {
    it('Should fetch registration form settings for a hub', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', {
        data: [
          {
            included: false,
            code: RegistrationFieldCode.JobTitle,
            order: 2,
            required: true
          }
        ]
      });
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getRegistrationFormSettings', dataSources, {
        input: {
          hubId: centerId
        }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(hubResolver, 'getRegistrationFormSettings', resolverRequest);

      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        data: [
          {
            included: false,
            code: RegistrationFieldCode.JobTitle,
            order: 2,
            required: true
          }
        ]
      });
    });

    it('Should not get registration form settings: Unauthorized request', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Unauthorised', '401');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getRegistrationFormSettings', dataSources, {
        input: {
          hubId: centerId
        }
      });
      dataSources.videoCenterClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveQueryResponse(hubResolver, 'getRegistrationFormSettings', resolverRequest);
      }).rejects.toThrow('Unauthorised');
    });
  });
});
