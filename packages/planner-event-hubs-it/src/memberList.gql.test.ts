import { authOptions, connectToApiAsPlanner, unauthOptions } from '@helpers/connectToApiAsPlanner';
import { createHub, getHub, hubPublish, rawDeleteHub } from '@helpers/hubFunctions';
import { newHubData } from '@fixtures/hubData';
import { v4 as uuidV4 } from 'uuid';
import { searchMemberList, updateMemberStatusMutation } from '@helpers/memberListFunctions';
import { skipDescribeIfProdEnvironment } from '@utils/commonUtils';

let client = null;
let clientWithIncorrectRole = null;
let testHubId = null;

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

skipDescribeIfProdEnvironment()('mutation: updateMemberStatus', () => {
  it('Should return Not found for an invalid hub id', async () => {
    const input = {
      hubId: uuidV4(),
      memberIds: [uuidV4()]
    };
    await expect(async () => updateMemberStatusMutation(client, input)).rejects.toThrow('Not Found');
  });

  it('Should update member status successfully', async () => {
    const input = {
      hubId: testHubId,
      memberIds: [uuidV4()]
    };
    const response = await updateMemberStatusMutation(client, input);
    expect(response).toBeTruthy();
    expect(response.success).toEqual(true);
  });
});

skipDescribeIfProdEnvironment()('query: searchMemberList', () => {
  it('Should return Unauthorized for incorrect video-center role in bearer', async () => {
    const input = {
      centerId: testHubId,
      searchTerm: 'abc'
    };
    await expect(async () => searchMemberList(clientWithIncorrectRole, input)).rejects.toThrow('Not authorized');
  });

  it('Should return Not found for an invalid center id', async () => {
    const input = {
      centerId: uuidV4(),
      searchTerm: 'abc'
    };
    await expect(async () => searchMemberList(client, input)).rejects.toThrow('Not Found');
  });

  it('Should return empty list when video center has no member', async () => {
    const input = {
      centerId: testHubId,
      searchTerm: 'abc',
      pageLimit: 10,
      sort: 'firstName:ASC'
    };
    const response = await searchMemberList(client, input);
    expect(response).toBeTruthy();
    expect(response.paging).toBeTruthy();
    expect(response.paging.limit).toEqual(input.pageLimit);
    expect(response.paging.totalCount).toEqual(0);
    expect(response.data).toBeTruthy();
    expect(response.data).toHaveLength(0);
  });
});
