import { GrantedAccessToken } from '@cvent/auth-client';
import { AuthClient } from '@dataSources/authService/client';

export const verifyAccessToken = async (token: string): Promise<GrantedAccessToken> => {
  const authClient = new AuthClient();
  authClient.initialize({ context: {}, cache: undefined });

  return authClient.verifyToken(token);
};
