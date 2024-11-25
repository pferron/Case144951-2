#!/usr/bin/env node
import { applyInfrastructurePropsOverrides } from '@cvent/cdk-applications/utils';
import type { InfrastructureOverrideableProps } from '@cvent/cdk-applications/types';
import { ciVersion } from '@cvent/cdk-lib';
import { version as packageVersion } from '../package.json';
import { infraProps } from '../lib/commonProps';
import { Application } from '../lib/Application';

const version = ciVersion(packageVersion);

export const overrides: InfrastructureOverrideableProps = {
  pod: 'na1',
  stage: 'local',
  deploymentTarget: {
    awsAccountName: 'cvent-sandbox',
    awsRegion: 'us-east-1',
    deploymentTargetName: 'local',
    status: 'active'
  },
  version: ciVersion(version)
};

export const infrastructure = applyInfrastructurePropsOverrides(infraProps, overrides);

if (require.main === module) {
  new Application(infrastructure);
}
