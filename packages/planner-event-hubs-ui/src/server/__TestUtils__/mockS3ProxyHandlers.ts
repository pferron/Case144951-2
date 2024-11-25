import { RESTDataSource } from '@dataSources/RESTDataSource/RESTDataSource';
import { S3ProxyHandler } from '@server/S3ProxyHandler';
import { IncomingHttpHeaders } from 'http';

export class Mage extends S3ProxyHandler {
  public testSetupDataSource(name: string, dataSource: RESTDataSource, headers: IncomingHttpHeaders): void {
    this.setupDataSource(name, dataSource, headers);
  }
}
