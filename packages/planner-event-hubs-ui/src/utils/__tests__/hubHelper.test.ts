import { getHub } from '@utils/hubHelper';
import { GET_VIDEO_HUB } from '@cvent/planner-event-hubs-model/operations/hub';
import { ApolloClient, ApolloClientOptions } from '@apollo/client';

jest.mock('@apollo/client', () => {
  const mockClient = {
    query: jest.fn()
  };
  return { ...jest.requireActual('@apollo/client'), ApolloClient: jest.fn(() => mockClient) };
});

const options: ApolloClientOptions<never> = {
  cache: undefined,
  uri: 'https://my-graphql-api.com/graphql'
};

describe('Get Center Info', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('Should return a Hub', async () => {
    const client = new ApolloClient(options);
    await getHub(client, 'test-id');
    expect(client.query).toHaveBeenCalledWith({
      query: GET_VIDEO_HUB,
      variables: {
        hubID: {
          id: 'test-id'
        }
      }
    });
  });
});
