module.exports = {
  extends: ['@cvent/eslint-config'],
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    }
  },
  overrides: [
    {
      // Enable eslint-plugin-testing-library rules for test files only!
      files: ['**/types.ts', '**/operations.ts'],
      extends: ['plugin:jest-dom/recommended'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'import/newline-after-import': 'off',
        '@typescript-eslint/ban-types': [
          'error',
          {
            extendDefaults: true,
            types: {
              '{}': false
            }
          }
        ]
      }
    }
  ]
};
