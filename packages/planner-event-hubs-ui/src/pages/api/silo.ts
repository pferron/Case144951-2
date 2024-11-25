import { NextApiRequest, NextApiResponse } from 'next';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('siloLogin');

/**
 * This end-point handles login calls from lower environments
 *
 * The URI is case-sensitive.
 *
 * Required query params
 * - hubId
 * - target_url
 * - mode
 *
 *
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
const silo = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const targetUrl = req.body.target_url as string;
  const mode = req.body.mode as string;
  const accessToken = req.body.access_token as string;
  LOG.info('processing login for ', req.method, targetUrl, mode);
  if (req.method !== 'POST' || mode !== 'core_redirect') {
    res.status(404).end();
  } else {
    LOG.info('loading handler for ', req.method, targetUrl, mode);
    res.setHeader('Location', targetUrl);
    res.status(303);
    res.setHeader('set-cookie', `cvent-auth=${accessToken}; Path=/; Domain=app.t2.cvent.com`).end();
  }
};

export default silo;
