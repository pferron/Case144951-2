import { VideoHubUIClient } from '@dataSources/videoHubUI/client';

let dataSource: VideoHubUIClient;
let hubId: string;

beforeEach(() => {
  dataSource = new VideoHubUIClient();
  // Manually set context on the data source since it is not attached to an ApolloServer instance
  dataSource.context = {};
  hubId = '82314155-00e0-4d05-80c8-48726411e0b6';
});

describe('Delete Public token for hub', () => {
  beforeEach(async () => {
    dataSource.delete = jest.fn().mockImplementation(async () => null);
  });

  describe('deleteToken(hubId)', () => {
    it('sends DELETE /api/token', async () => {
      await dataSource.deleteToken(hubId);
      expect(dataSource.delete).toHaveBeenCalledWith(`/token?hubId=${hubId}`, undefined, {
        headers: { authorization: `API_KEY ${process.env.API_KEY}` }
      });
    });
  });
});
