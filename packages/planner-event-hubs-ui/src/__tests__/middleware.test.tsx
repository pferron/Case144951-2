import { config } from '../middleware';

describe('config', () => {
  it('should have a matcher value of ["/storybook/:slug*"]', () => {
    expect(config.matcher).toEqual(['/storybook/:slug*']);
  });
});
