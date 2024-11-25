process.env.TZ = 'UTC';

module.exports = {
  globalSetup: './jest.globalSetup.ts',
  preset: '@cvent/jest-config',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  moduleDirectories: ['node_modules', '<rootDir>/node_modules'],
  snapshotSerializers: ['@emotion/jest/serializer'],
  /** update this if you add any alias packages to tsconfig.json */
  moduleNameMapper: {
    '^@components(.*)$': '<rootDir>/src/components$1',
    '^@dataSources(.*)$': '<rootDir>/src/apollo/dataSources$1',
    '^@navigation(.*)$': '<rootDir>/src/navigation$1',
    '^@pages(.*)$': '<rootDir>/src/pages$1',
    '^@resolvers(.*)$': '<rootDir>/src/apollo/resolvers$1',
    '^@hooks(.*)$': '<rootDir>/src/hooks$1',
    '^@locales(.*)$': '<rootDir>/locales$1',
    '^@utils(.*)$': '<rootDir>/src/utils$1',
    '^@server(.*)$': '<rootDir>/src/server$1',
    '^@tools(.*)$': '<rootDir>/src/tools$1',
    '^@context(.*)$': '<rootDir>/src/context$1',
    '^uuid$': '<rootDir>/../../node_modules/uuid/dist/index.js',
    '^@metrics(.*)$': '<rootDir>/src/metrics$1',
    '\\.(jpg|gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': 'identity-obj-proxy'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!react-dnd|core-dnd|@react-dnd|dnd-core|react-dnd-html5-backend)'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node', 'json'],
  modulePathIgnorePatterns: [
    '<rootDir>[/\\\\](dist|node_modules|fixtures|)[/\\\\]'
  ],
  testPathIgnorePatterns: [
    'src/apollo/resolvers/__tests__/fixtures',
    'src/apollo/dataSources/__tests__/fixtures',
    'fixtures'
  ],
  testEnvironment: 'jsdom',
  collectCoverage: true,

  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/.eslintrc.js',
    '!src/utils/types.ts',
    '!src/server/auth/types.ts',
    '!src/utils/authTypes.ts',
    '!src/utils/apiUtils.ts',
    '!src/stories/**',
    '!src/pages/eventsplus/**',
    '!src/pages/api/image.ts',
    '!src/pages/api/log.ts',
    '!src/pages/api/ok.ts',
    '!src/components/style.ts',
    '!src/apollo/resolvers/fixtures',
    '!src/**/__TestUtils__/**',
    '!src/**/testUtil/**',
    '!src/**/__tests__/**',
    '!src/**/tests/**',
    '!src/config/**',
    '!src/metrics/client/react/**',
    '!src/metrics/client/web/**',
    '!src/metrics/client/IdentityProvider.tsx',
    '!src/metrics/client/checkIfAutomationAccount.ts',
    '!src/metrics/client/initRudderstack.ts',
    '!src/metrics/client/rudder-web.ts',
    '!src/components/GlobalStyles.tsx',
    '!src/components/ThemeSwitcher.tsx',
    '!src/components/ThemeValues.tsx',
    '!<rootDir>/fixtures/**',
    '!<rootDir>/locales/**',
    '!<rootDir>/tests/pages/**',
    '!<rootDir>/appFeatures.ts',
    '!<rootDir>/cdf.config.mjs',
    '!<rootDir>/jest.config.js',
    '!<rootDir>/jest.globalSetup.ts',
    '!<rootDir>/next.config.mjs',
    '!<rootDir>/server.js'
  ],
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'json-summary'],
  coverageDirectory: '.coverage',

  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            tsx: true
          },
          transform: {
            react: {
              runtime: 'automatic',
              importSource: '@emotion/react'
            }
          },
          target: 'es2021'
        },
        sourceMaps: true
      }
    ],
    '\\.(jpg|gif|ttf|eot|svg|png)$': '<rootDir>/src/__mocks__/svgTransform.js'
  },

  coverageThreshold: {
    global: {
      branches: 67.94,
      functions: 75.54,
      lines: 83.14,
      statements: 82.15
    }
  },
  maxWorkers: '50%',
  testTimeout: 30000,
  slowTestThreshold: 20
};
