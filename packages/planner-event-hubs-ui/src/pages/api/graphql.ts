import schemas from '@cvent/planner-event-hubs-model/schema';
import resolvers from '@resolvers/index';
import { PlannerEventHubsApp } from '@server/PlannerEventHubsApp';
import { RemoteCacheOrFallback } from '@server/RemoteCacheOrFallback';
import { initialiseServerCache } from '@server/TokenCache';

export const allSchemas = Object.values(schemas);
export const allResolvers = Object.values(resolvers);

// setting up a cache for storing one-time token to authenticate websocket connection
export const serverCache = initialiseServerCache(false);

export const cacheStore = new RemoteCacheOrFallback();
const plannerEventHubs = new PlannerEventHubsApp(cacheStore);
const apiRoute = plannerEventHubs.route();

export const { schema } = apiRoute;
export const { context } = apiRoute;
export const config = {
  api: {
    bodyParser: false
  }
};
export default apiRoute.handler;
