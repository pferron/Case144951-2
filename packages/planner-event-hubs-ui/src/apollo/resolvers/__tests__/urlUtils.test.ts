import { VIDEO_CENTER_ID_NULL, CHANNEL_ID_NULL, VIDEO_ID_NULL } from '@utils/constants';
import {
  getVideoCenterChannelPageShortUrlTag,
  getVideoCenterMemberChannelPageUrl,
  getVideoCenterMemberHomePageUrl,
  getVideoCenterShortUrlTag,
  getVideoCenterVideoPageShortUrlTag,
  getVideoCenterVideoPageUrl
} from '../common/utils/urlUtils';

describe('Test URL utility', () => {
  process.env.VIDEO_HUB_WEB = 'https://video-hub.com';
  process.env.VIDEO_HUB_BASE_PATH = '/eventsplus';

  it('Verify Video Center Home Page URL', async () => {
    const response = getVideoCenterMemberHomePageUrl('9114b3cd-db35-4207-ba31-77efbd2ae9b6', {
      customDomain: null,
      absoluteUrl: true
    });
    expect(response).toBe(
      `${process.env.VIDEO_HUB_WEB}${process.env.VIDEO_HUB_BASE_PATH}/9114b3cd-db35-4207-ba31-77efbd2ae9b6`
    );
  });

  it('Verify Video Center Home Page URL with default url parameters', async () => {
    const response = getVideoCenterMemberHomePageUrl('9114b3cd-db35-4207-ba31-77efbd2ae9b6');
    expect(response).toBe('/9114b3cd-db35-4207-ba31-77efbd2ae9b6');
  });

  it('Verify Video Center Home Page URL with false absoluteUrl and no customDomain', async () => {
    const response = getVideoCenterMemberHomePageUrl('9114b3cd-db35-4207-ba31-77efbd2ae9b6', {
      customDomain: null,
      absoluteUrl: false
    });
    expect(response).toBe('/9114b3cd-db35-4207-ba31-77efbd2ae9b6');
  });

  it('Verify Video Center Home Page URL with false absoluteUrl and customDomain', async () => {
    const response = getVideoCenterMemberHomePageUrl('9114b3cd-db35-4207-ba31-77efbd2ae9b6', {
      customDomain: 't2-penguin.cevent.com',
      absoluteUrl: false
    });
    expect(response).toBe('/9114b3cd-db35-4207-ba31-77efbd2ae9b6');
  });

  it('Video Center Home Page URL should fail when ID is null', async () => {
    expect(() => {
      getVideoCenterMemberHomePageUrl(null, { customDomain: null, absoluteUrl: true });
    }).toThrow(VIDEO_CENTER_ID_NULL);
  });

  it('Verify Video Center Channel Page URL', async () => {
    const response = getVideoCenterMemberChannelPageUrl(
      '9114b3cd-db35-4207-ba31-77efbd2ae9b6',
      '9114b3cd-db35-4207-ba31-77efbd2ae9b6',
      null
    );
    expect(response).toBe(
      `${process.env.VIDEO_HUB_WEB}${process.env.VIDEO_HUB_BASE_PATH}/9114b3cd-db35-4207-ba31-77efbd2ae9b6/channels/9114b3cd-db35-4207-ba31-77efbd2ae9b6`
    );
  });

  it('Video Center Channel Page URL should fail when Hub ID is null', async () => {
    expect(() => {
      getVideoCenterMemberChannelPageUrl(null, '9114b3cd-db35-4207-ba31-77efbd2ae9b6', null);
    }).toThrow(VIDEO_CENTER_ID_NULL);
  });

  it('Video Center Channel Page URL should fail when Channel ID is null', async () => {
    expect(() => {
      getVideoCenterMemberChannelPageUrl('9114b3cd-db35-4207-ba31-77efbd2ae9b6', null, null);
    }).toThrow(CHANNEL_ID_NULL);
  });

  it('Video Center Channel Page URL with custom domain', async () => {
    const response = getVideoCenterMemberChannelPageUrl(
      '9114b3cd-db35-4207-ba31-77efbd2ae9b6',
      '9114b3cd-db35-4207-ba31-77efbd2ae9b6',
      't2-penguin.cevent.com'
    );
    expect(response).toBe(
      `https://t2-penguin.cevent.com${process.env.VIDEO_HUB_BASE_PATH}/9114b3cd-db35-4207-ba31-77efbd2ae9b6/channels/9114b3cd-db35-4207-ba31-77efbd2ae9b6`
    );
  });

  it('Verify Video Center Channel Page Short URL Tag', async () => {
    const response = getVideoCenterChannelPageShortUrlTag(
      '9114b3cd-db35-4207-ba31-77efbd2ae9b6',
      '9114b3cd-db35-4207-ba31-77efbd2ae9b6'
    );
    expect(response).toBe(
      'videocenter9114b3cd-db35-4207-ba31-77efbd2ae9b6_channel9114b3cd-db35-4207-ba31-77efbd2ae9b6'
    );
  });

  it('Video Center Channel Page Short URL Tag should fail when Video Center ID is null', async () => {
    expect(() => {
      getVideoCenterChannelPageShortUrlTag(null, '9114b3cd-db35-4207-ba31-77efbd2ae9b6');
    }).toThrow(VIDEO_CENTER_ID_NULL);
  });

  it('Video Center Channel Page Short URL Tag should fail when Channel ID is null', async () => {
    expect(() => {
      getVideoCenterChannelPageShortUrlTag('9114b3cd-db35-4207-ba31-77efbd2ae9b6', null);
    }).toThrow(CHANNEL_ID_NULL);
  });

  it('Video Center Short URL Tag should fail when Video Center ID is null', async () => {
    expect(() => {
      getVideoCenterShortUrlTag(null);
    }).toThrow(VIDEO_CENTER_ID_NULL);
  });

  it('Verify Video Center Short URL Tag', async () => {
    const response = getVideoCenterShortUrlTag('9114b3cd-db35-4207-ba31-77efbd2ae9b6');
    expect(response).toBe('videocenter9114b3cd-db35-4207-ba31-77efbd2ae9b6');
  });

  it('Builds getVideoCenterVideoPageUrl with empty null id', async () => {
    expect(() => getVideoCenterVideoPageUrl('a6be7bbe1a8b9787a88121d48c2eca54', null, '')).toThrow(VIDEO_ID_NULL);
  });

  it('Builds getVideoCenterVideoPageUrl with empty env', async () => {
    const response = getVideoCenterVideoPageUrl(
      'a6be7bbe1a8b9787a88121d48c2eca54',
      '59a7209aae41834f8c700c40a776fed1',
      ''
    );
    expect(response).toBe(
      `${process.env.VIDEO_HUB_WEB}${process.env.VIDEO_HUB_BASE_PATH}/a6be7bbe1a8b9787a88121d48c2eca54/videos/59a7209aae41834f8c700c40a776fed1`
    );
  });

  it('Builds getVideoCenterVideoPageUrl with null env', async () => {
    const response = getVideoCenterVideoPageUrl(
      'a6be7bbe1a8b9787a88121d48c2eca54',
      '59a7209aae41834f8c700c40a776fed1',
      null
    );
    expect(response).toBe(
      `${process.env.VIDEO_HUB_WEB}${process.env.VIDEO_HUB_BASE_PATH}/a6be7bbe1a8b9787a88121d48c2eca54/videos/59a7209aae41834f8c700c40a776fed1`
    );
  });

  it('Builds getVideoCenterVideoPageUrl with env', async () => {
    const response = getVideoCenterVideoPageUrl(
      'a6be7bbe1a8b9787a88121d48c2eca54',
      '59a7209aae41834f8c700c40a776fed1',
      'S606'
    );
    expect(response).toBe(
      `${process.env.VIDEO_HUB_WEB}${process.env.VIDEO_HUB_BASE_PATH}/a6be7bbe1a8b9787a88121d48c2eca54/videos/59a7209aae41834f8c700c40a776fed1?env=S606`
    );
  });
  it('Builds getVideoCenterVideoPageShortUrlTag', async () => {
    const response = getVideoCenterVideoPageShortUrlTag(
      'a6be7bbe1a8b9787a88121d48c2eca54',
      '59a7209aae41834f8c700c40a776fed1'
    );
    expect(response).toBe('videocentera6be7bbe1a8b9787a88121d48c2eca54_video59a7209aae41834f8c700c40a776fed1');
  });
  it('Builds getVideoCenterVideoPageShortUrlTag with null centerId', async () => {
    expect(() => getVideoCenterVideoPageShortUrlTag(null, '59a7209aae41834f8c700c40a776fed1')).toThrow(
      VIDEO_CENTER_ID_NULL
    );
  });
  it('Builds getVideoCenterVideoPageShortUrlTag with null videoId', async () => {
    expect(() => getVideoCenterVideoPageShortUrlTag('59a7209aae41834f8c700c40a776fed1', null)).toThrow(VIDEO_ID_NULL);
  });
});
