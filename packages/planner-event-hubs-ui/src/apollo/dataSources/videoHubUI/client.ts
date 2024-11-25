import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CvestDataSource } from '@dataSources/CvestDataSource';

const LOG = LoggerFactory.create('video-hub-ui-api');

export class VideoHubUIClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.VIDEO_HUB_WEB}/eventsplus/api`;
  }

  deleteToken = async (hubId: string): Promise<string> => {
    LOG.debug('deleteToken(hubId)', hubId);
    return this.delete(`/token?hubId=${hubId}`, undefined, {
      headers: { authorization: `API_KEY ${process.env.API_KEY}` }
    });
  };
}
