import { faker } from '@faker-js/faker';
import { NewBanner } from '@cvent/planner-event-hubs-model/operations';

export const newBannerData: NewBanner = {
  centerId: null,
  name: 'name',
  layout: 'layout',
  imageAlignment: 'Right',
  imageAltText: 'Image Alt Text',
  text: {
    title: 'title',
    body: 'body',
    alignment: 'Left',
    color: '#ABC123'
  },
  button: {
    enabled: true,
    text: 'button-text',
    target: 'http://button.com',
    targetType: 'External',
    internalTarget: 'Homepage'
  }
};

export const updateBannerData = {
  id: null,
  centerId: null,
  name: 'test name',
  layout: 'Left',
  imageAlignment: 'Right',
  imageAltText: 'New Image Alt Text',
  imageUrl: faker.image.avatar(),
  originalImageUrl: faker.image.avatar(),
  text: {
    title: 'title',
    body: 'body',
    alignment: 'Left',
    color: '#ABC123'
  },
  button: {
    enabled: true,
    text: 'button-text',
    target: 'http://button.com',
    targetType: 'External',
    internalTarget: 'Homepage'
  }
};

export const invalidBanner = {
  centerId: null,
  name: '',
  layout: ''
};
