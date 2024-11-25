import { RequestBuilder, httpLogPageLoadId } from '@cvent/nucleus-networking/lib';
import { v4 } from 'uuid';
import { getApiRouteBasePath, getEnvironmentForImage } from '@utils/appConfig';
import { fetchDataWithOptions } from '@utils/apiUtils';
// import { getBasePath } from '@cvent/nx/utils/getBasePath';
import { getBasePath } from '@cvent/nextjs/utils/getBasePath';
import { queryStringFromObject } from '@utils/redirect';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { ApolloError } from '@apollo/client';

const LOG = LoggerFactory.create('imageUtils');

export const uploadFileToS3 = async (
  file: Blob,
  returnUrl: string,
  entityId: string,
  entityType: string
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const HttpLogPageLoadId = httpLogPageLoadId;
  const HttpLogRequestId = v4();

  const request = new RequestBuilder({
    headers: {
      HttpLogPageLoadId,
      HttpLogRequestId
    }
  })
    .url(`${getApiRouteBasePath()}/api/uploadImage`)
    .post()
    .withCookies()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .body(formData)
    .query('entityId', entityId)
    .query('entityType', entityType || '')
    .query('environment', getEnvironmentForImage())
    .build();
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const { location } = await fetchDataWithOptions(request);
    return location;
  } catch (err) {
    LOG.error(`Error while uploading file for [${entityId}] : `, err);
    const queryStringObject = {
      pageLoadId: HttpLogPageLoadId,
      requestId: HttpLogRequestId,
      date: new Date(Date.now()).getTime(),
      returnUrl
    };
    window.location.href = `${getBasePath()}/error?${queryStringFromObject(queryStringObject)}`;
  }
  return null;
};

export const uploadFileToPresignedUrl = async (file, url: string): Promise<void> => {
  const uploadRequest = new RequestBuilder({ url })
    .put()
    .body(await file.arrayBuffer())
    .build();
  // TODO figure out how to use a normal fetch that doesn't come with this junk - avoid RequestBuilder?
  uploadRequest.headers.delete('httplogpageloadid');
  uploadRequest.headers.delete('httplogrequestid');

  LOG.info('Uploading file to pre-signed url', { url: uploadRequest.url, file });

  await fetch(uploadRequest)
    .then(response => {
      if (response.ok) {
        LOG.info('Upload to pre-signed url completed successfully.');
      }
    })
    .catch(reason => {
      LOG.error('Upload to pre-signed url failed because', reason);
      // Since this upload directly to S3, presenting page IDs to customer won't help
      throw new ApolloError({ errorMessage: reason });
    });
};
