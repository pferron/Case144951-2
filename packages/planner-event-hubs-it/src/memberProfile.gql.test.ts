import { createHub, getHub, hubPublish, initiateMemberLogin, rawDeleteHub } from '@helpers/hubFunctions';
import { getMemberData } from '@helpers/profileFunctions';
import { v4 as uuidV4 } from 'uuid';
import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { newHubData } from '@fixtures/hubData';
import { isProductionEnv } from '@utils/commonUtils';

let client;
let clientWithIncorrectRole;
let testHubId;
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

describe('query: getMemberData', () => {
  if (!isProduction) {
    it('should return not found for an invalid contact id', async () => {
      const input = {
        centerId: testHubId,
        contactId: uuidV4()
      };
      await expect(async () => getMemberData(client, input)).rejects.toThrow('Not Found');
    });
  }

  if (!isProduction) {
    it('Should return Unauthorized for incorrect video-center role', async () => {
      const input = {
        centerId: uuidV4(),
        contactId: uuidV4()
      };
      await expect(async () => getMemberData(clientWithIncorrectRole, input)).rejects.toThrow('403: Forbidden');
    });
  }

  if (!isProduction) {
    it('should return not found for an invalid center id', async () => {
      const input = {
        centerId: uuidV4(),
        contactId: uuidV4()
      };
      await expect(async () => getMemberData(client, input)).rejects.toThrow('Not Found');
    });
  }

  // TODO: create a new path to fetch contactId for testing getMemberData success scenario
  // may need to create an apollo client for the ITs that proxies back to video-hub-ui
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('Should get member data for contactId', async () => {
    await initiateMemberLogin(testHubId, client);

    const input = {
      centerId: testHubId,
      contactId: 'todo'
    };
    const memberData = await getMemberData(client, input);
    expect(memberData).toBeTruthy();
    expect(memberData.profile.firstName).toEqual('test');
    expect(memberData.profile.lastName).toEqual('user');
    expect(memberData.profile.registrationDate).toBeTruthy();
    expect(memberData.profile.lastLoginDate).toBeTruthy();
  }, 20000);
});
