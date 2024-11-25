import { RequestOptions } from 'apollo-datasource-rest';
import { HttpClient } from '@utils/HttpClient';
import { ACCOUNT_STUB } from '@utils/constants';
import FormData from 'form-data';
import path from 'path';
import fs from 'fs';

type S3ProxyUploadResponse = {
  location: string;
  relativePath: string;
  version: string;
  IsSecure: boolean;
  lastModified: string;
  lastModifiedDate: string;
  violations: string;
};

/**
 * Client for the S3ProxyService.
 * - https://s3proxy-service-dev.us-east-1.lb.core.cvent.org/sg50/s3proxy/v1/raml/docs/index.html
 */
export class S3ProxyClient extends HttpClient {
  constructor() {
    super();
    this.baseURL = `${process.env.S3_PROXY_SERVICE_BASE_URL}/v1`;
  }

  public willSendRequest(request: RequestOptions): void {
    request.headers.set('x-skip-cache', '1');
    request.headers.set('Authorization', `API_KEY ${process.env.API_KEY}`);
    this.setLoggingHeaders(request);
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected async didReceiveResponse<TResult = any>(response: Response, _request: Request): Promise<TResult> {
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return this.parseBody(response) as any as Promise<TResult>;
    }
    throw await this.errorFromResponse(response);
  }

  public async uploadTestImage(filePath: string): Promise<S3ProxyUploadResponse> {
    const params = new URLSearchParams({
      filePath,
      environment: process.env.ENVIRONMENT_NAME
    });
    const formData = new FormData();
    const imagePath = path.join(__dirname, '..', 'resources', 'images', 'lessThan2Mb.jpeg');
    formData.append('file', fs.readFileSync(imagePath), {
      filename: 'imageName.jpeg'
    });
    return this.post(`/upload/${ACCOUNT_STUB}?${params.toString()}`, formData);
  }
}
