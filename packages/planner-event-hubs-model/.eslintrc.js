module.exports = {
  extends: ['@cvent/eslint-config'],
  settings: {
    'import/resolver': {
      typescript: {} // this loads <rootdir>/tsconfig.json to eslint
    }
  }
};
