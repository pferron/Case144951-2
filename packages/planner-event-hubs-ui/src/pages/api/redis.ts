import { NextApiRequest, NextApiResponse } from 'next';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { RedisCache } from '@server/cache/RedisCache';
import { appSupportAuthMiddleware } from '@utils/appSupportAuthMiddleware';

const LOG = LoggerFactory.create('redis');

const redis = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const key = req.query.key as string;
  const keys = req.query.keys as string;
  const page = req.query.page as string;

  if (key && (req.method === 'GET' || req.method === 'DELETE')) {
    LOG.info('Looking up redis key', key);
    const redisCache = new RedisCache();
    const response = await redisCache.get(key);
    if (req.method === 'DELETE') {
      LOG.info('Deleting redis key', key);
      await redisCache.delete(key);
    }
    res.send({ key, value: response });
    res.status(200).end();
    return;
  }
  if (keys && req.method === 'GET') {
    LOG.info('Looking up redis keys with pattern', keys);
    const redisClient = await RedisCache.initRedis();
    const response = await redisClient.call('SCAN', page || 0, 'MATCH', keys);
    res.send({ pattern: keys, currentPage: page || 0, nextPage: response[0], keys: response[1] });
    res.status(200).end();
    return;
  }
  LOG.info('Did not receive valid instruction, returning 400');
  res.status(400).end();
};

export default appSupportAuthMiddleware(redis);
