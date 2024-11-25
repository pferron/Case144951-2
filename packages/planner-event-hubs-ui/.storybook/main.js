const path = require('path');
const tsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],

  core: {
    builder: 'webpack5'
  },

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-a11y',
    {
      name: '@storybook/addon-essentials',
      options: {
        backgrounds: false
      }
    },
    './addons/theme-switcher/register.js'
  ],
  babel: config => {
    // eslint-disable-next-line no-param-reassign
    config.presets = [
      [
        'next/babel',
        {
          'preset-react': {
            runtime: 'automatic',
            importSource: '@emotion/react'
          }
        }
      ]
    ];
    return config;
  },
  webpackFinal: async config => {
    config.resolve.alias = {
      '@utils': '/src/utils'
    };

    config.resolve.plugins = [
      new tsconfigPathsPlugin({
        configFile: path.resolve(__dirname, '../tsconfig.json')
      })
    ];
    config.resolve.fallback = {
      https: require.resolve('https-browserify'),
      http: require.resolve('stream-http')
    };
    return config;
  }
};
