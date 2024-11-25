import { verifyAccessToken } from '@server/verifyAccessToken';
import { AuthClient } from '@dataSources/authService/client';
import authResponse from '@server/__tests__/fixtures/authResponse.json';

describe('verifyAccessToken', () => {
  it('verify Access Token by calling auth client', async () => {
    jest.spyOn(AuthClient.prototype, 'verifyToken').mockImplementation(async () => authResponse);
    const response = await verifyAccessToken('test');
    expect(response).toEqual(authResponse);
  });
});
