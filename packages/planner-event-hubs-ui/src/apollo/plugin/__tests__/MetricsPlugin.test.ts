import type {
  BaseContext,
  GraphQLRequestContext,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestContextResponseForOperation,
  GraphQLRequestListener
} from 'apollo-server-plugin-base';
import type { DocumentNode } from 'graphql';
import type { RequestContext } from '@server/auth/getRequestContext';
import { v4 as uuid } from 'uuid';
import { PlannerEventHubError } from '@server/error/PlannerEventHubError';
import requestContextDocument from './fixtures/requestContextDocument.json';
import { MetricsPlugin } from '../MetricsPlugin';

const mockSetTag = jest.fn();
jest.mock('dd-trace', () => ({
  scope: jest.fn().mockImplementation(() => ({
    active: jest.fn().mockImplementation(() => ({
      setTag: mockSetTag
    }))
  }))
}));

const getErrorRequestContext = (error: PlannerEventHubError): GraphQLRequestContextDidEncounterErrors<BaseContext> => {
  return {
    errors: [error]
  } as unknown as GraphQLRequestContextDidEncounterErrors<BaseContext>;
};

describe('MetricsPlugin', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct graphql route when query uses fragment for guest', () => {
    const metadata = {
      attendeeId: uuid(),
      VideoCenterId: uuid(),
      accountId: 12456,
      environment: 's606'
    };
    const requestContext: GraphQLRequestContext = {
      document: requestContextDocument as unknown as DocumentNode,
      context: {
        logIds: {
          HttpLogRequestId: uuid(),
          HttpLogPageLoadId: uuid()
        },
        isAutomationAccount: true,
        authorization: {
          metadata
        }
      } as unknown as RequestContext
    } as unknown as GraphQLRequestContext;
    const metricsPlugin = new MetricsPlugin();
    const requestDidStart: GraphQLRequestListener = metricsPlugin?.requestDidStart?.() as GraphQLRequestListener;

    requestDidStart?.responseForOperation?.(requestContext as GraphQLRequestContextResponseForOperation<BaseContext>);

    // verify the route is correct
    expect(mockSetTag).toHaveBeenCalledWith('graphql.route', 'query.bannerAssociations');
    expect(mockSetTag).toHaveBeenCalledWith('http.request_id', requestContext.context.logIds.HttpLogRequestId);
    expect(mockSetTag).toHaveBeenCalledWith('core.account.id', metadata.accountId);
    expect(mockSetTag).toHaveBeenCalledWith('video_center.id', metadata.VideoCenterId);
    expect(mockSetTag).not.toHaveProperty('video_center.member.id');
    expect(mockSetTag).not.toHaveProperty('core.account.user.id');
    expect(mockSetTag).toHaveBeenCalledWith('environment.upstream', 'S606');
    expect(mockSetTag).toHaveBeenCalledWith('userGroup', 'automation'); // check
  });

  it('should return the correct graphql route when query uses fragment for member', () => {
    const metadata = {
      attendeeId: uuid(),
      VideoCenterId: uuid(),
      accountId: 12456,
      environment: 's606',
      MemberId: uuid()
    };
    const requestContext: GraphQLRequestContext = {
      document: requestContextDocument as unknown as DocumentNode,
      context: {
        logIds: {
          HttpLogRequestId: uuid(),
          HttpLogPageLoadId: uuid()
        },
        isAutomationAccount: true,
        authorization: {
          metadata
        }
      } as unknown as RequestContext
    } as unknown as GraphQLRequestContext;
    const metricsPlugin = new MetricsPlugin();
    const requestDidStart: GraphQLRequestListener = metricsPlugin?.requestDidStart?.() as GraphQLRequestListener;

    requestDidStart?.responseForOperation?.(requestContext as GraphQLRequestContextResponseForOperation<BaseContext>);

    // verify the route is correct
    expect(mockSetTag).toHaveBeenCalledWith('graphql.route', 'query.bannerAssociations');
    expect(mockSetTag).toHaveBeenCalledWith('http.request_id', requestContext.context.logIds.HttpLogRequestId);
    expect(mockSetTag).toHaveBeenCalledWith('core.account.id', metadata.accountId);
    expect(mockSetTag).toHaveBeenCalledWith('video_center.id', metadata.VideoCenterId);
    expect(mockSetTag).toHaveBeenCalledWith('environment.upstream', 'S606');
    expect(mockSetTag).toHaveBeenCalledWith('userGroup', 'automation');
    expect(mockSetTag).toHaveBeenCalledWith('video_center.member.id', metadata.MemberId);
    expect(mockSetTag).not.toHaveProperty('core.account.user.id');
  });

  it('should return the correct graphql route when query uses fragment for planner', () => {
    const metadata = {
      attendeeId: uuid(),
      VideoCenterId: uuid(),
      accountId: 12456,
      environment: 's606',
      UserStub: uuid()
    };
    const requestContext: GraphQLRequestContext = {
      document: requestContextDocument as unknown as DocumentNode,
      context: {
        logIds: {
          HttpLogRequestId: uuid(),
          HttpLogPageLoadId: uuid()
        },
        isAutomationAccount: true,
        authorization: {
          metadata
        }
      } as unknown as RequestContext
    } as unknown as GraphQLRequestContext;
    const metricsPlugin = new MetricsPlugin();
    const requestDidStart: GraphQLRequestListener = metricsPlugin?.requestDidStart?.() as GraphQLRequestListener;

    requestDidStart?.responseForOperation?.(requestContext as GraphQLRequestContextResponseForOperation<BaseContext>);

    // verify the route is correct
    expect(mockSetTag).toHaveBeenCalledWith('graphql.route', 'query.bannerAssociations');
    expect(mockSetTag).toHaveBeenCalledWith('http.request_id', requestContext.context.logIds.HttpLogRequestId);
    expect(mockSetTag).toHaveBeenCalledWith('core.account.id', metadata.accountId);
    expect(mockSetTag).toHaveBeenCalledWith('video_center.id', metadata.VideoCenterId);
    expect(mockSetTag).toHaveBeenCalledWith('environment.upstream', 'S606');
    expect(mockSetTag).toHaveBeenCalledWith('userGroup', 'automation');
    expect(mockSetTag).toHaveBeenCalledWith('core.account.user.id', metadata.UserStub);
    expect(mockSetTag).not.toHaveProperty('video_center.member.id');
  });

  it('should return the correct graphql route when query uses fragment for planner for field userStub', () => {
    const metadata = {
      VideoCenterId: uuid(),
      accountId: 12456,
      environment: 's606',
      userStub: uuid()
    };
    const requestContext: GraphQLRequestContext = {
      document: requestContextDocument as unknown as DocumentNode,
      context: {
        logIds: {
          HttpLogRequestId: uuid(),
          HttpLogPageLoadId: uuid()
        },
        isAutomationAccount: true,
        authorization: {
          metadata
        }
      } as unknown as RequestContext
    } as unknown as GraphQLRequestContext;
    const metricsPlugin = new MetricsPlugin();
    const requestDidStart: GraphQLRequestListener = metricsPlugin?.requestDidStart?.() as GraphQLRequestListener;

    requestDidStart?.responseForOperation?.(requestContext as GraphQLRequestContextResponseForOperation<BaseContext>);

    // verify the route is correct
    expect(mockSetTag).toHaveBeenCalledWith('graphql.route', 'query.bannerAssociations');
    expect(mockSetTag).toHaveBeenCalledWith('http.request_id', requestContext.context.logIds.HttpLogRequestId);
    expect(mockSetTag).toHaveBeenCalledWith('core.account.id', metadata.accountId);
    expect(mockSetTag).toHaveBeenCalledWith('video_center.id', metadata.VideoCenterId);
    expect(mockSetTag).toHaveBeenCalledWith('environment.upstream', 'S606');
    expect(mockSetTag).toHaveBeenCalledWith('userGroup', 'automation');
    expect(mockSetTag).toHaveBeenCalledWith('core.account.user.id', metadata.userStub);
    expect(mockSetTag).not.toHaveProperty('video_center.member.id');
  });

  it('should return the correct graphql route when query uses fragment for planner for field AccountId', () => {
    const metadata = {
      attendeeId: uuid(),
      VideoCenterId: uuid(),
      AccountId: 12456,
      environment: 's606',
      userStub: uuid()
    };
    const requestContext: GraphQLRequestContext = {
      document: requestContextDocument as unknown as DocumentNode,
      context: {
        logIds: {
          HttpLogRequestId: uuid(),
          HttpLogPageLoadId: uuid()
        },
        isAutomationAccount: true,
        authorization: {
          metadata
        }
      } as unknown as RequestContext
    } as unknown as GraphQLRequestContext;
    const metricsPlugin = new MetricsPlugin();
    const requestDidStart: GraphQLRequestListener = metricsPlugin?.requestDidStart?.() as GraphQLRequestListener;

    requestDidStart?.responseForOperation?.(requestContext as GraphQLRequestContextResponseForOperation<BaseContext>);

    // verify the route is correct
    expect(mockSetTag).toHaveBeenCalledWith('graphql.route', 'query.bannerAssociations');
    expect(mockSetTag).toHaveBeenCalledWith('http.request_id', requestContext.context.logIds.HttpLogRequestId);
    expect(mockSetTag).toHaveBeenCalledWith('core.account.id', metadata.AccountId);
    expect(mockSetTag).toHaveBeenCalledWith('video_center.id', metadata.VideoCenterId);
    expect(mockSetTag).toHaveBeenCalledWith('environment.upstream', 'S606');
    expect(mockSetTag).toHaveBeenCalledWith('userGroup', 'automation');
    expect(mockSetTag).toHaveBeenCalledWith('core.account.user.id', metadata.userStub);
    expect(mockSetTag).not.toHaveProperty('video_center.member.id');
  });

  it('should set the correct data in the datadog active span for AuthenticationError', () => {
    const metricsPlugin = new MetricsPlugin();
    const requestDidStart: GraphQLRequestListener = metricsPlugin?.requestDidStart?.() as GraphQLRequestListener;
    const authorizationError = new PlannerEventHubError('Not authorized');
    const requestContext = getErrorRequestContext(authorizationError);

    requestDidStart?.didEncounterErrors?.(requestContext);

    expect(mockSetTag).toHaveBeenCalledWith('error.message', authorizationError.message);
    expect(mockSetTag).toHaveBeenCalledWith('error.stack', authorizationError.stack);
    expect(mockSetTag).toHaveBeenCalledWith('error.code', authorizationError.extensions.code);
  });

  it('should set the correct data in the datadog active span for unhandled errors', () => {
    const metricsPlugin = new MetricsPlugin();
    const requestDidStart: GraphQLRequestListener = metricsPlugin?.requestDidStart?.() as GraphQLRequestListener;
    const unhandledError = new PlannerEventHubError('Error!!', {
      code: '503'
    });
    const requestContext = getErrorRequestContext(unhandledError);
    requestDidStart?.didEncounterErrors?.(requestContext);
    expect(mockSetTag).toHaveBeenCalledWith('error.message', unhandledError.message);
    expect(mockSetTag).toHaveBeenCalledWith('error.stack', unhandledError.stack);
    expect(mockSetTag).toHaveBeenCalledWith('error.code', unhandledError.extensions.code);
  });
});
