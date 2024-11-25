import { RuntimeApp } from '@cvent/cdk-applications/apps/RuntimeApp';
import { infrastructure } from '@cvent/planner-event-hubs-cdk/bin/local';
import { applyRuntimePropsOverrides } from '@cvent/cdk-applications/utils';
import type { FargateRuntimeOverrideableProps } from '@cvent/cdk-applications/types';
import { ciVersion } from '@cvent/cdk-lib';
import { version as itVersion } from '@cvent/planner-event-hubs-it/package.json';
import { version as e2eVersion } from '@cvent/planner-event-hubs-e2e/package.json';
import { version } from '../package.json';
import { commonProps } from './shared/commonProps';

const overrides: FargateRuntimeOverrideableProps = {
  integrationTests: { packageVersion: ciVersion(itVersion) },
  endToEndTests: { packageVersion: ciVersion(e2eVersion) }
};

new RuntimeApp({
  runtime: applyRuntimePropsOverrides(commonProps, overrides),
  infrastructure,
  version: ciVersion(version)
});
