#!/usr/bin/env node
import { App, Stack } from 'aws-cdk-lib';
import { getAccountId, getTags, OctopusDeploy as octo } from '@cvent/environments';
import { CdkPipeline } from '@cvent/octopusdeploy-cdk';
import { name as packageName } from '../package.json';

const env = {
  account: getAccountId('cvent-management'),
  region: 'us-east-1'
};

const tags = getTags({
  ...env,
  businessUnit: 'event',
  platform: 'event-management',
  product: 'shared',
  env: 'production'
});

const app = new App();
const stack = new Stack(app, `${packageName.replace('@cvent/', '')}-pipeline`, { tags, env });

const pipeline = new CdkPipeline(stack, 'Pipeline', {
  projectGroupId: octo.getProjectGroupId('Attendee Hub'),
  packageName: packageName.substring(1).replace('/', '.'),
  name: 'Planner Event Hubs UI',
  slackChannel: '#tech-events-plus-release',

  phases: [
    {
      Name: 'Staging',
      AutomaticDeploymentTargets: [octo.getEnvironmentId('sg50'), octo.getEnvironmentId('ld50')]
    },
    {
      Name: 'Production',
      OptionalDeploymentTargets: [octo.getEnvironmentId('pr53'), octo.getEnvironmentId('pr50')]
    },
    {
      Name: 'Production DR',
      AutomaticDeploymentTargets: [octo.getEnvironmentId('pr51'), octo.getEnvironmentId('pr54')]
    }
  ],

  includeCreatedByTag: false,
  dependencyPipelineStackName: 'planner-event-hubs-cdk-pipeline',
  useHogan: true
});

pipeline.addAwsAccountEnvironmentBindings('Cvent Development CDK', ['sg50', 'ld50']);

pipeline.addAwsAccountEnvironmentBindings('Cvent Production CDK', ['pr50', 'pr51']);
pipeline.addAwsAccountEnvironmentBindings('Core App Prod CDK', ['pr53', 'pr54']);
