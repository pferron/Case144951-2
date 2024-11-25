import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { AuthClient } from '@dataSources/authService/client';
import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import { resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import { IdentityMappingClient } from '@dataSources/identityMappingService/client';
import loginResolver from '../login/index';
import loginRequestInput from './fixtures/memberLoginRequest.json';
import expectedLoginResponse from './fixtures/memberLoginResponse.json';

const MEMBER_LOGIN_QUERY = 'memberLogin';
const UNAUTHORIZED_CODE = '401';
const FORBIDDEN_CODE = '403';
const INTERNAL_SERVER_ERROR_CODE = '500';
const UNAUTHORIZED = 'Unauthorised';
const INTERNAL_SERVER_ERROR = 'Internal server error';

describe('resolvers/login/index', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient(),
      authClient: new AuthClient(),
      identityMappingClient: new IdentityMappingClient()
    };
  });

  describe('memberLogin', () => {
    it('successful login request', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', expectedLoginResponse);
      const resolverRequest = getMockResolverRequestWithDataSources(MEMBER_LOGIN_QUERY, dataSources, loginRequestInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(loginResolver, MEMBER_LOGIN_QUERY, resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject(expectedLoginResponse);
    });

    it('throw unauthorized when used wrong bearer', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', UNAUTHORIZED, UNAUTHORIZED_CODE);
      const resolverRequest = getMockResolverRequestWithDataSources(MEMBER_LOGIN_QUERY, dataSources, loginRequestInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      await expect(async () => {
        await resolveQueryResponse(loginResolver, MEMBER_LOGIN_QUERY, resolverRequest);
      }).rejects.toThrow(UNAUTHORIZED);
    });

    it('sets user restricted when Forbidden error received', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', 'Access Denied', FORBIDDEN_CODE);
      const resolverRequest = getMockResolverRequestWithDataSources(MEMBER_LOGIN_QUERY, dataSources, loginRequestInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(loginResolver, MEMBER_LOGIN_QUERY, resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject({ userRestricted: true });
    });

    it('sets error message when server error received', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', INTERNAL_SERVER_ERROR, INTERNAL_SERVER_ERROR_CODE);
      const resolverRequest = getMockResolverRequestWithDataSources(MEMBER_LOGIN_QUERY, dataSources, loginRequestInput);
      dataSources.videoCenterClient.context = resolverRequest.context;
      const response = await resolveQueryResponse(loginResolver, MEMBER_LOGIN_QUERY, resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject({ serverError: INTERNAL_SERVER_ERROR });
    });
  });
});
