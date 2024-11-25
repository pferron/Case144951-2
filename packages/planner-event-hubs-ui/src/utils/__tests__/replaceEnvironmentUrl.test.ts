import { replaceEnvironment } from '@utils/replaceEnvironmentUrl';

describe('replace Environment from the URL', () => {
  it('replace sg50 with staging', () => {
    process.env.enviromentName = 'sg50';
    const env = replaceEnvironment({}, 'https://web-{env}.cvent.com');
    expect(env).toEqual('https://web-staging.cvent.com');
  });

  it('keep the url same for other env', () => {
    process.env.enviromentName = 'S606';
    const env = replaceEnvironment({}, 'https://web-{env}.cvent.com');
    expect(env).toEqual('https://web-S606.cvent.com');
  });
});
