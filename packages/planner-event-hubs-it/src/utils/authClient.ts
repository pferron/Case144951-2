// FIREBALL
// eslint-disable-next-line no-restricted-imports
import { fetchWithOptions, RequestBuilder } from '@cvent/nucleus-networking-node';
import { GrantedAccessToken } from '@cvent/auth-client';

export async function verifyToken(token: string): Promise<GrantedAccessToken> {
  const req = new RequestBuilder({
    url: `${process.env.AUTH_SERVICE}/v1/access_token/${token}/verify`
  })
    .get()
    .header('Authorization', `API_KEY ${process.env.API_KEY}`)
    .build();
  const fetch = fetchWithOptions();
  try {
    const response = await fetch(req);
    return response.json();
  } catch (e) {
    throw new Error('Auth client failed');
  }
}
