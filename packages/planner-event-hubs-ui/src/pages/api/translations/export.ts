import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@utils/authMiddleware';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { cacheStore } from '@pages/api/graphql';
import { stringify } from 'csv-stringify/sync';
import { BASE_TEXT, TEXT_ID, TEXT_TYPE, YOUR_TEXT } from '@utils/constants';

const LOG = LoggerFactory.create('translations-export');

const handler = async (req: NextApiRequest, res: NextApiResponse, auth): Promise<void> => {
  LOG.debug(`Running translation export with ${req.query}`);
  const { hubId, locale, translations, type, translationText, sort } = req.query;
  const client = new VideoCenterClient();
  const context = {
    auth,
    dataSources: {},
    headers: req.headers
  };
  client.initialize({ context, cache: cacheStore.getCache() });
  let translationData = [];
  try {
    let response = await client.getTranslations(
      hubId as string,
      locale,
      translations,
      type,
      translationText,
      200,
      sort,
      undefined
    );
    translationData = translationData.concat(response.data);
    while (response.paging.nextToken != null) {
      // eslint-disable-next-line no-await-in-loop
      response = await client.getTranslations(
        hubId as string,
        locale,
        translations,
        type,
        translationText,
        200,
        sort,
        response.paging.nextToken
      );
      translationData = translationData.concat(response.data);
    }
  } catch (e) {
    return res.status(e.code).send(e.response.message);
  }
  const csv = stringify(translationData, {
    columns: [
      { key: 'id', header: TEXT_ID },
      { key: 'type', header: TEXT_TYPE },
      { key: 'defaultValue', header: BASE_TEXT },
      { key: 'translatedValue', header: YOUR_TEXT }
    ],
    header: true
  });

  return res
    .setHeader('content-disposition', `attachment; filename=${hubId}-${locale}.csv`)
    .setHeader('Content-Type', 'text/csv')
    .status(200)
    .send(csv);
};

export default authMiddleware(handler);
