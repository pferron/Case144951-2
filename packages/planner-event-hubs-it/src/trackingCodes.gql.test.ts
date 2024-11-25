import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { createHub, getHub, hubPublish, rawDeleteHub } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';
import { v4 as uuidV4 } from 'uuid';
import {
  getGoogleAnalytics,
  getHubCodeSnippets,
  saveGoogleAnalytics,
  saveCodeSnippet,
  updateCodeSnippet,
  removeCodeSnippetData
} from '@helpers/trackingCodesFunctions';
import { ApplicableOn, CodeSnippetInput } from '@cvent/planner-event-hubs-model/types';
import { isProductionEnv } from '@utils/commonUtils';
import { ApolloClient, NormalizedCacheObject } from '@apollo/client';

let client: ApolloClient<NormalizedCacheObject>;
let clientWithIncorrectRole: ApolloClient<NormalizedCacheObject>;
let testHubId: string;
const isProduction = isProductionEnv(process.env.ENV);

beforeAll(async () => {
  client = await connectToApiAsPlanner(authOptions);
  clientWithIncorrectRole = await connectToApiAsPlanner(unauthOptions);
  testHubId = await createHub(client, newHubData);
  await hubPublish(client, { id: testHubId });
}, 10000);

afterAll(async () => {
  const hub = await getHub(client, testHubId);
  if (hub.id) {
    await rawDeleteHub(client, { id: testHubId });
  }
});

describe('mutation: saveCodeSnippet', () => {
  let input: CodeSnippetInput;

  beforeEach(() => {
    input = {
      hubId: testHubId,
      codeSnippetId: uuidV4(),
      addToAllPages: true,
      applicableOn: ApplicableOn.AllPages
    };
  });

  if (!isProduction) {
    it('requires video-center:write access', async () => {
      await expect(async () => saveCodeSnippet(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
    });
    it('passes through Not Found responses to the caller', async () => {
      input.hubId = uuidV4();
      await expect(async () => saveCodeSnippet(client, { ...input, hubId: uuidV4() })).rejects.toThrow('Not Found');
    });
  }

  it('returns the persisted codeSnippet data', async () => {
    const response = await saveCodeSnippet(client, input);
    expect(response).toHaveProperty('addToAllPages', input.addToAllPages);
    expect(response).toHaveProperty('applicableOn', input.applicableOn);
    expect(response).toHaveProperty('codeSnippetId', input.codeSnippetId);
    expect(response).toHaveProperty('addToLoginPage', false);
    expect(response).toHaveProperty('addToSingleVideoPage', false);
  });
});

describe('mutation: updateCodeSnippet', () => {
  let input: CodeSnippetInput;

  beforeEach(async () => {
    input = {
      hubId: testHubId,
      codeSnippetId: uuidV4(),
      addToAllPages: true,
      applicableOn: ApplicableOn.AllPages
    };
  });

  if (!isProduction) {
    it('requires video-center:write access', async () => {
      await expect(async () => updateCodeSnippet(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
    });
    it('passes through Not Found responses to the caller', async () => {
      input.hubId = uuidV4();
      await expect(async () => updateCodeSnippet(client, { ...input, hubId: uuidV4() })).rejects.toThrow('Not Found');
    });
  }

  it('returns the persisted codeSnippet data', async () => {
    // create the snippet so updates will succeed
    await saveCodeSnippet(client, input);

    const response = await updateCodeSnippet(client, input);
    expect(response).toHaveProperty('addToAllPages', input.addToAllPages);
    expect(response).toHaveProperty('applicableOn', input.applicableOn);
    expect(response).toHaveProperty('codeSnippetId', input.codeSnippetId);
    expect(response).toHaveProperty('addToLoginPage', false);
    expect(response).toHaveProperty('addToSingleVideoPage', false);
  });
});

describe('query: getHubCodeSnippets', () => {
  if (!isProduction) {
    it('Should return Unauthorized for incorrect video-center role in bearer', async () => {
      await expect(async () => getHubCodeSnippets(clientWithIncorrectRole, testHubId)).rejects.toThrow(
        'Not authorized'
      );
    });

    it('Should return Not found for an invalid hub id', async () => {
      await expect(async () => getHubCodeSnippets(client, uuidV4())).rejects.toThrow('Not Found');
    });
  }

  it('Should return code snippets for hub id', async () => {
    const response = await getHubCodeSnippets(client, testHubId);
    expect(response).toBeTruthy();
    expect(response).toHaveProperty('getHubCodeSnippets');
  });
});

describe('mutation: saveGoogleAnalytics', () => {
  if (!isProduction) {
    it('Should return Unauthorized for incorrect video-center role in bearer', async () => {
      const input = {
        hubId: testHubId,
        oldMeasurementId: '',
        newMeasurementId: '12345'
      };
      await expect(async () => saveGoogleAnalytics(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
    });

    it('Should return Not found for an invalid hub id', async () => {
      const input = {
        hubId: uuidV4(),
        oldMeasurementId: '',
        newMeasurementId: '12345'
      };
      await expect(async () => saveGoogleAnalytics(client, input)).rejects.toThrow('Not Found');
    });
  }

  it('Should save measurement id for the hub, update it and delete it successfully', async () => {
    const input = {
      hubId: testHubId,
      oldMeasurementId: '',
      newMeasurementId: '12345'
    };
    // save google analytics
    const saveResponse = await saveGoogleAnalytics(client, input);
    expect(saveResponse).toBeTruthy();
    expect(saveResponse.measurementId).toEqual('12345');

    // update google analytics
    const updateResponse = await saveGoogleAnalytics(client, {
      hubId: testHubId,
      oldMeasurementId: '12345',
      newMeasurementId: '98765'
    });
    expect(updateResponse).toBeTruthy();
    expect(updateResponse.measurementId).toEqual('98765');

    // delete google analytics
    const deleteResponse = await saveGoogleAnalytics(client, {
      hubId: testHubId,
      oldMeasurementId: '98765',
      newMeasurementId: ''
    });
    expect(deleteResponse).toBeTruthy();
    expect(deleteResponse.measurementId).toEqual('');
  });
});

describe('query: getGoogleAnalytics', () => {
  if (!isProduction) {
    it('Should return Unauthorized for incorrect video-center role in bearer', async () => {
      await expect(async () => getGoogleAnalytics(clientWithIncorrectRole, testHubId)).rejects.toThrow(
        'Not authorized'
      );
    });
  }

  it('Should save measurement id for the hub and fetch it successfully', async () => {
    // fetch google analytics when not set initially
    const initialResponse = await getGoogleAnalytics(client, testHubId);
    expect(initialResponse).toBeTruthy();
    expect(initialResponse.measurementId).toEqual('');

    const input = {
      hubId: testHubId,
      oldMeasurementId: '',
      newMeasurementId: '12345'
    };
    // save google analytics
    const saveResponse = await saveGoogleAnalytics(client, input);
    expect(saveResponse).toBeTruthy();
    expect(saveResponse.measurementId).toEqual('12345');

    // fetch google analytics
    const getResponse = await getGoogleAnalytics(client, testHubId);
    expect(getResponse).toBeTruthy();
    expect(saveResponse.measurementId).toEqual('12345');
  });
});

describe('query: removeCodeSnippetData', () => {
  if (!isProduction) {
    it('Should return Unauthorized for incorrect video-center role in bearer', async () => {
      const input = {
        hubId: testHubId,
        codeSnippetId: uuidV4()
      };
      await expect(async () => removeCodeSnippetData(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
    });

    it('Should return Not found for an invalid hub id', async () => {
      const input = {
        hubId: uuidV4(),
        codeSnippetId: uuidV4()
      };
      await expect(async () => removeCodeSnippetData(client, input)).rejects.toThrow('Not Found');
    });
  }
});
