import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CvestDataSource } from '@dataSources/CvestDataSource';

const LOG = LoggerFactory.create('weeService/client.ts');

export interface ShortUrlResponse {
  url: string;
  domainName: string;
  hash: string;
  shortUrl: string;
  referenceId: string;
  tags: [string];
}

export interface BulkShortUrlResponse {
  shortUrlResponse: ShortUrlResponse;
  httpStatus: number;
}

export interface BulkShortUrlByTagResponse {
  urls: Array<ShortUrlResponse>;
  totalCount: number;
  offset: number;
  limit: number;
}
export interface ShortUrlRequest {
  url: string;
  hash?: string;
  useDomainNameFromUrl: boolean;
  referenceId?: string;
  tags: [string];
}
export class WeeClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.WEE_SERVICE}/v1/`;
  }

  private GET_URL_BY_TAG_BATCH_SIZE = 50;

  createShortUrl = async (url: string, tags: string[], useDomainNameFromUrl = false): Promise<ShortUrlResponse> => {
    return this.post('urls', { url, tags, useDomainNameFromUrl });
  };

  createShortUrlBulk = async (shortUrlRequestList: ShortUrlRequest[]): Promise<Array<BulkShortUrlResponse>> => {
    return this.post('urls/bulk', shortUrlRequestList);
  };

  getShortUrlsByTag = async (tags: string[], limit: number, offset = 1): Promise<BulkShortUrlByTagResponse> => {
    return this.get('urls', { tags: tags.join(','), offset, limit });
  };

  getShortUrlsByTagInBatches = async (tags: string[], centerId: string): Promise<Array<ShortUrlResponse>> => {
    let shortUrlResponseList: Array<ShortUrlResponse> = [];
    try {
      const response = await this.getShortUrlsByTag(tags, this.GET_URL_BY_TAG_BATCH_SIZE);
      shortUrlResponseList = shortUrlResponseList.concat(response?.urls || []);
      if (response.limit + response.offset - 1 < response.totalCount) {
        let offset = response.offset + response.limit;
        const responsePromiseList: Array<Promise<BulkShortUrlByTagResponse>> = [];
        while (offset - 1 < response.totalCount) {
          responsePromiseList.push(this.getShortUrlsByTag(tags, this.GET_URL_BY_TAG_BATCH_SIZE, offset));
          offset += this.GET_URL_BY_TAG_BATCH_SIZE;
        }

        const resolvedPromiseResponse: BulkShortUrlByTagResponse[] = await Promise.all(responsePromiseList);
        resolvedPromiseResponse.forEach(res => {
          shortUrlResponseList = shortUrlResponseList.concat(res.urls);
        });
      }
    } catch (e) {
      LOG.warn(`Failed to get URLs by tag. Will now attempt to create short urls with tag for center ${centerId}`, e);
    }
    return shortUrlResponseList;
  };
}
