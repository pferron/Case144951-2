import { ApolloClient, InMemoryCache } from '@apollo/client';
import { getUserPermissions } from '@utils/userPermissions';

describe('User permissions util test', () => {
  it('should return user permissions', async () => {
    const client = new ApolloClient({ cache: new InMemoryCache() });
    const apolloClientSpy = jest.spyOn(client, 'query');
    apolloClientSpy.mockReturnValueOnce(
      new Promise(resolve => {
        resolve({
          loading: false,
          networkStatus: 1,
          data: {
            userPermissions: {
              VideoCenter: true,
              VideoLibrary: true,
              VideoStorage: true
            }
          }
        });
      })
    );
    const result = await getUserPermissions(client);
    expect(result).toMatchObject({
      VideoCenter: true,
      VideoLibrary: true,
      VideoStorage: true
    });
  });

  it('should throw error when apollo client is null', async () => {
    const client = null;
    const result = getUserPermissions(client);
    await expect(result).rejects.toThrow('Cannot retrieve user permissions data without authToken');
  });

  it('should throw error when apollo client query fails', async () => {
    const client = new ApolloClient({ cache: new InMemoryCache() });
    const apolloClientSpy = jest.spyOn(client, 'query');
    apolloClientSpy.mockRejectedValueOnce(new Error('some error occurred'));
    const result = getUserPermissions(client);
    await expect(result).rejects.toThrow('some error occurred');
  });
});
