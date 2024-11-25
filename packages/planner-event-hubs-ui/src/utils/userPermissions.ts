import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { userPermissions } from '@cvent/planner-event-hubs-model/operations/coreSOA';
import { UserPermissions } from '@cvent/planner-event-hubs-model/types';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

const LOG = LoggerFactory.create('userPermissions');

export const getUserPermissions = async (
  apolloClient: ApolloClient<NormalizedCacheObject>
): Promise<UserPermissions> => {
  if (apolloClient == null) {
    LOG.error('Cannot retrieve user permissions data without authToken');
    return Promise.reject(new Error('Cannot retrieve user permissions data without authToken'));
  }
  try {
    const response = await apolloClient.query({
      query: userPermissions,
      fetchPolicy: 'network-only'
    });
    return response?.data?.userPermissions;
  } catch (error) {
    LOG.error('Error fetching user permissions:', error);
    throw error;
  }
};
