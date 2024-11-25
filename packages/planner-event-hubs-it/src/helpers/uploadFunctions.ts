import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
  PreSignedInput,
  PreSignedResponse,
  ScanStatusInput,
  S3ProxyCallbackPayload
} from '@cvent/planner-event-hubs-model/types';
import { S3_SCAN_STATUS, S3_GENERATE_PRESIGNED_URL } from '@cvent/planner-event-hubs-model/operations/upload';
// FIREBALL
// eslint-disable-next-line no-restricted-imports
import { fetchWithOptions, RequestBuilder } from '@cvent/nucleus-networking-node';
import fs from 'fs';
import path from 'path';
import { Response } from '@cvent/nucleus-networking-node/externals';
import { authOptions } from '@helpers/connectToApiAsPlanner';
import { generateAccessToken } from '@cvent/nextjs/server/routes/devLoginApiRoute';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('uploadFunctions');

export const getCheckScanStatus = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: ScanStatusInput
): Promise<S3ProxyCallbackPayload> => {
  const response = await client.query({
    query: S3_SCAN_STATUS,
    variables: {
      input
    }
  });
  return response.data.checkScanStatus;
};

export const getPresignedUrl = async (
  client: ApolloClient<NormalizedCacheObject>,
  input: PreSignedInput
): Promise<PreSignedResponse> => {
  const response = await client.query({
    query: S3_GENERATE_PRESIGNED_URL,
    variables: {
      input
    }
  });
  return response.data.generatePreSignedUrl;
};

export async function fileUpload(url: string): Promise<number> {
  const lessThan5Mb = path.join(__dirname, '..', 'resources', 'images', 'lessThan2Mb.jpeg');
  const file = fs.readFileSync(lessThan5Mb);
  const req = new RequestBuilder({
    url
  })
    .put()
    .header('Content-Type', 'image/jpeg')
    .body(file)
    .build();
  const fetch = fetchWithOptions();
  try {
    const response = await fetch(req);
    return response.status;
  } catch (e) {
    LOG.error('File upload failed.', e);
    return 1;
  }
}

export async function cropImage(imageUrl: string, entityId: string, accountStub: string): Promise<Response> {
  const { accessToken } = await generateAccessToken(
    process.env.AUTH_SERVICE,
    process.env.NORMANDY_API_KEY,
    authOptions
  );
  // IPS hogan config in CI points to sandbox/s660; sandbox domain has no dns entry and development/s660 returns 404s
  const url = process.env.IMAGE_PROCESSING_SERVICE.replace('sandbox', 'development').replace('s660', 'T2');
  // The API seems like it should be url/process?query but in testing, requests to url/process return an invalid domain, while requests omitting /process work as expected
  const req = new RequestBuilder({
    url: `${url}?environment=${process.env.ENVIRONMENT_NAME}`
  })
    .post()
    .header('Content-Type', 'application/json')
    .header('Authorization', `bearer ${accessToken}`)
    .body(
      JSON.stringify({
        transformations: {
          crop: {
            width: 100,
            height: 100,
            left: 0,
            top: 0
          },
          resize: {
            width: 100,
            height: 100
          }
        },
        imageUrl,
        entityId,
        accountStub
      })
    )
    .build();
  const fetch = fetchWithOptions();
  try {
    const resp = await fetch(req);
    LOG.info('cropImage resp', resp);
    return resp;
  } catch (e) {
    throw new Error(`Crop Image failed. ${e}`);
  }
}
