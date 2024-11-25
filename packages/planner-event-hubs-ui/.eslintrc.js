module.exports = {
  extends: ['@cvent/eslint-config', 'prettier'],
  parser: '@typescript-eslint/parser',
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    },
    overrides: [
      {
        env: {
          browser: true
        },
        rules: {
          /* 👇 Remove overrides once fixed */
          '@typescript-eslint/ban-ts-ignore': 'warn'
        }
      }
    ]
  }
};
