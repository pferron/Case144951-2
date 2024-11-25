import { queryStringFromObject, redirectServerSide } from '@utils/redirect';
import { v4 } from 'uuid';

describe('Test Redirect Responses', () => {
  it('Server side rendering provide correct response', async () => {
    const redirectionPath = '/404';
    const pageLoadId = v4();
    const requestId = v4();
    const returnUrl = '/return';
    const { redirect } = redirectServerSide(redirectionPath, { pageLoadId, requestId, returnUrl }, false);

    expect(redirect.destination).toContain(redirectionPath);
    expect(redirect.destination).toContain(`pageLoadId=${pageLoadId}`);
    expect(redirect.destination).toContain(`requestId=${requestId}`);
    expect(redirect.destination).toContain('returnUrl=%2Freturn');
  });

  it('check queryStringFromObject provide string with correct format', async () => {
    const pageLoadId = v4();
    const requestId = v4();
    const returnUrl = '/return';
    const queryString = queryStringFromObject({ pageLoadId, requestId, returnUrl });

    expect(queryString).toContain(`pageLoadId=${pageLoadId}`);
    expect(queryString).toContain(`requestId=${requestId}`);
    expect(queryString).toContain('returnUrl=%2Freturn');
  });
});
