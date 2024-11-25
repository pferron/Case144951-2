import { isFunction } from 'lodash';
import { PlannerEventHubError } from '@server/error/PlannerEventHubError';
// FIREBALL
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const getMockResolverRequest = (route, args = {}): any => {
  return {
    args,
    context: {
      route,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0',
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.5',
        'accept-encoding': 'gzip, deflate',
        'content-type': 'application/json',
        httplogpageloadid: 'efe529ae-e7b4-421a-aebb-a9d10053f84e',
        httplogrequestid: 'd190d5f9-c18f-40e6-b26b-f991eb8c7f2b',
        origin: 'https://localhost:7000',
        'content-length': '294',
        connection: 'keep-alive',
        dnt: '1',
        cookie: 'cvent-auth=c0a1afc1b9b2f44b068ae9802270e8a6'
      },
      auth: {
        authorization: {
          metadata: {
            environment: 'T2'
          }
        }
      }
    }
  };
};
export const getMockResolverRequestWithDataSources = (
  route: string,
  dataSources: object,
  args = {},
  auth = null
  // RED
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
): any => {
  return {
    args,
    context: {
      route,
      dataSources,
      headers: {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:77.0) Gecko/20100101 Firefox/77.0',
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.5',
        'accept-encoding': 'gzip, deflate',
        'content-type': 'application/json',
        httplogpageloadid: 'efe529ae-e7b4-421a-aebb-a9d10053f84e',
        httplogrequestid: 'd190d5f9-c18f-40e6-b26b-f991eb8c7f2b',
        origin: 'https://localhost:7000',
        'content-length': '294',
        connection: 'keep-alive',
        dnt: '1',
        authorization: 'Bearer c0a1afc1b9b2f44b068ae9802270e8a6'
      },
      auth: auth ?? {
        accessToken: '123345',
        authorization: {
          metadata: {
            environment: 'T2',
            accountMappingId: '99737873-fcf0-4b0f-bcf9-e5d3a55b1c22',
            MemberId: '203ec1d5-a9a2-489c-a33c-01bcd0e7dcc2',
            VideoCenterId: '203ec1d5-a9a2-489c-a33c-01bcd0e7dcc2'
          }
        }
      }
    }
  };
};

export const getMockResolverRequestWithNoCenterId = (route: string, dataSources: object, args = {}) => {
  const request = getMockResolverRequestWithDataSources(route, dataSources, args);
  return {
    ...request,
    context: {
      ...request.context,
      auth: {
        authorization: {
          metadata: {
            environment: 'T2',
            accountMappingId: '99737873-fcf0-4b0f-bcf9-e5d3a55b1c22',
            MemberId: '203ec1d5-a9a2-489c-a33c-01bcd0e7dcc2'
          }
        }
      }
    }
  };
};

export const getMockResolverRequestWithPlannerRole = (route: string, dataSources: object, args = {}) => {
  const request = getMockResolverRequestWithDataSources(route, dataSources, args);
  return {
    ...request,
    context: {
      ...request.context,
      auth: {
        authorization: {
          roles: ['IS_PLANNER'],
          metadata: {
            environment: 'T2',
            accountMappingId: '99737873-fcf0-4b0f-bcf9-e5d3a55b1c22'
          }
        }
      }
    }
  };
};
// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const mockDataSource = (dataSource: object, method: string, response: any): any => {
  // RED
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const mock = isFunction(response) ? response : async (): Promise<any> => response;
  // RED
  // eslint-disable-next-line no-param-reassign
  dataSource[method] = jest.fn().mockImplementation(mock);
};
// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const mockDataSourceOnce = (dataSource: object, method: string, response: any): any => {
  // RED
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const mock = isFunction(response) ? response : async (): Promise<any> => response;
  // RED
  // eslint-disable-next-line no-param-reassign
  dataSource[method] = jest.fn().mockImplementationOnce(mock);
};
// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const mockDataSourceAgain = (dataSource: object, method: string, response: any): any => {
  // RED
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const mock = isFunction(response) ? response : async (): Promise<any> => response;
  // RED
  // eslint-disable-next-line no-param-reassign
  dataSource[method].mockImplementationOnce(mock);
};
// RED
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export const mockDataSourceError = (
  dataSource: object,
  method: string,
  errorText: string,
  errorCode: string,
  response?: object
) => {
  mockDataSource(dataSource, method, () => {
    return Promise.reject(
      new PlannerEventHubError(errorText, {
        code: errorCode,
        requestId: 'requestId',
        pageLoadId: 'pageLoadId',
        response: response === null ? 'Failed' : response
      })
    );
  });
};
