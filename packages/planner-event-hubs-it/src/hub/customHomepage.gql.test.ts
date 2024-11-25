import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { newHubDataNoCalendar, page, section } from '@fixtures/hubData';
import { authOptions, connectToApiAsPlanner } from '@helpers/connectToApiAsPlanner';
import {
  createHub,
  hubPublish,
  getHub,
  rawDeleteHub,
  createPage,
  createSection,
  updateSection,
  updatePage,
  getPage,
  getPublishedPageOrDefaults,
  rawUpdateHub
} from '@helpers/hubFunctions';
import { v4 as uuidV4 } from 'uuid';
import { S3ProxyClient } from '@utils/s3ProxyClient';
import { ACCOUNT_STUB } from '@utils/constants';
import { cropImage } from '@helpers/uploadFunctions';
import { PageInput, PageSectionInput, PageWithSection } from '@cvent/planner-event-hubs-model/types';

let client: ApolloClient<NormalizedCacheObject>;
let testHubId: string;
let testHub;
let hubInput: { id: string };

const createDraftPageWithSection = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  pageData: PageInput,
  sectionData: PageSectionInput
): Promise<PageWithSection> => {
  // create a new draft page with a new section
  const createPageResponse = await createPage(client, pageData, sectionData);
  expect(createPageResponse).toBeTruthy();
  expect(createPageResponse).toEqual({
    page: { ...pageData, __typename: 'Page' },
    newSection: { ...sectionData, __typename: 'PageSection' },
    __typename: 'PageWithSection'
  });

  return createPageResponse;
};

const prepareImageForTesting = async (
  apolloClient: ApolloClient<NormalizedCacheObject>,
  sectionId: string
): Promise<{ newImageUrl: string; newOriginalImageUrl: string }> => {
  const s3ProxyClient = new S3ProxyClient();
  const config = {
    context: {
      headers: { ignore: 'me' },
      environment: process.env.ENVIRONMENT_NAME
    },
    cache: undefined
  };
  s3ProxyClient.initialize(config);
  const resp = await s3ProxyClient.uploadTestImage(`${ACCOUNT_STUB}/eventsplus/${testHubId}/Section/${sectionId}`);
  // planner applies change
  const croppedUrl = await cropImage(resp.location, testHubId, authOptions.authorization.metadata.accountStub);
  const croppedResp = await croppedUrl.json();
  const newImageUrl = croppedResp.location;

  return { newImageUrl, newOriginalImageUrl: resp.location };
};

describe('Events+ Hub Homepage Customization graphs', () => {
  beforeAll(async () => {
    client = await connectToApiAsPlanner(authOptions);
  }, 10000);

  beforeEach(async () => {
    testHub = newHubDataNoCalendar;
    testHubId = await createHub(client, testHub);
    hubInput = {
      id: testHubId
    };
    await hubPublish(client, { id: testHubId });
  }, 10000);

  afterEach(async () => {
    const hub = await getHub(client, testHubId);
    if (hub.id) {
      await rawDeleteHub(client, { id: testHubId });
    }
  });
  describe('query: getPage, mutation: get/set pages/sections', () => {
    it('Should successfully create and retrieve a homepage', async () => {
      const pageId = uuidV4();
      const sectionIds = [uuidV4(), uuidV4()];
      const [sectionId1, sectionId2] = sectionIds;
      const pageData = { ...page, pageId, videoCenterId: testHubId, sectionIds: [sectionId1] };
      const sectionData = { ...section, sectionId: sectionId1, originPageId: pageId };

      await createDraftPageWithSection(client, pageData, sectionData);

      // create a new section
      sectionData.sectionId = sectionId2;
      const createSectionResponse = await createSection(client, hubInput, sectionData);
      expect(createSectionResponse).toBeTruthy();
      expect(createSectionResponse).toEqual({ ...sectionData, __typename: 'PageSection' });
      const { newImageUrl, newOriginalImageUrl } = await prepareImageForTesting(client, sectionData.sectionId);
      const updateSectionResponse = await updateSection(client, hubInput, {
        ...sectionData,
        title: 'Updated Section title',
        newImageUrl,
        newOriginalImageUrl
      });
      expect(updateSectionResponse).toBeTruthy();
      expect(updateSectionResponse.title).toEqual('Updated Section title');
      expect(updateSectionResponse.imageUrl).toMatch(/https:\/\/images.*cvent.com\/.+\/[\w\d]+!_![\w\d]+\.[\w]{3,4}/i);
      expect(updateSectionResponse.originalImageUrl).toMatch(/https:\/\/custom.*cvent.com\/.+\/[\w\d]+\.[\w]{3,4}/i);

      // publish the page with the newly added sections
      pageData.sectionIds = sectionIds;
      const updatePageResponse = await updatePage(client, { ...pageData, status: 'Published' });
      expect(updatePageResponse).toBeTruthy();
      expect(updatePageResponse).toEqual({ ...pageData, status: 'Published', __typename: 'Page' });
      const publishedDataResponse = await getPage(client, hubInput);
      expect(publishedDataResponse).toBeTruthy();
      expect(publishedDataResponse?.page?.status).toEqual('Published');
      expect(publishedDataResponse?.sections[0].title).toEqual('Section title');
      expect(publishedDataResponse?.sections[1].title).toEqual('Updated Section title');
    });
  });

  describe('mutation: createPage with a Section that has images', () => {
    it('Creates a new page with a new section that has images', async () => {
      const pageId = uuidV4();
      const sectionIds = [uuidV4()];
      const sectionId = sectionIds[0];
      const pageData: PageInput = { ...page, pageId, videoCenterId: testHubId, sectionIds };
      const sectionData: PageSectionInput = { ...section, sectionId, originPageId: pageId };
      const { newImageUrl, newOriginalImageUrl } = await prepareImageForTesting(client, sectionData.sectionId);
      sectionData.newImageUrl = newImageUrl;
      sectionData.newOriginalImageUrl = newOriginalImageUrl;
      const createPageResponse = await createPage(client, pageData, sectionData);
      expect(createPageResponse?.page).toEqual({ ...pageData, __typename: 'Page' });
      expect(createPageResponse?.newSection?.imageUrl).toMatch(
        /https:\/\/images.*cvent.com\/.+\/[\w\d]+!_![\w\d]+\.[\w]{3,4}/i
      );
      expect(createPageResponse?.newSection?.originalImageUrl).toMatch(
        /https:\/\/custom.*cvent.com\/.+\/[\w\d]+\.[\w]{3,4}/i
      );
    });
  });

  describe('mutation: createSection', () => {
    it('Creates a new section with a new image', async () => {
      const pageId = uuidV4();
      const sectionIds = [uuidV4()];
      const sectionId = sectionIds[0];
      const pageData: PageInput = { ...page, pageId, videoCenterId: testHubId, sectionIds };
      await createPage(client, pageData);
      const sectionData: PageSectionInput = { ...section, sectionId, originPageId: pageId };
      const { newImageUrl, newOriginalImageUrl } = await prepareImageForTesting(client, sectionData.sectionId);
      sectionData.newImageUrl = newImageUrl;
      sectionData.newOriginalImageUrl = newOriginalImageUrl;

      const newSection = await createSection(client, hubInput, sectionData);
      expect(newSection).toBeTruthy();
      expect(newSection.imageUrl).toMatch(/https:\/\/images.*cvent.com\/.+\/[\w\d]+!_![\w\d]+\.[\w]{3,4}/i);
      expect(newSection.originalImageUrl).toMatch(/https:\/\/custom.*cvent.com\/.+\/[\w\d]+\.[\w]{3,4}/i);
    });
  });

  describe('query: getPageOrDefaults', () => {
    it('creates and returns a new draft page with Channels & Videos Sections if no published page exists and calendar IS NOT associated to the hub', async () => {
      const preflight = await getPage(client, hubInput);
      expect(preflight.page).toBeNull();
      expect(preflight.sections).toEqual(null);

      const pageAndSections = await getPublishedPageOrDefaults(client, hubInput);
      expect(pageAndSections?.page?.status).toEqual('Draft');
      expect(pageAndSections?.sections).toHaveLength(2);
      expect(pageAndSections?.sections?.at(0)).toHaveProperty('title', 'Channels');
      expect(pageAndSections?.sections?.at(1)).toHaveProperty('title', "What's New");
    });

    it('creates and returns a new draft page with Upcoming Events, Channels & Videos Sections if no published page exists and calendar IS associated to the hub', async () => {
      const preflight = await getPage(client, hubInput);
      expect(preflight.page).toBeNull();
      expect(preflight.sections).toEqual(null);

      await rawUpdateHub(client, { ...testHub, id: testHubId, calendar: { id: uuidV4() } });

      const pageAndSections = await getPublishedPageOrDefaults(client, hubInput);
      expect(pageAndSections?.page?.status).toEqual('Draft');
      expect(pageAndSections?.sections).toHaveLength(3);
      expect(pageAndSections?.sections?.at(0)).toHaveProperty('title', 'Upcoming Events');
      expect(pageAndSections?.sections?.at(1)).toHaveProperty('title', 'Channels');
      expect(pageAndSections?.sections?.at(2)).toHaveProperty('title', "What's New");
    });

    it('retrieves the current published page and its sections', async () => {
      const pageId = uuidV4();
      const sectionId = uuidV4();
      const pageData = { ...page, pageId, videoCenterId: testHubId, sectionIds: [sectionId] };
      const sectionData = { ...section, sectionId, originPageId: pageId };
      await createPage(client, pageData);
      await createSection(client, hubInput, sectionData);
      await updatePage(client, { ...pageData, status: 'Published' });

      const pageAndSections = await getPublishedPageOrDefaults(client, hubInput);
      expect(pageAndSections.page?.status).toEqual('Published');
      expect(pageAndSections.sections?.length).toEqual(1);
    });
  });
});
