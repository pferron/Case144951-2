const wdioE2eDependencies = [
  '@cvent/app-config',
  '@cvent/auth-client',
  '@cvent/hogan-client',
  '@cvent/lighthouse-utils',
  '@cvent/wdio-configs',
  '@types/jasmine',
  '@types/testing-library__jest-dom',
  '@wdio/axe-service',
  '@wdio/cli',
  '@wdio/cookie-service',
  '@wdio/dot-reporter',
  '@wdio/globals',
  '@wdio/jasmine-framework',
  '@wdio/junit-reporter',
  '@wdio/local-runner',
  '@wdio/logger',
  '@wdio/qeportal-reporter',
  '@wdio/qeportal-service',
  '@wdio/spec-reporter',
  'dotenv',
  'ejs',
  'puppeteer',
  'sharp',
  'ts-node',
  '@cvent/tsconfig',
  'tsc-alias',
  'tsconfig-paths',
  'tsx',
  'typescript',
  'typescript-json-schema'
];
const playwrightE2eDependencies = [];
const itDependencies = [
  '@cvent/jest-config',
  '@jest/globals',
  '@jest/reporters',
  '@jest/types',
  '@swc/core',
  '@swc/jest',
  '@types/jest',
  'eslint-plugin-jest',
  'jest',
  'jest-environment-node',
  'jest-fetch-mock',
  'jest-junit',
  '@cvent/tsconfig',
  'ts-node',
  'tsc-alias',
  'tsconfig-paths',
  'tsx',
  'typescript',
  'typescript-json-schema'
];

function addDependencyVersionsToContext(pkg, context) {
  if (!pkg.name && pkg.devDependencies['@cvent/cdf']) {
    context.cdfVersions = {};
    [
      ...wdioE2eDependencies,
      ...playwrightE2eDependencies,
      ...itDependencies
    ].forEach(dep => (context.cdfVersions[dep] = pkg.devDependencies[dep]));
  }
}

function addDependenciesToProjects(pkg, context) {
  if (context.cdfVersions) {
    if (['@cvent/planner-event-hubs-e2e'].includes(pkg.name)) {
      wdioE2eDependencies.forEach(dep => {
        if (context.cdfVersions[dep]) {
          pkg.dependencies[dep] = context.cdfVersions[dep];
        }
      });
    }
    if ([''].includes(pkg.name)) {
      playwrightE2eDependencies.forEach(dep => {
        if (context.cdfVersions[dep]) {
          pkg.dependencies[dep] = context.cdfVersions[dep];
        }
      });
    }
    if (['@cvent/planner-event-hubs-it'].includes(pkg.name)) {
      itDependencies.forEach(dep => {
        if (context.cdfVersions[dep]) {
          pkg.dependencies[dep] = context.cdfVersions[dep];
        }
      });
    }
  }
}

function readPackage(pkg, context) {
  addDependencyVersionsToContext(pkg, context);
  addDependenciesToProjects(pkg, context);

  return pkg;
}

module.exports = {
  hooks: {
    readPackage
  }
};
