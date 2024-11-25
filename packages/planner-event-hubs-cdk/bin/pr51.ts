#!/usr/bin/env node
import { applyInfrastructurePropsOverrides } from '@cvent/cdk-applications/utils';
import type { InfrastructureOverrideableProps } from '@cvent/cdk-applications/types';
import { version } from '../package.json';
import { infraProps } from '../lib/commonProps';
import { Application } from '../lib/Application';

export const overrides: InfrastructureOverrideableProps = {
  pod: 'na1',
  stage: 'production',
  deploymentTarget: {
    awsAccountName: 'cvent-production',
    awsRegion: 'us-west-2',
    deploymentTargetName: 'pr51',
    status: 'passive'
  },
  version,
  additionalDomains: ['eventsplus.app.cvent.com']
};

export const infrastructure = applyInfrastructurePropsOverrides(infraProps, overrides);

if (require.main === module) {
  new Application(infrastructure);
}
