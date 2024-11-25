import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import {
  Resolvers,
  HubCodeSnippets,
  TargetWebPages,
  CodeSnippet,
  MeasurementIdResponse,
  Success
} from '@cvent/planner-event-hubs-model/types';
import { NOT_FOUND_ERROR_CODE } from '@utils/constants';

const LOG = LoggerFactory.create('resolvers/trackingcodes');

const FlagToTargetWebpageMap = {
  addToAllPages: TargetWebPages.AllVcPages,
  addToLoginPage: TargetWebPages.Login,
  addToSingleVideoPage: TargetWebPages.SingleVideosPage
};

const resolver: Resolvers = {
  Query: {
    getHubCodeSnippets: async (_parent, { hubId }, { dataSources }, _info): Promise<HubCodeSnippets[]> => {
      LOG.debug('Fetching code snippets for hub id: ', hubId);
      const hubCodeSnippetsResponse = await dataSources.videoCenterClient.getCodeSnippets(hubId);
      const hubCodeSnippets = hubCodeSnippetsResponse.data.map(codeSnippet => ({
        codeSnippetId: codeSnippet.id,
        applicableOn: codeSnippet.applicableOn,
        targetWebPages: codeSnippet.targetWebpages
      }));
      return hubCodeSnippets;
    },
    getGoogleMeasurementId: async (_parent, { hubId }, { dataSources }, _info): Promise<MeasurementIdResponse> => {
      LOG.debug('Fetching google measurement ID for hub id: ', hubId);
      let response;
      try {
        response = await dataSources.videoCenterClient.fetchGoogleAnalytics(hubId);
      } catch (error) {
        if (error.code === NOT_FOUND_ERROR_CODE) {
          return { measurementId: '' };
        }
      }
      return { measurementId: response?.measurementId.replace('G-', '').trim() };
    }
  },
  Mutation: {
    saveGoogleMeasurementId: async (_parent, { input }, { dataSources }, _info): Promise<MeasurementIdResponse> => {
      const { oldMeasurementId, newMeasurementId, hubId } = input;
      // delete if new Measurement ID is empty
      if (oldMeasurementId && newMeasurementId === '') {
        await dataSources.videoCenterClient.deleteGoogleAnalytics(hubId);
        return {
          measurementId: ''
        };
      }

      // save or update new measurement ID based on whether measurement ID was initially present
      let response = null;
      if (newMeasurementId) {
        if (oldMeasurementId === '') {
          response = await dataSources.videoCenterClient.addGoogleAnalytics(hubId, newMeasurementId.trim());
        } else {
          response = await dataSources.videoCenterClient.updateGoogleAnalytics(hubId, newMeasurementId.trim());
        }
      }
      return {
        measurementId: response?.measurementId.replace('G-', '').trim()
      };
    },
    saveCodeSnippet: async (_parent, { input }, { dataSources }): Promise<CodeSnippet> => {
      LOG.debug('saveCodeSnippet', input);

      // convert input flags to array of target webpages
      const targetWebPages = [];
      for (const [key, value] of Object.entries(FlagToTargetWebpageMap)) {
        if (input[key]) {
          targetWebPages.push(value);
        }
      }
      const requestInput = { codeSnippetId: input.codeSnippetId, applicableOn: input.applicableOn, targetWebPages };
      const response = await dataSources.videoCenterClient.saveCodeSnippetForHub(requestInput, input.hubId);
      // convert target webpages to flags in response
      return {
        codeSnippetId: response.id,
        applicableOn: response.applicableOn,
        addToAllPages: response.targetWebpages.includes(FlagToTargetWebpageMap.addToAllPages),
        addToLoginPage: response.targetWebpages.includes(FlagToTargetWebpageMap.addToLoginPage),
        addToSingleVideoPage: response.targetWebpages.includes(FlagToTargetWebpageMap.addToSingleVideoPage)
      };
    },
    updateCodeSnippet: async (_parent, { input }, { dataSources }): Promise<CodeSnippet> => {
      LOG.debug('updateCodeSnippet', input);
      const targetWebPages = [];
      for (const [key, value] of Object.entries(FlagToTargetWebpageMap)) {
        if (input[key]) {
          targetWebPages.push(value);
        }
      }
      const requestInput = { codeSnippetId: input.codeSnippetId, applicableOn: input.applicableOn, targetWebPages };
      const response = await dataSources.videoCenterClient.updateCodeSnippetForHub(requestInput, input.hubId);
      // convert target webpages to flags in response
      return {
        codeSnippetId: response.id,
        applicableOn: response.applicableOn,
        addToAllPages: response.targetWebpages.includes(FlagToTargetWebpageMap.addToAllPages),
        addToLoginPage: response.targetWebpages.includes(FlagToTargetWebpageMap.addToLoginPage),
        addToSingleVideoPage: response.targetWebpages.includes(FlagToTargetWebpageMap.addToSingleVideoPage)
      };
    },
    removeCodeSnippet: async (_parent, { input }, { dataSources }): Promise<Success> => {
      LOG.debug('removeCodeSnippet', input);
      await dataSources.videoCenterClient.removeCodeSnippet(input.hubId, input.codeSnippetId);
      return {
        success: true
      };
    }
  }
};

export default resolver;
