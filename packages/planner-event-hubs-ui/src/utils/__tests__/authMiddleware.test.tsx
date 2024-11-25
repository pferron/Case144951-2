import { getAccessTokenFromAuthCookie } from '@cvent/nextjs/auth';
import { verifyAccessTokenHelper } from '@utils/authUtils';
import { authMiddleware } from '../authMiddleware';

jest.mock('@cvent/nextjs/auth');
jest.mock('@utils/authUtils');

describe('authMiddleware', () => {
  let req;
  let res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      end: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call the handler method with the authenticated request and response objects', async () => {
    const handlerMethod = jest.fn();
    const auth = { user: 'testUser' };
    const accessToken = 'testAccessToken';

    (getAccessTokenFromAuthCookie as jest.Mock).mockReturnValue(accessToken);

    (verifyAccessTokenHelper as jest.Mock).mockResolvedValue(auth);

    const middleware = authMiddleware(handlerMethod);
    await middleware(req, res);

    expect(getAccessTokenFromAuthCookie).toHaveBeenCalledWith(req);
    expect(verifyAccessTokenHelper).toHaveBeenCalledWith(accessToken);
    expect(handlerMethod).toHaveBeenCalledWith(req, res, auth);
  });

  it('should return a 401 response if an error occurs during authentication', async () => {
    const handlerMethod = jest.fn();
    const error = new Error('Authentication failed');

    (getAccessTokenFromAuthCookie as jest.Mock).mockReturnValue('testAccessToken');

    (verifyAccessTokenHelper as jest.Mock).mockRejectedValue(error);

    const middleware = authMiddleware(handlerMethod);
    await middleware(req, res);

    expect(getAccessTokenFromAuthCookie).toHaveBeenCalledWith(req);
    expect(verifyAccessTokenHelper).toHaveBeenCalledWith('testAccessToken');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.end).toHaveBeenCalled();
    expect(handlerMethod).not.toHaveBeenCalled();
  });
});
