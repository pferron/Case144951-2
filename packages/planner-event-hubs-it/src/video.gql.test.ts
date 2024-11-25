// FIREBALL
/* eslint-disable jest/no-standalone-expect */
import { connectToApiAsPlanner, authOptions, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { videoDataSet } from '@fixtures/videoData';
import { getVideos } from '@helpers/videoFunctions';
import { skipItIfProdEnvironment } from '@utils/commonUtils';

let client = null;
let clientWithIncorrectRole = null;

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientWithIncorrectRole = await connectToApiAsPlanner(unauthOptions);
}, 10000);

describe('Video GQL IT - get videos', () => {
  it('Get videos should return list of videos for catalogs.channel.status filter', async () => {
    const videoResponse = await getVideos(client, { filter: "catalogs.channel.status eq 'INACTIVE'" });
    expect(videoResponse).toBeTruthy();
    expect(videoResponse.paging.currentToken).toBeTruthy();
    const videos = videoResponse.data;
    expect(videos.length).toBe(videoResponse.paging.totalCount);
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].id).toBeTruthy();
      expect(videos[i].title).toBeTruthy();
    }
  });

  skipItIfProdEnvironment()('Get videos should fail due to unauthorization', async () => {
    await expect(async () => getVideos(clientWithIncorrectRole, {})).rejects.toThrow('403: Forbidden');
  });

  skipItIfProdEnvironment()(
    'Get videos should fail as catalogs.channel.id provided wrong channel filter field',
    async () => {
      await expect(async () => getVideos(client, { filter: "catalogs.channel.id eq 'INACTIVE'" })).rejects.toThrow(
        'Bad Request'
      );
    }
  );

  skipItIfProdEnvironment()('Get videos should fail as catalogs.channel.id provided wrong operator', async () => {
    await expect(async () =>
      getVideos(client, { filter: "catalogs.channel.id contains 'ba00971e-b712-11ec-9847-17ee0c8c20bc'" })
    ).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()('Get videos should fail as catalogs.channel.status provided wrong operator', async () => {
    await expect(async () => getVideos(client, { filter: "catalogs.channel.status le 'Active'" })).rejects.toThrow(
      'Bad Request'
    );
  });

  skipItIfProdEnvironment()('Get videos should fail as catalogs.channel.status provided wrong value', async () => {
    await expect(async () =>
      getVideos(client, { filter: "catalogs.channel.status ne 'ActiveChannel'" })
    ).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()('Get videos should fail as status provided wrong value', async () => {
    await expect(async () => getVideos(client, { filter: "status ne 'Active'" })).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()('Get videos should fail as video status provided wrong operator', async () => {
    await expect(async () => getVideos(client, { filter: "status ge 'Available'" })).rejects.toThrow('Bad Request');
  });

  it('Get videos should return list of videos with Available status', async () => {
    const videosData = await getVideos(client, { filter: "status eq 'Available'" });
    expect(videosData).toBeTruthy();
    expect(videosData.paging).toBeTruthy();
    const videos = videosData.data;
    expect(videos.length).toBe(videosData.paging.totalCount > 100 ? 100 : videosData.paging.totalCount);
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].status).toBe('Available');
      expect(videos[i].id).toBeTruthy();
      expect(videos[i].created).toBeTruthy();
      expect(videos[i].lastModified).toBeTruthy();
    }
  });

  it('Get videos should return list of videos without any filter', async () => {
    const videosData = await getVideos(client, null);
    expect(videosData).toBeTruthy();
    expect(videosData.paging).toBeTruthy();
    const videos = videosData.data;
    expect(videos.length).toBe(videosData.paging.totalCount > 100 ? 100 : videosData.paging.totalCount);
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].id).toBeTruthy();
      expect(videos[i].created).toBeTruthy();
      expect(videos[i].lastModified).toBeTruthy();
    }
  });

  skipItIfProdEnvironment()('Get videos should fail as filter on title provided wrong operator', async () => {
    await expect(async () => getVideos(client, { filter: "title ge 'Available'" })).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()(
    'Get videos should fail as string wrong value provided in for id filter field',
    async () => {
      await expect(async () => getVideos(client, { filter: "id ne 'Available'" })).rejects.toThrow('Bad Request');
    }
  );

  skipItIfProdEnvironment()('Get videos should fail as string wrong operator for filter on id field', async () => {
    await expect(async () =>
      getVideos(client, { filter: "id gt 'fa05c0a2-b710-11ec-9cf6-4fcef4e44b4e'" })
    ).rejects.toThrow('Bad Request');
  });

  it('Get videos should return video filtered by video id', async () => {
    const videoResponse = await getVideos(client, { filter: `id eq '${videoDataSet.videoId}'` });
    expect(videoResponse).toBeTruthy();
    expect(videoResponse.paging).toBeTruthy();
    const videos = videoResponse.data;
    expect(videos.length).toBe(1);
    expect(videos[0].id).toBe(videoDataSet.videoId);
  });

  skipItIfProdEnvironment()('Get videos should fail as string wrong operator for filter on created field', async () => {
    await expect(async () => getVideos(client, { filter: "created contains '2015-03-08'" })).rejects.toThrow(
      'Bad Request'
    );
  });

  skipItIfProdEnvironment()(
    'Get videos should fail as string wrong operator for filter on lastModified field',
    async () => {
      await expect(async () => getVideos(client, { filter: "lastModified contains '2015-03-08'" })).rejects.toThrow(
        'Bad Request'
      );
    }
  );

  it('Get videos should return list of videos created on date provided', async () => {
    const videosData = await getVideos(client, { filter: "created eq '2015-03-08'" });
    expect(videosData).toBeTruthy();
    expect(videosData.paging).toBeTruthy();
    const videos = videosData.data;
    expect(videos.length).toBe(videosData.paging.totalCount);
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].created).toMatch('2015-03-08');
      expect(videos[i].id).toBeTruthy();
      expect(videos[i].created).toBeTruthy();
      expect(videos[i].lastModified).toBeTruthy();
    }
  });

  it('Get videos should return list of videos last-modified on date provided', async () => {
    const videosData = await getVideos(client, { filter: "lastModified eq '2015-10-13'" });
    expect(videosData).toBeTruthy();
    expect(videosData.paging).toBeTruthy();
    const videos = videosData.data;
    expect(videos.length).toBe(videosData.paging.totalCount);
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].lastModified).toMatch('2015-10-13');
      expect(videos[i].id).toBeTruthy();
      expect(videos[i].created).toBeTruthy();
      expect(videos[i].lastModified).toBeTruthy();
    }
  });
  it('Get videos should return list of videos having records equal to or less than limit(4)', async () => {
    const videosData = await getVideos(client, {
      limit: 4
    });
    expect(videosData).toBeTruthy();
    expect(videosData.paging).toBeTruthy();
    const videos = videosData.data;
    expect(videos.length).toBeLessThanOrEqual(4);
    for (let i = 0; i < videos.length; i++) {
      expect(videos[i].id).toBeTruthy();
      expect(videos[i].created).toBeTruthy();
      expect(videos[i].lastModified).toBeTruthy();
    }
  });

  skipItIfProdEnvironment()('Get videos should fail as limit is more than 200', async () => {
    await expect(async () => getVideos(client, { limit: 201 })).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()('Get videos should fail as sort applied on wrong attribute', async () => {
    await expect(async () => getVideos(client, { sort: 'status:ASC' })).rejects.toThrow('Bad Request');
  });

  skipItIfProdEnvironment()('Get videos should fail as sort provided wrong order', async () => {
    await expect(async () => getVideos(client, { sort: 'title:Ascending' })).rejects.toThrow('Bad Request');
  });
});
