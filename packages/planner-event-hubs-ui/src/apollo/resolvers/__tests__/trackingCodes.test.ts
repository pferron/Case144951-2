import { CodeSnippetsResponse, VideoCenterClient } from '@dataSources/videoCenterService/client';
import {
  getMockResolverRequestWithDataSources,
  mockDataSource,
  mockDataSourceError
} from '@resolvers/common/testUtils/mockRequestData';
import { resolveMutationResponse, resolveQueryResponse } from '@resolvers/common/testUtils/mockFunction';
import { ApplicableOn, TargetWebPages, CodeSnippetHubResponse } from '@cvent/planner-event-hubs-model/types';
import trackingCodesResolver from '../trackingcodes/index';
import { updateCodeSnippetData } from './fixtures/updateCodeSnippetData';
import { saveCodeSnippetData } from './fixtures/saveCodeSnippetData';

interface getCodeSnippetsResponseType {
  data: CodeSnippetsResponse[];
}

const getCodeSnippetsResponse: getCodeSnippetsResponseType = {
  data: [
    {
      id: 'testCodeSnippetId',
      created: '2023-08-02T13:04:10.831Z',
      createdBy: 'createdByUser',
      lastModified: '2023-08-02T13:04:10.831Z',
      lastModifiedBy: 'lastModifiedByUser',
      applicableOn: ApplicableOn.Initialization,
      targetWebpages: [TargetWebPages.AllVcPages]
    }
  ]
};

const measurementIdResponse = {
  measurementId: 'G-12345',
  created: 'date1',
  createdBy: 'user1',
  lastModified: 'date2',
  lastModifiedBy: 'user2'
};

const codeSnippetResponse = {
  addToAllPages: false,
  addToLoginPage: false,
  addToSingleVideoPage: true,
  applicableOn: ApplicableOn.Initialization,
  codeSnippetId: '8b657d68-1dd9-4ed3-8f14-412b174042c7'
};

const snippetDeleteInput = {
  hubId: 'TestId',
  codeSnippetId: '00000000-0000-0000-0000-000000000001'
};

describe('resolvers/trackingCodes/index', () => {
  let dataSources;
  let input;
  beforeEach(() => {
    dataSources = {
      videoCenterClient: new VideoCenterClient()
    };
  });

  describe('FetchCodeSnippets', () => {
    beforeEach(() => {
      input = {
        centerId: 'TestId'
      };
    });

    it('Should fetch code snippets associated with hub', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', getCodeSnippetsResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubCodeSnippets', dataSources, { input });
      const response = await resolveQueryResponse(trackingCodesResolver, 'getHubCodeSnippets', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject([
        {
          codeSnippetId: 'testCodeSnippetId',
          applicableOn: ApplicableOn.Initialization,
          targetWebPages: [TargetWebPages.AllVcPages]
        }
      ]);
    });

    it('Should return empty list when no code snippets found', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', {
        data: []
      });
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getHubCodeSnippets', dataSources, { input });
      const response = await resolveQueryResponse(trackingCodesResolver, 'getHubCodeSnippets', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject([]);
    });

    it('Should throw unauthorized', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Unauthorized', '401');
      await expect(async () => {
        await resolveQueryResponse(
          trackingCodesResolver,
          'getHubCodeSnippets',
          getMockResolverRequestWithDataSources('Query.getHubCodeSnippets', dataSources, { input })
        );
      }).rejects.toThrow('Unauthorized');
    });
  });

  describe('Save Google Measurement ID', () => {
    it('Should save measurement ID for hub when initially ID not present', async () => {
      const gaInput = {
        hubId: 'Test',
        oldMeasurementId: '',
        newMeasurementId: '12345'
      };
      mockDataSource(dataSources.videoCenterClient, 'post', measurementIdResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveGoogleMeasurementId', dataSources, {
        input: gaInput
      });
      const response = await resolveMutationResponse(trackingCodesResolver, 'saveGoogleMeasurementId', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        measurementId: '12345'
      });
    });

    it('Should update measurement ID for hub when initially ID is present', async () => {
      const gaInput = {
        hubId: 'Test',
        oldMeasurementId: '12345',
        newMeasurementId: '98765'
      };
      mockDataSource(dataSources.videoCenterClient, 'put', { ...measurementIdResponse, measurementId: 'G-98765' });
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveGoogleMeasurementId', dataSources, {
        input: gaInput
      });
      const response = await resolveMutationResponse(trackingCodesResolver, 'saveGoogleMeasurementId', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        measurementId: '98765'
      });
    });

    it('Should delete measurement ID for hub when new ID given is empty', async () => {
      const gaInput = {
        hubId: 'Test',
        oldMeasurementId: '12345',
        newMeasurementId: ''
      };
      mockDataSource(dataSources.videoCenterClient, 'delete', {});
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.saveGoogleMeasurementId', dataSources, {
        input: gaInput
      });
      const response = await resolveMutationResponse(trackingCodesResolver, 'saveGoogleMeasurementId', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        measurementId: ''
      });
    });
  });

  describe('Get Google Measurement ID', () => {
    it('Should get measurement ID for hub', async () => {
      mockDataSource(dataSources.videoCenterClient, 'get', measurementIdResponse);
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getGoogleMeasurementId', dataSources, {
        hubId: 'TestID'
      });
      const response = await resolveQueryResponse(trackingCodesResolver, 'getGoogleMeasurementId', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        measurementId: '12345'
      });
    });

    it('Should get empty measurement ID for hub where analytics not set', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'get', 'Not Found', '404');
      const resolverRequest = getMockResolverRequestWithDataSources('Query.getGoogleMeasurementId', dataSources, {
        hubId: 'TestID'
      });
      const response = await resolveQueryResponse(trackingCodesResolver, 'getGoogleMeasurementId', resolverRequest);
      expect(response).toBeTruthy();
      expect(response).toMatchObject({
        measurementId: ''
      });
    });
  });

  describe('Tracking Codes Resolver', () => {
    beforeEach(() => {
      input = {
        addToAllPages: false,
        addToLoginPage: false,
        addToSingleVideoPage: true,
        applicableOn: ApplicableOn.Initialization,
        codeSnippetId: '8b657d68-1dd9-4ed3-8f14-412b174042c7',
        hubId: '74b3cf7a-c49e-446b-8469-215c1ffcdab5'
      };
    });

    it('resolves save code snippet mutation', async () => {
      mockDataSource(dataSources.videoCenterClient, 'post', saveCodeSnippetData as CodeSnippetHubResponse);
      const resolverRequest = getMockResolverRequestWithDataSources(
        'Mutation.saveCodeSnippet',
        dataSources,
        { input },
        { environment: 'test' }
      );
      const savedCodeSnippet = await resolveMutationResponse(
        trackingCodesResolver,
        'saveCodeSnippet',
        resolverRequest,
        null
      );
      expect(savedCodeSnippet).toBeTruthy();
      expect(savedCodeSnippet).toEqual(codeSnippetResponse);
    });

    it('throws error if failed to save code snippet', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'post', 'failed to save code snippet', '400');
      const resolverRequest = getMockResolverRequestWithDataSources(
        'Mutation.saveCodeSnippet',
        dataSources,
        { input },
        { environment: 'test' }
      );
      await expect(
        resolveMutationResponse(trackingCodesResolver, 'saveCodeSnippet', resolverRequest, null)
      ).rejects.toThrow('failed to save code snippet');
    });

    it('resolves update code snippet mutation', async () => {
      mockDataSource(dataSources.videoCenterClient, 'put', updateCodeSnippetData as CodeSnippetHubResponse);
      const resolverRequest = getMockResolverRequestWithDataSources(
        'Mutation.updateCodeSnippet',
        dataSources,
        { input },
        { environment: 'test' }
      );
      const updatedCodeSnippet = await resolveMutationResponse(
        trackingCodesResolver,
        'updateCodeSnippet',
        resolverRequest,
        null
      );
      expect(updatedCodeSnippet).toBeTruthy();
      expect(updatedCodeSnippet).toEqual(codeSnippetResponse);
    });

    it('throws error if failed to update code snippet', async () => {
      mockDataSourceError(dataSources.videoCenterClient, 'put', 'failed to update code snippet', '400');
      const resolverRequest = getMockResolverRequestWithDataSources(
        'Mutation.updateCodeSnippet',
        dataSources,
        { input },
        { environment: 'test' }
      );
      await expect(
        resolveMutationResponse(trackingCodesResolver, 'updateCodeSnippet', resolverRequest, null)
      ).rejects.toThrow('failed to update code snippet');
    });

    it('Should return when code snippet is deleted', async () => {
      mockDataSource(dataSources.videoCenterClient, 'delete', {
        data: []
      });
      const resolverRequest = getMockResolverRequestWithDataSources('Mutation.removeCodeSnippet', dataSources, {
        input: snippetDeleteInput
      });
      const response = await resolveMutationResponse(trackingCodesResolver, 'removeCodeSnippet', resolverRequest);
      expect(response).toBeTruthy();
    });
  });
});
