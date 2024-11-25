// Temporarily brought over from planner-video-solution
// This is here to simplify the migration process and postpone SUL changes until the main app migration is complete
// Before this can be removed, SUL needs updated to support fetching videos without proxying calls to video-hub-ui
// Possible solutions
// 1. Add getVideos graph to planner-video-solution and remove video-hubs proxy from SUL and remove this file
// 1. Add logic to SUL, maybe update component props to accept a 'clientName'
import { NextApiRequest, NextApiResponse } from 'next';
import type { IncomingHttpHeaders } from 'http';
import { httpLogPageLoadId } from '@cvent/nucleus-networking/lib';
// RED
// eslint-disable-next-line no-restricted-imports
import { RequestBuilder } from '@cvent/nucleus-networking-node';
import fetchWithTimeout from '@tools/fetchWithTimeout';
import { v4 } from 'uuid';

// removing host from headers to get rid of ssl error - https://cvent.slack.com/archives/CQTU2PT1N/p1650902682655619
const updateRequestHeaders = (headers: IncomingHttpHeaders = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { host, ...filteredHeaders } = headers;
  return {
    ...filteredHeaders,
    HttpLogPageLoadId: httpLogPageLoadId,
    HttpLogRequestId: v4()
  };
};

// Set up a proxy to video hubs graph to get around CORS and cookie domain restrictions and other fun things
// not using http proxy middleware because requests were hanging
const videoHubsGraph = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const graphUrl = `${process.env.EVENT_HUBS_INTERNAL}/api/graphql`;

  const requestBuilder = new RequestBuilder({}).url(graphUrl).post();
  // Add Authorization header with bearer from cookie
  const token = req.cookies[process.env.AUTH_COOKIE_NAME];
  const request = requestBuilder
    .json(req.body)
    .auth(`BEARER ${token}`)
    .headers(updateRequestHeaders(req.headers))
    .build();
  const result = await fetchWithTimeout(request);

  res.status(result.status);
  if (result.status === 200 && result.body) {
    res.json(result.body);
  } else {
    res.end();
  }
};

export default videoHubsGraph;
