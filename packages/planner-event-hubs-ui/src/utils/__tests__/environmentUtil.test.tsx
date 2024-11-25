import { isProduction, setStagingForLowerEnvs } from '@utils/environmentUtil';

const ENV = process.env;

describe('environment util', () => {
  afterAll(() => {
    process.env = ENV; // Restore old environment
  });

  it('should return true if a production environment', () => {
    process.env.ENVIRONMENT_TYPE = 'production';
    expect(isProduction()).toBeTruthy();
  });

  it('should return false if not a production environment', () => {
    process.env.ENVIRONMENT_TYPE = 'dev';
    expect(isProduction()).toBeFalsy();
  });

  it('should return T2 if in S606', () => {
    expect(setStagingForLowerEnvs('S606')).toEqual('T2');
  });
});
