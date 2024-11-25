import { VideoCenterClient } from '@dataSources/videoCenterService/client';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { MemberListPaginatedResult } from '@cvent/planner-event-hubs-model/types';
import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import memberListResolver from '../memberList/index';

const input = {
  centerId: 'TestId',
  searchTerm: 'demo',
  pageLimit: 10,
  sort: 'firstName:ASC'
};

const memberListPaginatedResult: MemberListPaginatedResult = {
  paging: {
    currentToken: '3a9e94b9-7455-40bb-a606-b733257fd915',
    limit: 10,
    nextToken: null,
    totalCount: 1
  },
  data: [
    {
      id: '087eb5bb-e0a7-44f4-89be-5e72a6abc928',
      firstName: 'Test',
      lastName: 'One',
      emailAddress: 'demo@test.mail',
      jobTitle: 'Sample',
      companyName: 'ABC',
      lastLoginDate: '2022-12-01T12:30:10.234Z',
      registrationDate: '2022-10-10T00:00:00.452Z'
    }
  ]
};

const memberListPaginatedResultWithSort: MemberListPaginatedResult = {
  paging: {
    currentToken: '3a9e94b9-7455-40bb-a606-b733257fd915',
    limit: 10,
    nextToken: null,
    totalCount: 3
  },
  data: [
    {
      id: '087eb5bb-e0a7-44f4-89be-5e72a6abc928',
      firstName: 'James',
      lastName: 'Delany',
      emailAddress: 'demo@test.mail',
      jobTitle: 'Sample',
      companyName: 'ABC',
      lastLoginDate: '2022-12-01T12:30:10.234Z',
      registrationDate: '2022-10-10T00:00:00.452Z'
    },
    {
      id: '087eb5bb-e0a7-44f4-89be-5e72a6abc920',
      firstName: 'Jhonny',
      lastName: 'Depp',
      emailAddress: 'hi@test.mail',
      jobTitle: 'test',
      companyName: 'cvent',
      lastLoginDate: '2022-12-01T12:30:10.234Z',
      registrationDate: '2022-10-10T00:00:00.452Z'
    },
    {
      id: '087eb5bb-e0a7-44f4-89be-5e72a6abc99',
      firstName: 'Jimmy',
      lastName: 'dales',
      emailAddress: 'jimmy@test.mail',
      jobTitle: 'test',
      companyName: 'cvent',
      lastLoginDate: '2022-12-01T12:30:10.234Z',
      registrationDate: '2022-10-10T00:00:00.452Z'
    }
  ]
};

const updateMemberStatusInput = {
  hubId: 'TestId',
  memberIds: ['04ca6ae2-0dc3-487b-953e-86d6abbdf733'],
  status: 'DELETED'
};

const memberListPaginatedResultWithNoData: MemberListPaginatedResult = {
  paging: {
    currentToken: '3a9e94b9-7455-40bb-a606-b733257fd915',
    limit: 10,
    nextToken: null,
    totalCount: 0
  },
  data: []
};

describe('resolvers/profile/index', () => {
  let dataSources;

  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient()
    };
  });

  describe('searchMemberList', () => {
    it('Should search member list based on searchTerm', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', memberListPaginatedResult);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.searchMemberList', dataSources, { input });
      const response = await resolveQueryResponse(memberListResolver, 'searchMemberList', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject(memberListPaginatedResult);
    });

    it('Should search member list based on sort input', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', memberListPaginatedResultWithSort);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.searchMemberList', dataSources, { input });
      const response = await resolveQueryResponse(memberListResolver, 'searchMemberList', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject(memberListPaginatedResultWithSort);
    });

    it('Should return empty list when no member found', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', memberListPaginatedResultWithNoData);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.searchMemberList', dataSources, { input });
      const response = await resolveQueryResponse(memberListResolver, 'searchMemberList', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject(memberListPaginatedResultWithNoData);
    });

    it('Should throw unauthorized', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', 'Unauthorized', '401');
      await expect(async () => {
        await resolveQueryResponse(
          memberListResolver,
          'searchMemberList',
          getMockResolverRequestWithDataSources('Query.searchMemberList', dataSources, { input })
        );
      }).rejects.toThrow('Unauthorized');
    });

    it('Should update member status to Deleted', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', { success: true });
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.updateMemberStatus', dataSources, {
        input: updateMemberStatusInput
      });
      const response = await resolveMutationResponse(memberListResolver, 'updateMemberStatus', resolverRequest);
      expect(response).toBeTruthy();
    });

    it('throws error if failed to update member status', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'put', 'Failed to update video-center member status', '400');
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.updateMemberStatus', dataSources, {
        input: updateMemberStatusInput
      });
      await expect(
        resolveMutationResponse(memberListResolver, 'updateMemberStatus', resolverRequest, null)
      ).rejects.toThrow('Failed to update video-center member status');
    });
  });
});
