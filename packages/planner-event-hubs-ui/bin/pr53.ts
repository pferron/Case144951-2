import { RuntimeApp } from '@cvent/cdk-applications/apps/RuntimeApp';
import { infrastructure } from '@cvent/planner-event-hubs-cdk/bin/pr53';
import { applyRuntimePropsOverrides } from '@cvent/cdk-applications/utils';
import type { FargateRuntimeOverrideableProps } from '@cvent/cdk-applications/types';
import { version } from '../package.json';
import { commonPropsIgnoreFailures } from './shared/commonProps';

const overrides: FargateRuntimeOverrideableProps = {};

new RuntimeApp({
  runtime: applyRuntimePropsOverrides(commonPropsIgnoreFailures, overrides),
  infrastructure,
  version
});
