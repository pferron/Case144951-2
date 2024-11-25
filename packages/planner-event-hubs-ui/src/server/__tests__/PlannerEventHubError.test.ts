import { defaultFormatError, PlannerEventHubError } from '@server/error/PlannerEventHubError';

describe('Planner Event Hub Error - Default Error Format', () => {
  it('When error is Internal Server Error', () => {
    const error = new PlannerEventHubError('Internal Server Error Detected', {
      code: 'INTERNAL_SERVER_ERROR',
      requestId: 'requestId',
      pageLoadId: 'pageLoadId',
      response: 'Failed'
    });
    const output = defaultFormatError(error);
    expect(output.message).toBe('Internal server error');
  });

  it('When error is Graph Validation Error for production', () => {
    const error = new PlannerEventHubError('Graph Validation Error Detected', {
      code: 'GRAPHQL_VALIDATION_FAILED',
      requestId: 'requestId',
      pageLoadId: 'pageLoadId',
      response: 'Failed'
    });
    process.env.NODE_ENV = 'production';
    const output = defaultFormatError(error);
    expect(output.message).toBe('GraphQL request failed schema validation');
  });

  it('When error is Graph Validation Error for non-production', () => {
    const error = new PlannerEventHubError('Graph Validation Error Detected', {
      code: 'GRAPHQL_VALIDATION_FAILED',
      requestId: 'requestId',
      pageLoadId: 'pageLoadId',
      response: 'Failed'
    });
    process.env.NODE_ENV = 'staging';
    const output = defaultFormatError(error);
    expect(output.message).toBe('Graph Validation Error Detected');
  });

  it('When error is Authorization Error', () => {
    const error = new PlannerEventHubError('Authorization error Detected', {
      code: 'FORBIDDEN',
      requestId: 'requestId',
      pageLoadId: 'pageLoadId',
      response: 'Failed'
    });
    const output = defaultFormatError(error);
    expect(output.message).toBe('Authorization error Detected');
  });
});
