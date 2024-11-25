import { faker } from '@faker-js/faker';

// faker.js generates locales which the current java validator considers invalid.
export const newHubData = {
  config: {
    title: `[planner-event-hubs] Graph ITs ${faker.company.name()}`,
    ownerFirstName: faker.person.firstName(),
    ownerLastName: faker.person.lastName(),
    ownerEmail: faker.internet.email(),
    locale: 'en-US',
    helpEmailAddress: null
  },
  theme: {
    backgroundColor: faker.internet.color(),
    logoAltText: faker.lorem.words(3),
    logoImageUrl: faker.image.avatar(),
    logoOriginalImageUrl: 'https://s3.amazonaws.com/account-id/random/bits.jpg',
    moodColor: faker.internet.color(),
    safeMode: faker.datatype.boolean(),
    faviconUrl: faker.image.avatar()
  },
  calendar: {
    id: '36a25c15-fe89-40c5-93f3-7d487a70b807'
  }
};

export const newHubDataNoCalendar = {
  config: {
    title: `[planner-event-hubs] Graph ITs ${faker.company.name()}`,
    ownerFirstName: faker.person.firstName(),
    ownerLastName: faker.person.lastName(),
    ownerEmail: faker.internet.email(),
    locale: 'en-US',
    helpEmailAddress: null
  },
  theme: {
    backgroundColor: faker.internet.color(),
    logoAltText: faker.lorem.words(3),
    logoImageUrl: faker.image.avatar(),
    logoOriginalImageUrl: 'https://s3.amazonaws.com/account-id/random/bits.jpg',
    moodColor: faker.internet.color(),
    safeMode: faker.datatype.boolean(),
    faviconUrl: faker.image.avatar()
  }
};

export const invalidHubData = {
  config: {
    title: '',
    ownerEmail: '',
    ownerFirstName: '',
    ownerLastName: '',
    locale: 'en-US'
  }
};

export const invalidHubMissingParams = {
  config: {
    ownerFirstName: faker.person.firstName(),
    ownerLastName: faker.person.lastName(),
    ownerEmail: faker.internet.email()
  }
};

export const invalidHubMalformedColorCode = {
  config: newHubData.config,
  theme: {
    backgroundColor: 'black'
  }
};

export const page = {
  pageId: '7d7a5619-2057-4f0d-87c3-2c5ea57311e6',
  videoCenterId: '001d2a4d-f653-4a78-8be8-6845162893ea',
  status: 'Draft',
  sectionIds: ['f1b7d659-7ca0-4efc-a3ea-f1fb751c3b27', 'e691b3d7-e59c-4926-81d8-7ffb67c135d2']
};

export const section = {
  sectionId: 'e691b3d7-e59c-4926-81d8-7ffb67c135d3',
  originPageId: '7d7a5619-2057-4f0d-87c3-2c5ea57311e5',
  pageSectionTemplate: 'EventCalendar',
  title: 'Section title',
  visibleFields: ['field 1', 'field 2'],
  contentLimitOnInitialLoad: 5,
  featuredContentType: 'featured content type',
  featuredContentTypeId: '39d6ed4a-f090-402c-8f66-00b9025a1e62',
  contentType: 'content type',
  contentIds: [
    'da9a0663-08f2-45be-a5db-7f49e04dcbbf',
    '95332cdb-e081-459a-8032-78a5698b3221',
    '34e8815b-0f6a-49b1-b2e6-ac8c6a8c932b'
  ],
  contentFilterType: 'top-videos',
  contentFilterDateAbstract: '30-days',
  alignment: 'Left',
  layout: 'FullImage',
  textBody: 'text body',
  textColor: '#AABBCC',
  buttonEnabled: true,
  buttonText: 'button text',
  buttonExternalTarget: 'button external target',
  buttonInternalTarget: 'button internal target',
  buttonTargetType: 'Internal',
  imageUrl: 'https://some.imageurl.com',
  originalImageUrl: 'https://some.originalimageurl.com',
  imageAltText: 'Image alt text'
};
