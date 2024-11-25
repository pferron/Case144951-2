import { checkMemberId } from '@resolvers/common/utils/authMetadataUtils';

describe('authMetadataUtils', () => {
  let auth;
  beforeEach(() => {
    auth = {
      accessToken: 'testAccessToken',
      authorization: {
        metadata: {
          environment: 'unit-test',
          accountId: 'account-Id',
          MemberId: 'member-id'
        }
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('checkMemberId', () => {
    it('returns true when member id is present in metadata', () => {
      expect(checkMemberId(auth)).toEqual(true);
    });

    it('returns false when there is no member id', async () => {
      auth.authorization.metadata.MemberId = null;
      expect(checkMemberId(auth)).toEqual(false);
    });
  });
});
