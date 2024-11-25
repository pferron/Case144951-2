import { S3ProxyHandler } from '@server/S3ProxyHandler';
import { NextApiRequest, NextApiResponse } from 'next';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { AuthClient, GrantedAccessToken } from '@cvent/auth-client';
import { S3ProxyCallbackPayload } from '@cvent/planner-event-hubs-model/types';
import { TempImageHandler } from '@server/S3ProxyHandler/TempImageHandler';

const LOG = LoggerFactory.create('s3ProxyUploadCallback');

// Register new handlers by updating the below map.
S3ProxyHandler.handlers = { Temp: TempImageHandler };

/**
 * This end-point handles callbacks from S3Proxy (https://wiki.cvent.com/x/Fd0JEg).
 * Refer to https://nx.docs.cvent.org/docs/next_js/api_routes for background.
 *
 * The URI is case-sensitive.
 *
 * Required query params
 * - centerId
 * - entityType
 * - entityId
 * Optional query params
 * - environment (only for environments other than prod)
 *
 * Additionally expects a request body like
 *   {
 *     "fileId": "d6b2fdb3f1523c9ffa73a33bfa57c42b",
 *     "fullFilePath": "myfiledirectory/videos/myvideo.mov",
 *     "location": "https://s3.amazonaws.com/video-sync-upload-bucket-sg50/dev/myfiledirectory/videos/myvideo.mov",
 *     "status": "SCAN_SUCCESS",
 *     "failureReason": ""
 *   }
 *
 * @param req NextApiRequest
 * @param res NextApiResponse
 */
const s3ProxyUploadCallback = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const entityType = req.query.entityType as string;
  const centerId = req.query.centerId as string;
  const entityId = req.query.entityId as string;
  const environment = req.query.environment as string;
  LOG.info('processing callback for ', req.method, centerId, entityType, entityId);

  const authClient = new AuthClient({
    endpoint: process.env.AUTH_SERVICE,
    apiKey: process.env.API_KEY
  });
  let grantedAccessToken = await S3ProxyHandler.verifyAuthorization(req.headers.authorization, authClient);
  if (!grantedAccessToken || req.method !== 'POST') {
    LOG.info('terminating early for ', req.method, centerId, entityType, entityId);
    res.status(404).end();
  }
  grantedAccessToken = grantedAccessToken as GrantedAccessToken;
  try {
    LOG.info('loading handler for ', req.method, centerId, entityType, entityId);
    const handler = S3ProxyHandler.newEntityHandler(grantedAccessToken, entityType, centerId, entityId, environment);

    await handler.handleS3ProxyCallback(req.headers, req.body as S3ProxyCallbackPayload);

    LOG.info('completed handling for', req.method, centerId, entityType, entityId);
    res.status(204).end();
  } catch (error) {
    LOG.error(
      `returning ${error.statusCode || error.code} due to error handling s3-proxy callback for `,
      req.method,
      centerId,
      entityType,
      entityId,
      error
    );
    res.status(error.statusCode || error.code).end();
  }
};

export default s3ProxyUploadCallback;
