// FIREBALL
// eslint-disable-next-line no-restricted-imports
import { fetchWithOptions, RequestBuilder } from '@cvent/nucleus-networking-node';
import { gqlBasePath, ROUTE_COOKIE } from '@fixtures/authData';

export async function healthCheck(): Promise<void> {
  const req = new RequestBuilder({ url: `${gqlBasePath}/api/ok` }).get().header('Cookie', ROUTE_COOKIE).build();
  const fetch = fetchWithOptions();
  try {
    await fetch(req);
  } catch (e) {
    throw new Error(`Health check failed for ${gqlBasePath}/api/ok`);
  }
}
