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
  stage: 'development',
  deploymentTarget: {
    awsAccountName: 'cvent-development',
    awsRegion: 'us-east-1',
    deploymentTargetName: 'ci',
    status: 'active'
  },
  version: ciVersion(version),
  stackAccessPolicy: 'devs'
};

export const infrastructure = applyInfrastructurePropsOverrides(infraProps, overrides);

if (require.main === module) {
  new Application(infrastructure);
}
