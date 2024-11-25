import { AuthClient, AuthMethod, GrantedAccessToken, GrantedApiKey } from '@cvent/auth-client';

export async function verifyToken(
  authClient: AuthClient,
  authMethod: string,
  authToken: string
): Promise<GrantedAccessToken | GrantedApiKey> {
  if (!authToken) {
    throw new Error('authorization is required but not provided.');
  }

  try {
    if (authMethod && authMethod.toUpperCase() === AuthMethod.API_KEY) {
      return await authClient.verifyApiKey({ apiKey: authToken });
    }

    return await authClient.verifyAccessToken({
      accessToken: authToken
    });
  } catch (error) {
    throw new Error(`Not authorized: method: ${authMethod}`);
  }
}
