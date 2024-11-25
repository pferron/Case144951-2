import { NextApiRequest, NextApiResponse } from 'next';
import { AuthClient } from '@cvent/auth-client';

// verifies api key with app_support role
export function appSupportAuthMiddleware(handlerMethod: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    try {
      const authClient = new AuthClient({
        endpoint: process.env.AUTH_SERVICE,
        apiKey: process.env.API_KEY
      });
      const credentials = {
        apiKey: req.headers.authorization.replace(/api_key\s*/i, ''),
        roles: ['app_support']
      };
      await authClient.verifyApiKey(credentials);
    } catch (error) {
      res.status(401).end();
      return;
    }
    // RED
    // eslint-disable-next-line consistent-return
    return handlerMethod(req, res);
  };
}
