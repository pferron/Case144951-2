import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CvestDataSource } from '@dataSources/CvestDataSource';
import { getEnvironment } from '@resolvers/common/utils/authMetadataUtils';
import { setStagingForLowerEnvs } from '@utils/environmentUtil';
import { RequestOptions } from '../RESTDataSource/RESTDataSource';

const LOG = LoggerFactory.create('image-lookup-client');

/**
 * Client for the ImageLookupService.
 */
export class ImageLookupClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.IMAGE_LOOKUP_SERVICE}/v1`;
  }

  public willSendRequest(request: RequestOptions): void {
    this.setStandardHeaders(request);
  }

  public setStandardHeaders(request: RequestOptions): void {
    request.headers.set('x-skip-cache', '1');
    request.headers.set('Authorization', `API_KEY ${process.env.API_KEY}`);
    this.setLoggingHeaders(request);
  }

  public lookup(masterImageUrls: string[]): Promise<Record<string, string | number>> {
    LOG.debug(`Looking up public-friendly URL for ${masterImageUrls}`);
    const body = masterImageUrls.map(url => {
      return { url };
    });

    let serviceUrl = '/assets/lookup';
    const environment = setStagingForLowerEnvs(this.context.environment || getEnvironment(this.context.auth));
    if (environment) {
      const params = new URLSearchParams({ environment });
      serviceUrl = `${serviceUrl}?${params.toString()}`;
    }

    return this.post(serviceUrl, body);
  }
}
