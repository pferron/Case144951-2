/* eslint-disable */
export {};
/**
 * This client was automatically generated. ** Do Not Edit **
 *
 * Test to make sure `pnpm publish:plan` was ran before putting a PR
 */
describe('Tracking plan validation', () => {
  it('Checks Ajv validators are not included', () => {
    try {
      const { validateAgainstSchema } = require('../validators');
      if (validateAgainstSchema) {
        throw new Error('Did you forget to run pnpm publish:plan?');
      } else {
        // This is what we expect. When the plan is published, the api is generated without ajv dependency
        expect(validateAgainstSchema).toBe(undefined);
      }
    } catch (e) {
      console.error(e);
      // Let's fail the test on purpose
      expect(e).toBeFalsy();
    }
  });
});
