import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { CarinaNavItem } from '@cvent/planner-event-hubs-model/types';
import { CvestDataSource } from '@dataSources/CvestDataSource';

const LOG = LoggerFactory.create('event-navigation-client');

/**
 * Client class interacting with event navigation service
 */
export class EventNavigationClient extends CvestDataSource {
  constructor() {
    super();
    this.baseURL = `${process.env.EVENTS_NAVIGATION_SERVICE}/v1/`;
  }

  public async getGlobalNavigationItems(): Promise<CarinaNavItem[]> {
    LOG.debug(`getGlobalNavigationItems`);
    return this.get(`global-navigation-items`);
  }
}
