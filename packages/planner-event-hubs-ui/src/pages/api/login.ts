import { NextApiRequest, NextApiResponse } from 'next';
import { devLoginApiRoute } from '@cvent/nextjs/server';

const apiRoute = devLoginApiRoute();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async (req: NextApiRequest, res: NextApiResponse): Promise<any> => {
  if (process.env.DEV_LOGIN === 'true') {
    return apiRoute(req, res);
  }
  return res.status(404).end();
};
