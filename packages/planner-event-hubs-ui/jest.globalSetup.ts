import { loadConfig } from '@cvent/app-config/loadConfig';
import { LoggerFactory } from '@cvent/logging/LoggerFactory';

export default async function globalSetup(_globalConfig, _projectConfig) {
  LoggerFactory.initConfig({
    loggerOptions: {
      level: 'warn'
    }
  });

  // Load hogan configs from env files
  await loadConfig({ hoganBranch: process.env.HOGAN_BRANCH });
}
