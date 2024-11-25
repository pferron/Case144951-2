import { PlannerEventHubError } from '@server/error/PlannerEventHubError';

export const notFoundResponse = (): Promise<PlannerEventHubError> => {
  return Promise.reject(
    new PlannerEventHubError('Not Found', {
      code: '404',
      requestId: 'requestId',
      pageLoadId: 'pageLoadId',
      response: 'Failed'
    })
  );
};

export const unAuthorisedResponse = (): Promise<PlannerEventHubError> => {
  return Promise.reject(
    new PlannerEventHubError('Unauthorised', {
      code: '401',
      requestId: 'requestId',
      pageLoadId: 'pageLoadId',
      response: 'Failed'
    })
  );
};
