module.exports = {
  extends: ['@cvent/eslint-config', 'prettier'],
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    }
  },
  overrides: [
    {
      files: ['**/specs/**'],
      rules: {
        'jest/no-standalone-expect': 'off',
        'jest/no-test-prefixes': 'off'
      }
    }
  ]
};
