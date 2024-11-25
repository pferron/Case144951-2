import { getAccessTokenFromAuthCookie } from '@cvent/nextjs/auth';
import { verifyAccessTokenHelper } from '@utils/authUtils';
import { NextApiRequest, NextApiResponse } from 'next';

export function authMiddleware(handlerMethod: (req: NextApiRequest, res: NextApiResponse, auth?) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    let auth;
    try {
      const accessToken = getAccessTokenFromAuthCookie(req);
      auth = await verifyAccessTokenHelper(accessToken);
    } catch (error) {
      res.status(401).end();
      return;
    }
    // RED
    // eslint-disable-next-line consistent-return
    return handlerMethod(req, res, auth);
  };
}
