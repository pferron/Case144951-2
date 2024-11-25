import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CvestDataSource } from '@dataSources/CvestDataSource';
import { getAccessToken, getAccountMappingId, getEnvironment } from '@resolvers/common/utils/authMetadataUtils';
import { URLSearchParams } from 'apollo-server-env';
import { ScanStatusResponse } from '@cvent/planner-event-hubs-model/types';
import { S3PreSignedResponse } from '@utils/types';
import { setStagingForLowerEnvs } from '@utils/environmentUtil';
import { ApolloError } from 'apollo-server-errors';
import { RequestOptions } from '../RESTDataSource/RESTDataSource';

const LOG = LoggerFactory.create('s3proxy-client');

/**
 * Client for the S3ProxyService.
 * - https://s3proxy-service-dev.us-east-1.lb.core.cvent.org/sg50/s3proxy/v1/raml/docs/index.html
 */
export class S3ProxyClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.S3_PROXY_SERVICE_BASE_URL}/v1`;
  }

  public willSendRequest(request: RequestOptions): void {
    this.setStandardHeaders(request);
    // ILS depends on lower-case file paths for images in order to return properly optimized URLs
    // https://cvent.slack.com/archives/C010RTLSS0L/p1665761736853559?thread_ts=1665586510.138089&cid=C010RTLSS0L
    if (request.params.get('filePath')) {
      const lowerFilePath = request.params.get('filePath').toLowerCase();
      request.params.set('filePath', lowerFilePath);
    }
    if (request.params.get('fullFilePath')) {
      const lowerFilePath = request.params.get('fullFilePath').toLowerCase();
      request.params.set('fullFilePath', lowerFilePath);
    }
  }

  public setStandardHeaders(request: RequestOptions): void {
    request.headers.set('x-skip-cache', '1');
    request.headers.set('Authorization', `API_KEY ${process.env.API_KEY}`);
    this.setLoggingHeaders(request);
  }

  /**
   * Delete the file at the given filePath from the s3 bucket via s3proxy-service.
   *
   * It is up to the caller to determine whether to await the response or not.
   *
   * @param filePath Effectively the S3 key where the file is stored
   * @returns Directly returns the promise without awaiting the response
   */
  public async deleteFile(filePath: string): Promise<void> {
    LOG.info(`Deleting file from s3-proxy: ${filePath}`);
    const accountMappingId = getAccountMappingId(this.context.auth);
    const params = new URLSearchParams({
      filePath,
      environment: this.context.environment || getEnvironment(this.context.auth)
    });
    return this.post(`/delete/${accountMappingId}?${params.toString()}`, {})
      .catch(reason => {
        LOG.error(`failed to delete file from s3: ${filePath} because `, reason);
      })
      .then(() => {
        LOG.info(`deleted file from s3: ${filePath}`);
      });
  }

  /**
   * Move a file from one S3 location to another via s3proxy-service.
   *
   * @param fromPath The current s3 path of the file
   * @param toPath The desired s3 path of the file
   *
   * @returns A URL to the file at its new location
   */
  public async moveFile(fromPath: string, toPath: string): Promise<string> {
    const accountMappingId = getAccountMappingId(this.context.auth);
    if (fromPath === toPath) {
      LOG.info(
        `Ignoring request to move file from ${fromPath} to ${toPath} for ${accountMappingId} because the source and destination are the same`
      );
      return toPath;
    }
    LOG.info(`Moving file from ${fromPath} to ${toPath} for ${accountMappingId}`);
    const params = new URLSearchParams();
    params.set('accountType', 'CVENT_CORE');
    params.set('fileFrom', fromPath);
    params.set('fileTo', toPath);
    params.set('environment', setStagingForLowerEnvs(getEnvironment(this.context.auth)));
    return this.post(`/move/${accountMappingId}?${params.toString()}`).catch(reason => {
      LOG.error(`Failed to move file from ${fromPath} to ${toPath} for ${accountMappingId} because `, reason);
      throw new ApolloError(`Failed to move file from ${fromPath} to ${toPath} for ${accountMappingId}`, '500');
    });
  }

  /**
   * Checks the virus scan status of the uploaded file
   *
   * @param fileId File id
   * @param filePath Effectively the S3 key where the file is stored
   * @returns The status of the virus scan
   */
  public async checkScanStatus(fileId: string, filePath: string): Promise<ScanStatusResponse> {
    LOG.info(`Checking VS status from s3-proxy: fileId: ${fileId} filePath: ${filePath}`);
    return this.get('/scan/status', {
      fileId,
      filePath,
      environment: this.context.environment || getEnvironment(this.context.auth)
    });
  }

  /**
   * Generates Presigned URL, which can be used to upload file to s3.
   *
   * @param fullFilePath Full file path of s3 where file needs to be uploaded
   * @param callBackUrl Callback Url
   * @returns Pre-signed Url
   */
  public async generatePreSignedUrl(fullFilePath: string, callBackUrl: string): Promise<S3PreSignedResponse> {
    LOG.info(`Generating Pre-signed Url : fullFilePath: ${fullFilePath} callBackUrl: ${callBackUrl}`);
    const accountMappingId = getAccountMappingId(this.context.auth);
    const params = new URLSearchParams({
      environment: this.context.environment || getEnvironment(this.context.auth),
      fullFilePath,
      callBackUrl,
      callBackBearerToken: getAccessToken(this.context.auth)
    });
    return this.post(`/link/upload/${accountMappingId}?${params.toString()}`, {}).catch(reason => {
      LOG.error(`failed to generate pre-signed url : fullFilePath: ${fullFilePath} because `, reason);
    });
  }
}
