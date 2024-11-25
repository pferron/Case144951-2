// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { S3ProxyClient } from '@utils/s3ProxyClient';
import { faker } from '@faker-js/faker';
import {
  BannerAssociationCreate,
  BannerAssociationPaging,
  BrandingImagesInput,
  CustomizationsInput,
  GuestVisibility,
  NavigationLinkHighlightStyle,
  TranslationSearch
} from '@cvent/planner-event-hubs-model/types';
import { v4 as uuidV4 } from 'uuid';
import { ACCOUNT_STUB } from '@utils/constants';
import { skipDescribeIfProdEnvironment, skipItIfProdEnvironment } from '@utils/commonUtils';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { getHubCustomizationsQuery } from '@cvent/planner-event-hubs-model/src/operations/hub';
import { RegistrationFieldCode } from '@cvent/planner-event-hubs-model/src/types';
import {
  connectToApiAsPlanner,
  authOptions,
  unauthOptions,
  authATestAccountOptions
} from './helpers/connectToApiAsPlanner';
import { hubs, newHub, updateCenterFeature, updateSettings } from './queries/hub';
import { invalidHubData, invalidHubMalformedColorCode, invalidHubMissingParams, newHubData } from './fixtures/hubData';
import {
  createHub,
  rawUpdateHub,
  rawCreateHub,
  getHub,
  getHubs,
  rawDeleteHub,
  rawUpdateHubSettings,
  getHubSettings,
  getHubBanners,
  getBannerAssociations,
  getHubTermsEditAllowed,
  hubPublish,
  getCenterFeatures,
  centerFeatureUpdate,
  setBannerAssociations,
  getHubPages,
  getHubPagesWithBanner,
  getHubLocales,
  AddToHubLocales,
  rawUpdateBrandingImages,
  getHubUtmOverrides,
  setHubUtmOverrides,
  getHubCustomizations,
  upsertHubCustomizations,
  getHubTranslations,
  getRegistrationFormSettings,
  setHubTranslations,
  resetHubTranslations,
  updateRegistrationFormSettings,
  rawDeleteToken
} from './helpers/hubFunctions';
import { rawCreateBanner } from './helpers/bannerFunctions';
import { createChannel, deleteChannel } from './helpers/channelFunctions';
import { newBannerData } from './fixtures/bannerData';
import { cropImage } from './helpers/uploadFunctions';

let client: ApolloClient<NormalizedCacheObject>;
let clientWithIncorrectRole: ApolloClient<NormalizedCacheObject>;
let clientFromOtherAccount: ApolloClient<NormalizedCacheObject>;
let testHubId: string;
let testHub;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientWithIncorrectRole = await connectToApiAsPlanner(unauthOptions);
  clientFromOtherAccount = await connectToApiAsPlanner(authATestAccountOptions);
}, 10000);

beforeEach(async () => {
  testHub = newHubData;
  testHubId = await createHub(client, testHub);
  await hubPublish(client, { id: testHubId });
}, 10000);

afterEach(async () => {
  const hub = await getHub(client, testHubId);
  if (hub.id) {
    await rawDeleteHub(client, { id: testHubId });
  }
});

const cleanChannels = async (channelList: string[]): Promise<void> => {
  for (const channel of channelList) {
    deleteChannel(client, channel);
  }
};

const getFeaturesListResponse = [
  {
    code: 'YOUR_EVENTS',
    enabled: false
  },
  {
    code: 'MESSAGING',
    enabled: false
  },
  {
    code: 'CONNECTIONS',
    enabled: false
  },
  {
    code: 'UPCOMING_EVENTS',
    enabled: false
  },
  {
    code: 'PROFILE_SETUP',
    enabled: true
  }
];
jest.setTimeout(30000);

describe('query: getHubs', () => {
  it('getHubs', async () => {
    const returnedHubs = await getHubs(client);
    expect(returnedHubs).toBeTruthy();
    expect(returnedHubs.paging.currentToken).toBeTruthy();
    expect(returnedHubs.data.length).toBeGreaterThan(0);
  });
});

describe('query: getHubPagesWithBanner', () => {
  it('gives all channels/homepage from a hub associated with a banner', async () => {
    const channelList: string[] = [];
    newBannerData.centerId = testHubId;
    const banner = await rawCreateBanner(client, newBannerData);
    const bannerAssociation = {
      banner: banner.data?.bannerCreate,
      displayOrder: 1
    };
    const bannerAssociationCreate = {
      centerId: testHubId,
      entityId: testHubId,
      entityType: 'Homepage',
      bannerAssociation: [bannerAssociation]
    };
    await setBannerAssociations(client, bannerAssociationCreate);
    const numberOfPages = 5; // Homepage + 4 Channels
    const channelOne = await createChannel(
      client,
      testHubId,
      'filter channel 1',
      'Test Channel',
      'web-staging.cvent.com'
    );
    const channelTwo = await createChannel(
      client,
      testHubId,
      'filter channel 2',
      'Test Channel',
      'web-staging.cvent.com'
    );
    const channelThree = await createChannel(
      client,
      testHubId,
      'filter channel 3',
      'Test Channel',
      'web-staging.cvent.com'
    );
    const channelFour = await createChannel(
      client,
      testHubId,
      'filter channel 4',
      'Test Channel',
      'web-staging.cvent.com'
    );
    channelList.push(channelOne.id);
    channelList.push(channelTwo.id);
    channelList.push(channelThree.id);
    channelList.push(channelFour.id);
    const hubPages = await getHubPages(client, testHubId);
    const channels = hubPages.data.filter(hubPage => {
      return hubPage?.entityType === 'Channel';
    });

    bannerAssociationCreate.entityType = 'Channel';
    const setAssociationPromises: Array<Promise<BannerAssociationPaging>> = [];
    for (const channel of channels) {
      if (channel?.entityId) {
        bannerAssociationCreate.entityId = channel.entityId;
        setAssociationPromises.push(setBannerAssociations(client, bannerAssociationCreate));
      } else {
        throw Error(`Got unexpected channel data when assigning banner for test setup. Channel ${channel}`);
      }
    }
    await Promise.allSettled(setAssociationPromises);
    const bannerHubSearch = {
      hubId: testHubId,
      bannerId: bannerAssociation.banner
    };
    const response = await getHubPagesWithBanner(client, bannerHubSearch);
    const pageNames = response.data.map(hubPage => {
      return hubPage?.name;
    });
    const pageTypes = response.data.map(hubPage => {
      return hubPage?.entityType;
    });
    const pageIds = response.data.map(hubPage => {
      return hubPage?.entityId;
    });
    expect(response).toBeTruthy();
    expect(response.data.length).toEqual(numberOfPages);
    expect(pageNames).toContain('filter channel 1');
    expect(pageNames).toContain('filter channel 2');
    expect(pageNames).toContain('filter channel 3');
    expect(pageNames).toContain('filter channel 4');
    expect(pageNames).toContain('Homepage');
    expect(response.data[0]).toHaveProperty('entityId');
    expect(
      pageTypes.filter(pageType => {
        return pageType === 'Channel';
      }).length
    ).toEqual(4);
    expect(
      pageTypes.filter(pageType => {
        return pageType === 'Homepage';
      }).length
    ).toEqual(1);
    expect(pageIds).toContain(testHubId);
    expect(pageIds).toContain(channelOne.id);
    expect(pageIds).toContain(channelTwo.id);
    expect(pageIds).toContain(channelThree.id);
    expect(pageIds).toContain(channelFour.id);
    await cleanChannels(channelList);
  });
});

describe('query: getBannerAssociations', () => {
  it('returns banners associated with a certain entity ID', async () => {
    newBannerData.centerId = testHubId;
    const banner = await rawCreateBanner(client, newBannerData);
    const bannerAssociation = {
      banner: banner.data.bannerCreate,
      displayOrder: 1
    };
    const bannerAssociationCreate: BannerAssociationCreate = {
      centerId: testHubId,
      entityId: testHubId,
      entityType: 'Homepage',
      bannerAssociation: [bannerAssociation]
    };
    const mapping = await setBannerAssociations(client, bannerAssociationCreate);
    expect(mapping.data[0].banner.id).toEqual(banner.data.bannerCreate);
    expect(mapping.data[0].centerId).toEqual(testHubId);
    expect(mapping.data[0].entityId).toEqual(testHubId);
    const bannerAssociationSearch = {
      centerId: testHubId,
      limit: 1,
      entityType: 'Homepage'
    };
    const response = await getBannerAssociations(client, bannerAssociationSearch);
    expect(response.__typename).toEqual('BannerAssociationPaging');
    expect(response.data[0].__typename).toEqual('ExistingBannerAssociationWithBanner');
    expect(response.data[0].banner.id).toEqual(banner.data.bannerCreate);
    expect(response.data[0].centerId).toEqual(testHubId);
    expect(response.data[0].entityId).toEqual(testHubId);
    expect(response.data[0].entityType).toEqual('Homepage');
    expect(response.data[0].banner.imageAlignment).toEqual('Right');
    expect(response.data[0].banner.button.targetType).toEqual('External');
    expect(response.data[0].banner.button.internalTarget).toEqual('Homepage');
    expect(response.paging.currentToken).toBeTruthy();
  });

  skipItIfProdEnvironment()('throws Not Found when center id is not found', async () => {
    newBannerData.centerId = testHubId;
    const banner = await rawCreateBanner(client, newBannerData);
    const bannerAssociation = {
      banner: banner.data.bannerCreate,
      displayOrder: 1
    };
    const bannerAssociationCreate: BannerAssociationCreate = {
      centerId: testHubId,
      entityId: testHubId,
      entityType: 'Homepage',
      bannerAssociation: [bannerAssociation]
    };
    await setBannerAssociations(client, bannerAssociationCreate);
    const bannerAssociationSearch = {
      centerId: uuidV4(),
      limit: 1,
      entityType: 'Homepage'
    };
    await expect(async () => getBannerAssociations(client, bannerAssociationSearch)).rejects.toThrow('Not Found');
  });
});

describe('mutation: hubCreate', () => {
  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: newHub,
        variables: { input: {} }
      })
    ).rejects.toThrow('Not authorized');
  });

  it('creates a new hub returning the hubId at data.hubCreate', async () => {
    const response = await rawCreateHub(client, newHubData);
    expect(response.data).toBeTruthy();
    expect(response.data.hubCreate).toBeTruthy();
  });

  it('creates a new hub with a shortened url', async () => {
    const response = await rawCreateHub(client, newHubData);
    expect(response.data).toBeTruthy();
    expect(response.data.hubCreate).toBeTruthy();
    const data = await getHub(client, response.data.hubCreate);
    expect(data.config.url).toContain('cvent.me');
  });

  skipItIfProdEnvironment()('throws 422 to payloads missing required params', async () => {
    await expect(async () => rawCreateHub(client, invalidHubMissingParams)).rejects.toThrow('Unprocessable Entity');
  });

  skipItIfProdEnvironment()('throws 422 to payloads with malformed color hexcodes', async () => {
    await expect(async () => rawCreateHub(client, invalidHubMalformedColorCode)).rejects.toThrow(
      'Unprocessable Entity'
    );
  });

  skipItIfProdEnvironment()(
    'throws 400 to payloads with correctly formed color hexcodes and all required params but with invalid data',
    async () => {
      await expect(async () => rawCreateHub(client, invalidHubData)).rejects.toThrow('Bad Request');
    }
  );
});

describe('mutation: hubUpdate', () => {
  let updateHubId = null;

  beforeEach(async () => {
    updateHubId = await createHub(client, newHubData);
  });

  afterEach(async () => {
    const hub = await getHub(client, updateHubId);
    if (hub.id) {
      await rawDeleteHub(client, { id: updateHubId });
    }
  });

  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () =>
      rawUpdateHub(clientWithIncorrectRole, {
        id: 'nonsense-id'
      })
    ).rejects.toThrow('Not authorized');
  });

  it('updates config and theme fields for the given hub returning the hubId at data.hubUpdate', async () => {
    const newValues = {
      id: updateHubId,
      config: {
        title: '[planner-event-hubs-model-it] hubUpdate Automated Test',
        ownerEmail: newHubData.config.ownerEmail,
        ownerFirstName: newHubData.config.ownerFirstName,
        ownerLastName: newHubData.config.ownerLastName,
        locale: newHubData.config.locale,
        url: faker.internet.url(),
        helpEmailAddress: faker.internet.email()
      },
      theme: {
        backgroundColor: faker.internet.color(),
        logoImageUrl: faker.internet.url(),
        logoAltText: newHubData.theme.logoAltText,
        moodColor: faker.internet.color(),
        safeMode: true,
        headingsFont: uuidV4(),
        bodyFont: uuidV4()
      },
      calendar: {
        id: uuidV4()
      }
    };
    const response = await rawUpdateHub(client, newValues);
    expect(response.data).toBeTruthy();
    expect(response.data.hubUpdate).toEqual(updateHubId);
    const refreshedHub = await getHub(client, updateHubId);
    expect(refreshedHub.config?.helpEmailAddress).toEqual(newValues.config.helpEmailAddress);
    expect(refreshedHub.theme?.headingsFont).toBe(newValues.theme.headingsFont);
    expect(refreshedHub.theme?.bodyFont).toBe(newValues.theme.bodyFont);
  });

  it('updating a Theme with a newLogoImageUrl, processes it into an optimised logoImageUrl', async () => {
    const s3ProxyClient = new S3ProxyClient();
    const config = {
      context: {
        headers: { ignore: 'me' },
        environment: process.env.ENVIRONMENT_NAME
      },
      cache: undefined
    };
    s3ProxyClient.initialize(config);
    const resp = await s3ProxyClient.uploadTestImage(`${ACCOUNT_STUB}/test/eventsplus/${updateHubId}/logos`);
    const croppedUrl = await cropImage(resp.location, updateHubId, authOptions.authorization.metadata.accountStub);
    const croppedResp = await croppedUrl.json();
    const newLogoImageUrl = croppedResp.location;
    const newValues = {
      id: updateHubId,
      config: {
        title: '[planner-event-hubs-model-it] hubUpdate Automated Test',
        ownerEmail: newHubData.config.ownerEmail,
        ownerFirstName: newHubData.config.ownerFirstName,
        ownerLastName: newHubData.config.ownerLastName,
        locale: newHubData.config.locale,
        url: faker.internet.url()
      },
      theme: {
        backgroundColor: faker.internet.color(),
        logoImageUrl: newHubData.theme.logoImageUrl,
        newLogoImageUrl,
        newLogoOriginalImageUrl: resp.location,
        logoAltText: newHubData.theme.logoAltText
      }
    };
    const response = await rawUpdateHub(client, newValues);
    expect(response.data).toBeTruthy();
    const refreshedHub = await getHub(client, updateHubId);
    expect(refreshedHub.theme?.logoImageUrl).toMatch(/https:\/\/images.*cvent.com\/.+\/[\w\d]+!_![\w\d]+\.[\w]{3,4}/i);
    expect(refreshedHub.theme?.logoOriginalImageUrl).toMatch(/https:\/\/custom.*cvent.com\/.+\/[\w\d]+.[\w]{3,4}/i);
  });

  skipItIfProdEnvironment()('throws 422 to payloads missing required params', async () => {
    const params = {
      id: updateHubId,
      ...invalidHubMissingParams
    };
    await expect(async () => rawUpdateHub(client, params)).rejects.toThrow('Unprocessable Entity');
  });

  skipItIfProdEnvironment()('throws 422 to payloads with malformed color hexcodes', async () => {
    const params = {
      id: updateHubId,
      ...invalidHubMalformedColorCode
    };
    await expect(async () => rawUpdateHub(client, params)).rejects.toThrow('Unprocessable Entity');
  });

  skipItIfProdEnvironment()(
    'throws 400 to payloads with correctly formed color hexcodes and all required params but with invalid data',
    async () => {
      const params = {
        id: updateHubId,
        ...invalidHubData
      };
      await expect(async () => rawUpdateHub(client, params)).rejects.toThrow('Bad Request');
    }
  );

  skipItIfProdEnvironment()('throws 404 when given hub cannot be found', async () => {
    const params = {
      id: 'nonsense-id',
      ...invalidHubMalformedColorCode
    };
    await expect(async () => rawUpdateHub(client, params)).rejects.toThrow('Not Found');
  });
});

describe('mutation: hubDelete', () => {
  let deleteHubId = null;

  beforeAll(async () => {
    deleteHubId = await createHub(client, newHubData);
  });

  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () => rawDeleteHub(clientWithIncorrectRole, { id: deleteHubId })).rejects.toThrow(
      'Not authorized'
    );
  });

  skipItIfProdEnvironment()('throws 404 when given HubId belongs to different account', async () => {
    await expect(async () => rawDeleteHub(clientFromOtherAccount, { id: deleteHubId })).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('throws 404 when no hub match id', async () => {
    await expect(async () => rawDeleteHub(client, { id: 'nonsense-id' })).rejects.toThrow('Not Found');
  });

  it('soft-deletes an existing hub returning the provided hub id', async () => {
    const deleteResponse = await rawDeleteHub(client, { id: deleteHubId });
    const hub = await getHub(client, deleteHubId);
    expect(deleteResponse.data.hubDelete).toEqual(deleteHubId);
    expect(hub.status).toEqual('Deleted');
  });
});

describe('mutation: deleteToken', () => {
  let hubId = '';

  beforeAll(async () => {
    hubId = await createHub(client, newHubData);
  });

  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () => rawDeleteToken(clientWithIncorrectRole, { id: hubId })).rejects.toThrow('Not authorized');
  });

  it('deletes shared token for the hub', async () => {
    const deleteResponse = await rawDeleteToken(client, { id: hubId });
    expect(deleteResponse.data.deleteToken).toEqual(hubId);
  });
});

describe('query: hub', () => {
  let data = null;

  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () => getHub(clientWithIncorrectRole, 'nonsense-id')).rejects.toThrow('Not authorized');
  });

  describe('when requested record is found', () => {
    beforeAll(async () => {
      data = await getHub(client, testHubId);
    });

    it('responds with data.hub property', () => {
      expect(data).toBeTruthy();
    });

    it('responds with config settings', () => {
      expect(data.config).toEqual({
        __typename: 'Config',
        url: data.config.url,
        ...newHubData.config
      });
    });

    it('responds with theme settings', () => {
      expect(data.theme).toEqual({
        __typename: 'Theme',
        actionColor: null,
        mainColor: null,
        logoImageRelativePath: null,
        logoImageUrl: newHubData.theme.logoImageUrl,
        logoOriginalImageUrl: newHubData.theme.logoOriginalImageUrl,
        logoAltText: newHubData.theme.logoAltText,
        backgroundColor: newHubData.theme.backgroundColor,
        faviconUrl: newHubData.theme.faviconUrl,
        headingsFont: null,
        bodyFont: null
      });
    });
  });

  skipDescribeIfProdEnvironment()('when requested record is not found', () => {
    it('throws Not Found', async () => {
      await expect(async () => getHub(client, 'nonsense-id')).rejects.toThrow('Not Found');
    });
  });

  skipDescribeIfProdEnvironment()('when requested record is cached and belongs to a different account', () => {
    beforeEach(async () => {
      data = await getHub(client, testHubId);
    });

    it('throws Not Found as it is from different account', async () => {
      await expect(async () => getHub(clientFromOtherAccount, testHubId)).rejects.toThrow('Not Found');
    });
  });
});

describe('query: getHubPages', () => {
  it('gives the homepage for a hub', async () => {
    const response = await getHubPages(client, testHubId);
    expect(response).toBeTruthy();
    expect(response.data.length).toEqual(1);
    expect(response.data[0]?.name).toEqual('Homepage');
  });
  it('gives all channels and the homepage for a hub sorted alphabetically', async () => {
    const channelList: string[] = [];
    const numberOfPages = 6; // Homepage + 5 Channels
    const channelOne = await createChannel(
      client,
      testHubId,
      'filter channel 1',
      'Test Channel',
      'web-staging.cvent.com'
    );
    const channelTwo = await createChannel(
      client,
      testHubId,
      'filter channel 2',
      'Test Channel',
      'web-staging.cvent.com'
    );
    const channelThree = await createChannel(
      client,
      testHubId,
      'filter channel 3',
      'Test Channel',
      'web-staging.cvent.com'
    );
    const channelFour = await createChannel(
      client,
      testHubId,
      'filter channel 4',
      'Test Channel',
      'web-staging.cvent.com'
    );
    // channelFive is expected to be listed after the Homepage because the VideoCenter client call returns an alphabetically sorted list and f(ilter) < H(omepage) < T(his)
    const channelFive = await createChannel(
      client,
      testHubId,
      'This should be after Homepage',
      'Test Channel',
      'web-staging.cvent.com'
    );
    channelList.push(channelOne.id);
    channelList.push(channelTwo.id);
    channelList.push(channelThree.id);
    channelList.push(channelFour.id);
    channelList.push(channelFive.id);
    const response = await getHubPages(client, testHubId);
    const pageNames = response.data.map(hubPage => {
      return hubPage?.name;
    });

    expect(response).toBeTruthy();
    expect(response.data.length).toEqual(numberOfPages);
    expect(pageNames).toEqual([
      channelOne.title,
      channelTwo.title,
      channelThree.title,
      channelFour.title,
      'Homepage',
      channelFive.title
    ]);

    await cleanChannels(channelList);
  });
});

describe('query: hubPagesWithBanner', () => {
  it('returns the homepage', async () => {
    newBannerData.centerId = testHubId;
    const banner = await rawCreateBanner(client, newBannerData);
    const bannerAssociation = {
      banner: banner.data.bannerCreate,
      displayOrder: 1
    };
    const bannerAssociationCreate = {
      centerId: testHubId,
      entityId: testHubId,
      entityType: 'Homepage',
      bannerAssociation: [bannerAssociation]
    };
    await setBannerAssociations(client, bannerAssociationCreate);
    const bannerHubSearch = {
      hubId: testHubId,
      bannerId: bannerAssociation.banner
    };
    const response = await getHubPagesWithBanner(client, bannerHubSearch);
    expect(response).toBeTruthy();
    expect(response.data.length).toEqual(1);
  });
});

describe('query: hubs', () => {
  let response = null;

  beforeAll(async () => {
    response = await client.query({
      query: hubs
    });
  });

  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () =>
      clientWithIncorrectRole.query({
        query: hubs
      })
    ).rejects.toThrow('Not authorized');
  });

  it('responds with data.hubs array', async () => {
    expect(response).toBeTruthy();
    expect(response.data).toBeTruthy();
    expect(response.data.hubs).toBeTruthy();
    expect(response.data.hubs.paging).toBeTruthy();
    expect(response.data.hubs.data).toBeTruthy();
    expect(response.data.hubs.data.length).toBeLessThanOrEqual(response.data.hubs.paging.limit);
  });

  it('the data.hubs property is a collection of Hub objects with persisted config settings', async () => {
    expect(response.data.hubs.data[0].config).toBeTruthy();
  });

  it('the data.hubs property could also include any theme settings', async () => {
    expect(response.data.hubs.data[0].theme).toBeTruthy();
  });
});

describe('mutation: hubUpdateSettings', () => {
  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: updateSettings,
        variables: {
          input: {
            id: testHubId,
            hubSettings: {
              ccpaEnableDoNotSell: true,
              ccpaLinkText: 'Do Not Sell My Personal Info 4',
              ccpaDoNotSellUrl: 'donotsell.com',
              ccpaLinkExplanationText: 'ccpa explanation text',
              allowTurnOffGoogleAnalytics: false,
              allowHubSearchEngineIndexing: false,
              profileCard: {
                allowNameEdit: true
              },
              guestVisibility: GuestVisibility.VideoPlaybackPrivate,
              registrationSettings: {
                allowAllContactsRegistration: false,
                allowContactGroupsRegistration: true,
                allowContactTypesRegistration: true,
                blockContactsRegistration: true,
                blockListRegistration: true
              }
            }
          }
        }
      })
    ).rejects.toThrow('Not authorized');
  });

  it('updates hub settings', async () => {
    const response = await rawUpdateHubSettings(client, {
      id: testHubId,
      hubSettings: {
        ccpaEnableDoNotSell: true,
        ccpaLinkText: 'Do Not Sell My Personal Info 4',
        ccpaDoNotSellUrl: 'donotsell.com',
        ccpaLinkExplanationText: 'ccpa explanation text',
        allowTurnOffGoogleAnalytics: false,
        allowHubSearchEngineIndexing: false,
        profileCard: {
          allowNameEdit: true
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
          customLinkText: 'Custom link Text'
        }
      }
    });
    expect(response.data).toBeTruthy();
    expect(response.data.hubUpdateSettings).toBeTruthy();
  });
});

describe('query: getHubSettings', () => {
  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () => getHubSettings(clientWithIncorrectRole, 'nonsense-id')).rejects.toThrow('Not authorized');
  });

  skipItIfProdEnvironment()('throws Not Found when hub id not found', async () => {
    await expect(async () => getHubSettings(client, 'nonsense-id')).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('throws Not Found when hub id of different account', async () => {
    await expect(async () => getHubSettings(clientFromOtherAccount, testHubId)).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('fetches hub settings for given hub id', async () => {
    const data = await getHubSettings(client, testHubId);
    expect(data).toBeTruthy();
  });
});

describe('query: getHubTermsEditPermission', () => {
  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () => getHubTermsEditAllowed(clientWithIncorrectRole, 'nonsense-id')).rejects.toThrow(
      'Not authorized'
    );
  });

  skipItIfProdEnvironment()('throws Not Found when hub id not found', async () => {
    await expect(async () => getHubTermsEditAllowed(client, 'nonsense-id')).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('throws Not Found when hub id of different account', async () => {
    await expect(async () => getHubTermsEditAllowed(clientFromOtherAccount, testHubId)).rejects.toThrow('Not Found');
  });

  it('fetches hub terms Allowed permission for given hub id', async () => {
    const data = await getHubTermsEditAllowed(client, testHubId);
    expect(data).toBeTruthy();
    expect(data).toMatchObject({ getHubTermsEditPermission: 'ALLOWED' });
  });
});

describe('query: banners', () => {
  it('fetch hub banners', async () => {
    const bannerSearch = {
      hubId: testHubId,
      limit: 1
    };

    const banners = await getHubBanners(client, bannerSearch);

    expect(banners).toBeTruthy();
    expect(banners.data).toBeTruthy();
    expect(banners.paging.limit).toEqual(bannerSearch.limit);
  });

  skipItIfProdEnvironment()('throws Unauthorized when missing video-hub roles', async () => {
    await expect(async () => getHubBanners(clientWithIncorrectRole, { hubId: testHubId })).rejects.toThrow(
      'Not authorized'
    );
  });

  skipItIfProdEnvironment()('throws Not Found invalid hub id', async () => {
    await expect(async () => getHubBanners(client, { hubId: 'invalid-hub-id' })).rejects.toThrow('Not Found');
  });
});

describe('mutation: setBannerAssociations', () => {
  it('sets association between a possible list of banners and an entity', async () => {
    newBannerData.centerId = testHubId;
    const banner = await rawCreateBanner(client, newBannerData);
    const bannerAssociation = {
      banner: banner.data.bannerCreate,
      displayOrder: 1
    };
    const bannerAssociationCreate = {
      centerId: testHubId,
      entityId: testHubId,
      entityType: 'Homepage',
      bannerAssociation: [bannerAssociation]
    };
    const response = await setBannerAssociations(client, bannerAssociationCreate);
    expect(response.__typename).toEqual('BannerAssociationPaging');
    expect(response.data[0].__typename).toEqual('ExistingBannerAssociationWithBanner');
    expect(response.data[0].banner.id).toEqual(banner.data.bannerCreate);
    expect(response.data[0].centerId).toEqual(testHubId);
    expect(response.data[0].entityId).toEqual(testHubId);
    expect(response.data[0].entityType).toEqual('Homepage');
    expect(response.paging.currentToken).toEqual('');
  });

  skipItIfProdEnvironment()('throws Not Found when banner id is not found', async () => {
    const bannerAssociation = {
      banner: uuidV4(),
      displayOrder: 1
    };
    const bannerAssociationCreate: BannerAssociationCreate = {
      centerId: testHubId,
      entityId: testHubId,
      entityType: 'Homepage',
      bannerAssociation: [bannerAssociation]
    };
    await expect(async () => setBannerAssociations(client, bannerAssociationCreate)).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('throws Not Found when center id is not found', async () => {
    newBannerData.centerId = testHubId;
    const banner = await rawCreateBanner(client, newBannerData);
    const bannerAssociation = {
      banner: banner.data.bannerCreate,
      displayOrder: 1
    };
    const bannerAssociationCreate: BannerAssociationCreate = {
      centerId: uuidV4(),
      entityId: testHubId,
      entityType: 'Homepage',
      bannerAssociation: [bannerAssociation]
    };
    await expect(async () => setBannerAssociations(client, bannerAssociationCreate)).rejects.toThrow('Not Found');
  });
});

describe('query: getCenterFeatures', () => {
  it('Should successfully return the list of features for a particular centerId', async () => {
    const input = {
      id: testHubId
    };
    const response = await getCenterFeatures(client, input);
    expect(response).toBeTruthy();
    expect(response).toMatchObject(getFeaturesListResponse);
  });

  skipItIfProdEnvironment()('Should return Unauthorized for expired access token', async () => {
    const input = {
      id: uuidV4()
    };
    await expect(async () => getCenterFeatures(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
  });

  skipItIfProdEnvironment()('should return not found for an invalid center id', async () => {
    const input = {
      id: uuidV4()
    };
    await expect(async () => getCenterFeatures(client, input)).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('should return Not Found when center id of different account.', async () => {
    const input = {
      id: testHubId
    };
    await expect(async () => getCenterFeatures(clientFromOtherAccount, input)).rejects.toThrow('Not Found');
  });
});

describe('mutation: centerUpdateFeature', () => {
  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () =>
      clientWithIncorrectRole.mutate({
        mutation: updateCenterFeature,
        variables: {
          input: {
            centerId: testHubId,
            code: 'PROFILE_SETUP',
            enabled: false
          }
        }
      })
    ).rejects.toThrow('Not authorized');
  });
  it('Updates center feature enabled for provided feature code', async () => {
    const response = await centerFeatureUpdate(client, {
      centerId: testHubId,
      code: 'YOUR_EVENTS',
      enabled: true
    });
    expect(response).toBeTruthy();
    expect(response.enabled).toBe(true);
  });
});

describe('query: getHubLocales', () => {
  it('Gets the locales on a hub', async () => {
    const response = await getHubLocales(client, {
      id: testHubId
    });
    expect(response).toBeTruthy();
    expect(response.data.length).toBeGreaterThanOrEqual(1);
  });
});

describe('mutation: addHubLocales', () => {
  it('Adds new locales to a hub', async () => {
    const response = await AddToHubLocales(client, {
      id: { id: testHubId },
      hubLocales: { data: ['ab1', 'ab2'] }
    });
    expect(response).toBeTruthy();
    expect(response.data.length).toBe(3);
  });
});

describe('mutation: updateBrandingImages', () => {
  let updateHubId = null;

  beforeEach(async () => {
    updateHubId = await createHub(client, newHubData);
  });

  afterEach(async () => {
    const hub = await getHub(client, updateHubId);
    if (hub.id) {
      await rawDeleteHub(client, { id: updateHubId });
    }
  });

  it('Updates branding images (Logo and Favicon) when new Logo params available', async () => {
    const s3ProxyClient = new S3ProxyClient();
    const config = {
      context: {
        headers: { ignore: 'me' },
        environment: process.env.ENVIRONMENT_NAME
      },
      cache: undefined
    };
    s3ProxyClient.initialize(config);
    const resp = await s3ProxyClient.uploadTestImage(`${ACCOUNT_STUB}/test/eventsplus/${updateHubId}/logos`);
    const testFavicon = await s3ProxyClient.uploadTestImage(`${ACCOUNT_STUB}/test/eventsplus/${updateHubId}/favicon`);
    const croppedUrl = await cropImage(resp.location, updateHubId, authOptions.authorization.metadata.accountStub);
    const croppedResp = await croppedUrl.json();
    const newLogoImageUrl = croppedResp.location;
    const brandingImagesInput: BrandingImagesInput = {
      hubId: updateHubId,
      newLogoUrl: newLogoImageUrl,
      newLogoOriginalUrl: resp.location,
      logoAltText: newHubData.theme.logoAltText,
      faviconUrl: testFavicon.location
    };

    const response = await rawUpdateBrandingImages(client, brandingImagesInput);
    expect(response.data).toBeTruthy();
    expect(response.data.updateBrandingImages.id).toEqual(updateHubId);
    const refreshedHub = await getHub(client, updateHubId);
    expect(refreshedHub.theme?.faviconUrl).toBeTruthy();
  });

  it('Updates branding images (Logo and Favicon) when new Logo params not available', async () => {
    const brandingImagesInput: BrandingImagesInput = {
      hubId: updateHubId,
      logoAltText: newHubData.theme.logoAltText,
      faviconUrl: null
    };

    const response = await rawUpdateBrandingImages(client, brandingImagesInput);
    expect(response.data).toBeTruthy();
    expect(response.data.updateBrandingImages.id).toEqual(updateHubId);
    const refreshedHub = await getHub(client, updateHubId);
    expect(refreshedHub.theme?.faviconUrl).not.toBeTruthy();
  });
});

describe('UTM Overrides', () => {
  describe('query: getUtmOverrides', () => {
    it('Should successfully return the list of UTM overrides for a particular centerId', async () => {
      const input = {
        id: testHubId
      };
      const response = await getHubUtmOverrides(client, input);
      expect(response).toBeTruthy();
      expect(response.length).toEqual(0);
    });
  });

  describe('mutation: setUtmOverrides', () => {
    it('Should successfully set the list of UTM overrides for a particular centerId', async () => {
      const input = {
        id: testHubId
      };
      const response = await setHubUtmOverrides(client, input, []);
      expect(response).toBeTruthy();
      expect(response.length).toEqual(0);
    });
  });
});

describe('Translations', () => {
  describe('query: getTranslations', () => {
    it('Should successfully return the list of translations for a particular centerId and locale', async () => {
      const input: TranslationSearch = {
        hubId: testHubId,
        locale: 'en-US',
        limit: 10
      };
      const response = await getHubTranslations(client, input);
      expect(response).toBeTruthy();
      expect(response.data.length).toEqual(10);
      expect(response.paging.nextToken).toBeTruthy();
      const nextPageInput: TranslationSearch = {
        hubId: testHubId,
        locale: 'en-US',
        token: response.paging.nextToken
      };
      const nextPageResponse = await getHubTranslations(client, nextPageInput);
      expect(nextPageResponse).toBeTruthy();
      expect(nextPageResponse.data).toBeTruthy();
      expect(nextPageResponse.paging).toBeTruthy();
      expect(nextPageResponse.paging.previousToken).toBeTruthy();
    });
  });

  describe('mutation: setTranslations', () => {
    it('Should successfully set the list of translations for a particular centerId and locale', async () => {
      const input = {
        id: testHubId
      };
      const data = [
        {
          type: 'PhraseApp-Key',
          locale: testHub.config.locale,
          id: 'show_less_button',
          translatedValue: 'show less translated'
        },
        {
          type: 'PhraseApp-Key',
          locale: testHub.config.locale,
          id: 'bad_id',
          translatedValue: 'bad id translated value'
        }
      ];
      const response = await setHubTranslations(client, input, testHub.config.locale, data);
      expect(response).toBeTruthy();
      expect(response.Failure?.length).toEqual(1);
      expect(response.Success?.length).toEqual(1);
    });
  });
  describe('mutation: resetTranslations', () => {
    it('Should successfully reset the list of translations for a particular centerId and locale', async () => {
      const setTranslationsInput = {
        id: testHubId
      };
      const data = [
        {
          type: 'PhraseApp-Key',
          locale: testHub.config.locale,
          id: 'show_less_button',
          translatedValue: 'show less translated'
        }
      ];
      const input = {
        hubId: testHubId,
        locale: 'en-US',
        type: 'all'
      };
      const getTranslationsInput = {
        hubId: testHubId,
        locale: 'en-US',
        translations: 'translated'
      };
      await setHubTranslations(client, setTranslationsInput, testHub.config.locale, data);
      const firstResponse = await getHubTranslations(client, getTranslationsInput);
      expect(firstResponse).toBeTruthy();
      expect(firstResponse.data.length).toBeGreaterThanOrEqual(1);
      await resetHubTranslations(client, input);
      const response = await getHubTranslations(client, getTranslationsInput);
      expect(response).toBeTruthy();
      expect(response.data.length).toEqual(0);
    });
  });
});

describe('query: getHubCustomizations, mutation: upsertHubCustomizations', () => {
  it('Gets hub customizations, upsert customization', async () => {
    // Get customization for hub not having any customization
    let response = await getHubCustomizations(client, testHubId);
    expect(response).toBeTruthy();
    expect(response.headerHtml).toBeFalsy();
    expect(response.headerCss).toBeFalsy();
    expect(response.headerJavascript).toBeFalsy();
    expect(response.showCustomHeader).toBeFalsy();
    expect(response.showChannels).toBe(true);
    expect(response.showUpcomingEvents).toBe(true);
    expect(response.showLogo).toBe(true);
    expect(response.showLogin).toBe(true);
    expect(response.showVideos).toBe(true);
    expect(response.navigationLinkTextSize).toBe(12);
    expect(response.navigationLinkHighlightStyle).toBe(NavigationLinkHighlightStyle.Filled);

    const input: CustomizationsInput = {
      headerHtml: '<h1>Hello World</h1>',
      headerCss: 'This is test CSS',
      headerJavascript: 'This is test Javascript',
      showCustomHeader: true,
      showChannels: false,
      showVideos: false,
      navigationLinkTextSize: 18,
      navigationLinkHighlightStyle: NavigationLinkHighlightStyle.Underline,
      navigationHeaderLeftPadding: 18,
      navigationHeaderRightPadding: 18,
      navigationHeaderMaxWidth: 2000
    };

    // Upsert customization for first time
    response = await upsertHubCustomizations(client, { id: testHubId }, input);
    expect(response).toBeTruthy();
    expect(response.headerHtml).toEqual(input.headerHtml);
    expect(response.headerCss).toEqual(input.headerCss);
    expect(response.headerJavascript).toEqual(input.headerJavascript);
    expect(response.showCustomHeader).toEqual(input.showCustomHeader);
    expect(response.showChannels).toBe(false);
    expect(response.showUpcomingEvents).toBe(true);
    expect(response.showLogo).toBe(true);
    expect(response.showLogin).toBe(true);
    expect(response.showVideos).toBe(false);
    expect(response.navigationLinkTextSize).toEqual(input.navigationLinkTextSize);
    expect(response.navigationLinkHighlightStyle).toEqual(input.navigationLinkHighlightStyle);
    expect(response.navigationHeaderLeftPadding).toEqual(input.navigationHeaderLeftPadding);
    expect(response.navigationHeaderRightPadding).toEqual(input.navigationHeaderRightPadding);
    expect(response.navigationHeaderMaxWidth).toEqual(input.navigationHeaderMaxWidth);

    // Get customization for recently updated hub
    response = await getHubCustomizations(client, testHubId);
    expect(response).toBeTruthy();
    expect(response.headerHtml).toEqual(input.headerHtml);
    expect(response.headerCss).toEqual(input.headerCss);
    expect(response.headerJavascript).toEqual(input.headerJavascript);
    expect(response.showCustomHeader).toEqual(input.showCustomHeader);
    expect(response.showChannels).toBe(false);
    expect(response.showUpcomingEvents).toBe(true);
    expect(response.showLogo).toBe(true);
    expect(response.showLogin).toBe(true);
    expect(response.showVideos).toBe(false);

    // Upsert customization with dirty HTML
    const dirtyHtml =
      '<div><div onload=alert(\'XSS02\')> Xss issue </div> <img src="img_girl.jpg" alt="Girl in a jacket" width="500" height="600"/> </div>';

    const cleanedHtml =
      '<div><div> Xss issue </div> <img src="img_girl.jpg" alt="Girl in a jacket" width="500" height="600" /> </div>';

    response = await upsertHubCustomizations(client, { id: testHubId }, { ...input, headerHtml: dirtyHtml });
    expect(response).toBeTruthy();
    expect(response.headerHtml).toEqual(cleanedHtml);
    expect(response.headerCss).toEqual(input.headerCss);
    expect(response.headerJavascript).toEqual(input.headerJavascript);
    expect(response.showCustomHeader).toEqual(input.showCustomHeader);
    expect(response.showChannels).toBe(false);
    expect(response.showUpcomingEvents).toBe(true);
    expect(response.showLogo).toBe(true);
    expect(response.showLogin).toBe(true);
    expect(response.showVideos).toBe(false);

    // Upsert customization with only HTML field
    response = await upsertHubCustomizations(client, { id: testHubId }, { headerHtml: input.headerHtml });
    expect(response).toBeTruthy();
    expect(response.headerHtml).toEqual(input.headerHtml);
    expect(response.headerCss).toEqual(input.headerCss);
    expect(response.headerJavascript).toEqual(input.headerJavascript);
    expect(response.showCustomHeader).toEqual(input.showCustomHeader);
  });

  skipItIfProdEnvironment()('throws Unauthorized when lacking video-hub roles in bearer', async () => {
    await expect(async () =>
      clientWithIncorrectRole.query({
        query: getHubCustomizationsQuery,
        variables: {
          id: {
            id: testHubId
          }
        }
      })
    ).rejects.toThrow('Not authorized');
  });
});

// MAUVE - Flaky test
/* eslint-disable */
xdescribe('query: getRegistrationFormSettings', () => {
  it('Should successfully return registrationFormSettings', async () => {
    const response = await getRegistrationFormSettings(client, testHubId);
    expect(response).toBeTruthy();
  });

  skipItIfProdEnvironment()('Should return Unauthorized for expired access token', async () => {
    await expect(async () => getRegistrationFormSettings(clientWithIncorrectRole, uuidV4())).rejects.toThrow(
      'Not authorized'
    );
  });

  skipItIfProdEnvironment()('should return not found for an invalid center id', async () => {
    await expect(async () => getRegistrationFormSettings(client, uuidV4())).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('should return Not Found when center id of different account.', async () => {
    await expect(async () => getRegistrationFormSettings(clientFromOtherAccount, testHubId)).rejects.toThrow(
      'Not Found'
    );
  });
});

// MAUVE - Flaky test
/* eslint-disable */
xdescribe('mutation: UpdateRegistrationFormSettings', () => {
  it('Should successfully update registrationFormSettings', async () => {
    const updateRegistrationFormSettingsInput = {
      hubId: testHubId,
      data: [
        {
          code: RegistrationFieldCode.JobTitle,
          order: 2,
          required: false,
          included: true
        }
      ]
    };
    const response = await updateRegistrationFormSettings(client, updateRegistrationFormSettingsInput);
    expect(response).toBeTruthy();
  }, 20000);

  skipItIfProdEnvironment()('Should return Unauthorized for expired access token', async () => {
    await expect(async () =>
      updateRegistrationFormSettings(clientWithIncorrectRole, {
        hubId: uuidV4(),
        data: [
          {
            code: RegistrationFieldCode.JobTitle,
            order: 2,
            required: false,
            included: true
          }
        ]
      })
    ).rejects.toThrow('Not authorized');
  });

  skipItIfProdEnvironment()('should return not found for an invalid center id', async () => {
    await expect(async () =>
      updateRegistrationFormSettings(client, {
        hubId: uuidV4(),
        data: [
          {
            code: RegistrationFieldCode.JobTitle,
            order: 2,
            required: false,
            included: true
          }
        ]
      })
    ).rejects.toThrow('Not Found');
  });

  skipItIfProdEnvironment()('should return Not Found when center id of different account.', async () => {
    await expect(async () =>
      updateRegistrationFormSettings(clientFromOtherAccount, {
        hubId: uuidV4(),
        data: [
          {
            code: RegistrationFieldCode.JobTitle,
            order: 2,
            required: false,
            included: true
          }
        ]
      })
    ).rejects.toThrow('Not Found');
  });
});
