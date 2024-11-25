import type { Span } from 'dd-trace';
import tracer from 'dd-trace';
import type {
  ApolloServerPlugin,
  GraphQLRequestContext,
  GraphQLRequestListener,
  GraphQLRequestContextDidEncounterErrors,
  BaseContext,
  ValueOrPromise
} from 'apollo-server-plugin-base';

import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import type { FieldNode, OperationDefinitionNode } from 'graphql';
import type { RequestContext } from '@server/auth/getRequestContext';

const LOG = LoggerFactory.create('plugin/MetricsPlugin');

/**
 * Custom plugin to set up DD tags to the active span. Refer to the wiki page link below
 * whenever you need to add new tags.
 *
 * DD Tracing Standards: https://wiki.cvent.com/pages/viewpage.action?spaceKey=RD&title=Tracing+Standards
 */
export class MetricsPlugin implements ApolloServerPlugin {
  /**
   * Fires whenever a GraphQL request is received from a client.
   */
  public requestDidStart(): GraphQLRequestListener | void {
    const activeSpan: Span | null = tracer.scope().active();

    function addTagsToSpan(context: RequestContext) {
      const metadata = context?.authorization?.metadata;
      if (metadata) {
        const userStub = metadata.userStub || metadata.UserStub;
        if (userStub) {
          activeSpan.setTag('core.account.user.id', userStub);
        }
        if (metadata.MemberId) {
          activeSpan.setTag('video_center.member.id', metadata.MemberId);
        }
        activeSpan.setTag('core.account.id', metadata.accountId || metadata.AccountId);
        activeSpan.setTag('video_center.id', metadata.VideoCenterId);
      }
      activeSpan.setTag('userGroup', context?.isAutomationAccount ? 'automation' : 'unknown');
      activeSpan.setTag('http.request_id', context?.logIds?.HttpLogRequestId);
    }

    return {
      responseForOperation(requestContext: GraphQLRequestContext): null {
        try {
          const documentNode: OperationDefinitionNode = requestContext?.document?.definitions?.find(
            def => def.kind === 'OperationDefinition'
          ) as OperationDefinitionNode;
          const selectionNode: FieldNode = documentNode?.selectionSet?.selections[0] as FieldNode;
          const route = `${documentNode.operation}.${selectionNode.name.value}`;

          if (activeSpan) {
            const context = requestContext.context as RequestContext;
            const metadata = context?.authorization?.metadata;
            activeSpan.setTag('environment.upstream', metadata?.environment?.toUpperCase());
            activeSpan.setTag('graphql.route', route);
            addTagsToSpan(context);
          }
        } catch (error) {
          LOG.warn('could not tag datadog span', error);
        }
        return null;
      },
      /**
       * The didEncounterErrors event fires when Apollo Server encounters errors while parsing, validating,
       * or executing a GraphQL operation.
       */
      didEncounterErrors(requestContext: GraphQLRequestContextDidEncounterErrors<BaseContext>): ValueOrPromise<void> {
        if (activeSpan && requestContext?.errors && requestContext.errors[0]) {
          const error = requestContext.errors[0];
          const { message, stack } = error;
          const context = requestContext.context as RequestContext;
          addTagsToSpan(context);

          activeSpan.setTag('error.message', message);
          activeSpan.setTag('error.stack', stack);
          activeSpan.setTag('error.code', error?.extensions?.code);
          activeSpan.setTag('error.response', error?.extensions?.response);
        }
      }
    };
  }
}
