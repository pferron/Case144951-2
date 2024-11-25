import { schema as navigation } from '@cvent/planner-navigation/server';
import { graphqlApiRoute } from '@cvent/apollo-server/graphql/routes/graphqlApiRoute';
import { AuthClient } from '@cvent/auth-client';
import { AuthClient as AuthClientDataSource } from '@dataSources/authService/client';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { GraphQLSchema } from 'graphql';
import { NextApiRequest, NextApiResponse } from 'next';
import { BannerServiceClient } from '@dataSources/bannerService/client';
import { UniversalVideoServiceClient } from '@dataSources/universalVideoService/client';
import { S3ProxyClient } from '@dataSources/s3ProxyService/client';
import { ImageLookupClient } from '@dataSources/imageLookupService/client';
import { EventCalendarClient } from '@dataSources/eventCalendarService/client';
import { IdentityMappingClient } from '@dataSources/identityMappingService/client';
import { defaultFormatError } from '@server/error/PlannerEventHubError';
import { getRequestContext } from '@server/auth/getRequestContext';
import { IncomingHttpHeaders } from 'http';
import { PubSubEngine } from 'graphql-subscriptions';
import { allSchemas, allResolvers } from '@pages/api/graphql';
import { ChannelServiceClient } from '@dataSources/channelService/client';
import { WeeClient } from '@dataSources/weeService/client';
import { SnapshotClient } from '@dataSources/snapshotsService/client';
import { UserSOAClient } from '@dataSources/userSOAService/client';
import { AccountSOAClient } from '@dataSources/accountSOAService/client';
import { UniversalContactsClient } from '@dataSources/universalContactsService/client';
import { AnalyticsClient } from '@dataSources/analyticsService/client';
import { EventNavigationClient } from '@dataSources/eventNavigationService/client';
import { CustomDomainServiceClient } from '@dataSources/customDomain/client';
import { VideoHubUIClient } from '@dataSources/videoHubUI/client';
import { EntityImagesServiceClient } from '@dataSources/entityImagesService/client';
import { RemoteCacheOrFallback } from './RemoteCacheOrFallback';
import { MetricsPlugin } from '../apollo/plugin/MetricsPlugin';

const authClient = new AuthClient({
  endpoint: process.env.AUTH_SERVICE,
  apiKey: process.env.API_KEY
});

// Copied from NX to support declaring return type of PlannerEventHubsApp.route()
export declare type NxContext = {
  headers: IncomingHttpHeaders;
  pubsub: PubSubEngine;
};

// Copied from NX to support declaring return type of PlannerEventHubsApp.route()
declare type ContextFunction<TContext extends object> = (
  // RED
  /* eslint-disable-next-line   @typescript-eslint/no-explicit-any */
  NxContextParams: any
) => (NxContext & TContext) | Promise<NxContext & TContext>;

/**
 * Class for bootstrapping the planner-event-hubs. Typically, the `graphqlApiRoute` fn is called directly in the graphql.ts file.
 * A wrapper is necessary in order to manage redis initialization and conditionally provide the fallback cache config should redis init encounter an error.
 * The wrapper is needed because the current version of ES being targeted does not support calling `await` from top-level modules.
 */
export class PlannerEventHubsApp {
  cacheInit: RemoteCacheOrFallback;

  constructor(cacheInit: RemoteCacheOrFallback) {
    this.cacheInit = cacheInit;
  }

  contextWithAccountToken = getRequestContext();

  public route(): {
    schema: GraphQLSchema;
    context: ContextFunction<object>;
    handler: (req: NextApiRequest, res: NextApiResponse) => void;
  } {
    return graphqlApiRoute({
      typeDefs: allSchemas.concat([navigation]),
      resolvers: [...allResolvers],
      plugins: [new MetricsPlugin()],
      enableRequestResponseLogging: false,
      formatError: defaultFormatError,
      cache: this.cacheInit.getCache(),
      context: this.contextWithAccountToken,
      dataSources: () => {
        return {
          accountSOAClient: new AccountSOAClient(),
          authClient: new AuthClientDataSource(),
          analyticsClient: new AnalyticsClient(),
          bannerServiceClient: new BannerServiceClient(),
          channelServiceClient: new ChannelServiceClient(),
          eventCalendarClient: new EventCalendarClient(),
          identityMappingClient: new IdentityMappingClient(),
          imageLookupClient: new ImageLookupClient(),
          s3ProxyServiceClient: new S3ProxyClient(),
          snapshotClient: new SnapshotClient(),
          universalContactsClient: new UniversalContactsClient(),
          universalVideoServiceClient: new UniversalVideoServiceClient(),
          userSOAClient: new UserSOAClient(),
          videoCenterClient: new VideoCenterClient(),
          videoHubUiClient: new VideoHubUIClient(),
          weeClient: new WeeClient(),
          eventNavigationClient: new EventNavigationClient(),
          customDomainClient: new CustomDomainServiceClient(),
          entityImagesServiceClient: new EntityImagesServiceClient()
        };
      },
      authDirective: {
        authClient
      },
      graphqlBasePath: '',
      developmentMode: process.env.NODE_ENV !== 'production'
    });
  }
}
