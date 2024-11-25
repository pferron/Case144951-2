import type { CommonFargateRuntimeProps } from '@cvent/cdk-applications/types';
import { name as itPackageName, version as itVersion } from '@cvent/planner-event-hubs-it/package.json';
import { name as e2ePackageName, version as e2eVersion } from '@cvent/planner-event-hubs-e2e/package.json';
import { name as appPackageName } from '../../package.json';

const appName = appPackageName.replace('@cvent/', '');

const apiKey = {
  API_KEY: `/${appName}/API_KEY`
};

export const commonProps: CommonFargateRuntimeProps = {
  secrets: {
    parameterStore: {
      ...apiKey
    }
  },

  integrationTests: {
    packageName: itPackageName,
    packageVersion: itVersion,
    logDestination: 'datadog',
    secrets: {
      parameterStore: {
        ...apiKey,
        API_KEY: 'planner-event-hubs-service/API_KEY'
      }
    }
  },

  endToEndTests: {
    packageName: e2ePackageName,
    packageVersion: e2eVersion,
    logDestination: 'datadog',
    taskDefinitionProps: { cpu: 2048, memoryLimitMiB: 4096 },
    secrets: {
      parameterStore: {
        ...apiKey
      }
    }
  }
};

export const commonPropsIgnoreFailures: CommonFargateRuntimeProps = {
  secrets: {
    parameterStore: {
      ...apiKey
    }
  },

  integrationTests: {
    packageName: itPackageName,
    packageVersion: itVersion,
    logDestination: 'datadog',
    ignoreFailure: true,
    secrets: {
      parameterStore: {
        ...apiKey
      }
    }
  },

  endToEndTests: {
    packageName: e2ePackageName,
    packageVersion: e2eVersion,
    logDestination: 'datadog',
    taskDefinitionProps: { cpu: 2048, memoryLimitMiB: 4096 },
    ignoreFailure: true,
    secrets: {
      parameterStore: {
        ...apiKey
      }
    }
  }
};
