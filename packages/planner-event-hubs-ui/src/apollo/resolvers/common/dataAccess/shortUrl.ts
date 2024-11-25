import { BulkShortUrlResponse, ShortUrlRequest, WeeClient } from '@dataSources/weeService/client';
import { ShortUrlByTag, ShortUrlPage } from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';

const LOG = LoggerFactory.create('dataAccess/shortUrls.ts');

export const fetchAndCreateShortUrlByTag = async (
  videoCenterId: string,
  weeClient: WeeClient,
  videoCenterClient: VideoCenterClient
): Promise<Array<ShortUrlByTag>> => {
  const shortUrlByTagList: ShortUrlByTag[] = [];
  // get custom domain or cvent domain
  const hubDataSourceRecord = await videoCenterClient.getHub(videoCenterId);
  let url;
  try {
    url = new URL(hubDataSourceRecord?.url);
  } catch (e) {
    LOG.error(`Failed to parse hub short url for video-center-id${videoCenterId}`, hubDataSourceRecord);
    return shortUrlByTagList;
  }
  const domainName = url.hostname;
  shortUrlByTagList.push({ pageName: ShortUrlPage.Home, shortUrl: url.toString() });
  // create short url tags
  const tagList = createShortUrlTags(videoCenterId, getDomainName(domainName));
  // get short urls
  const shortUrlList = await weeClient.getShortUrlsByTagInBatches(tagList, videoCenterId);
  // map short url response to the tags we need
  const tagsWithoutShortUrl: string[] = [];
  tagList.forEach(tag => {
    const shortUrlForTag = shortUrlList.find(
      shortUrlResponse => shortUrlResponse?.tags.find(responseTag => responseTag === tag)?.length > 0
    )?.shortUrl;

    if (shortUrlForTag) {
      shortUrlByTagList.push({ shortUrl: shortUrlForTag, pageName: pageNameToShortUrlPage(tag.split('#')[0]) });
    } else {
      tagsWithoutShortUrl.push(tag);
    }
  });
  // create short urls for any tags that do not already have a short url
  const shortUrlRequestList: ShortUrlRequest[] = createShortUrlRequestListForTags(
    tagsWithoutShortUrl,
    videoCenterId,
    domainName
  );

  // The endpoint supports upto 100 URL in a batch. We have a max list of 4 short urls, no batching needed.
  const bulkShortUrlResponses: BulkShortUrlResponse[] =
    shortUrlRequestList.length > 0 ? await weeClient.createShortUrlBulk(shortUrlRequestList) : [];

  bulkShortUrlResponses.forEach(bulkShortUrlResponse => {
    if (bulkShortUrlResponse.httpStatus === 201) {
      shortUrlByTagList.push({
        shortUrl: bulkShortUrlResponse.shortUrlResponse.shortUrl,
        pageName: pageNameToShortUrlPage(bulkShortUrlResponse.shortUrlResponse.referenceId)
      });
    } else {
      LOG.error('Failed to create short url', bulkShortUrlResponse);
    }
  });

  return shortUrlByTagList;
};

const createShortUrlTags = (videoCenterId: string, domainName: string): string[] => {
  const tagList = [];
  tagList.push(`${ShortUrlPage.Upcomingevents}#hub#${videoCenterId}#domainName#${domainName}`);
  tagList.push(`${ShortUrlPage.Channels}#hub#${videoCenterId}#domainName#${domainName}`);
  tagList.push(`${ShortUrlPage.Videos}#hub#${videoCenterId}#domainName#${domainName}`);
  tagList.push(`${ShortUrlPage.Registration}#hub#${videoCenterId}#domainName#${domainName}`);
  return tagList;
};

const createShortUrlRequestListForTags = (
  tagList: string[],
  videoCenterId: string,
  domainName: string
): ShortUrlRequest[] => {
  return tagList.map(tag => {
    const pageName = tag.split('#')?.[0];
    return {
      url: `${getDomainName(domainName)}${process.env.VIDEO_HUB_BASE_PATH}/${videoCenterId}/${pageName}`,
      useDomainNameFromUrl: !isCventDomain(domainName),
      tags: [tag],
      referenceId: pageName
    };
  });
};

const getDomainName = (domainName: string): string => {
  return isCventDomain(domainName) ? process.env.VIDEO_HUB_WEB : `https://${domainName}`;
};

const isCventDomain = (domainName: string): boolean => {
  return `https://${domainName}` === process.env.WEE_SERVICE_REDIRECT_DOMAIN;
};

const pageNameToShortUrlPage = (pageName: string): ShortUrlPage => {
  switch (pageName) {
    case 'channels':
      return ShortUrlPage.Channels;
    case 'home':
      return ShortUrlPage.Home;
    case 'upcomingevents':
      return ShortUrlPage.Upcomingevents;
    case 'videos':
      return ShortUrlPage.Videos;
    case 'registration':
      return ShortUrlPage.Registration;
    default:
      throw new Error(`Invalid page name: ${pageName}`);
  }
};
