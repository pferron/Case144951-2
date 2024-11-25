import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { NextApiRequest, NextApiResponse } from 'next';
import { authMiddleware } from '@utils/authMiddleware';
import { cacheStore } from '@pages/api/graphql';
import { stringify } from 'csv-stringify/sync';
import { BASE_TEXT, ERROR_MESSAGE, TEXT_ID, TEXT_TYPE, YOUR_TEXT } from '@utils/constants';
import { FileImportClient } from '@dataSources/fileImportService/client';
import { FileImportSummaryInput } from '@dataSources/fileImportService/types';
import { getSkippedRows } from '@utils/skippedRowsUtil';

const LOG = LoggerFactory.create('translations-skipped-records');

const handler = async (req: NextApiRequest, res: NextApiResponse, auth): Promise<void> => {
  LOG.debug(`Running skipped record export with ${req.query}`);
  if (req.method !== 'GET') {
    LOG.info('Did not receive valid request method');
    res.status(400).end();
  }
  const { hubId, importId, environment, locale } = req.query;
  const client = new FileImportClient();
  const context = {
    auth,
    dataSources: {},
    headers: req.headers
  };
  try {
    client.initialize({ context, cache: cacheStore.getCache() });
    const input: FileImportSummaryInput = {
      hubId: hubId as string,
      importId: importId as string,
      locale: locale as string,
      environment: environment as string
    };
    const importRowErrors = await getSkippedRows(client, input);
    const csv = stringify(importRowErrors, {
      columns: [
        { key: 'id', header: TEXT_ID },
        { key: 'type', header: TEXT_TYPE },
        { key: 'defaultValue', header: BASE_TEXT },
        { key: 'translatedValue', header: YOUR_TEXT },
        { key: 'errorMessage', header: ERROR_MESSAGE }
      ],
      header: true
    });
    res
      .setHeader('content-disposition', `attachment; filename=${hubId}-${importId}-${locale}-skipped-records.csv`)
      .setHeader('Content-Type', 'text/csv')
      .status(200)
      .send(csv);
  } catch (e) {
    LOG.error('Skipped rows export failed', e);
    res.status(500).end();
  }
};

export default authMiddleware(handler);
