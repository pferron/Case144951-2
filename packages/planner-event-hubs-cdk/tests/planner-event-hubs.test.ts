import { Template } from 'aws-cdk-lib/assertions';
import { applyInfrastructurePropsOverrides } from '@cvent/cdk-applications/utils';
import { InfrastructureOverrideableProps } from '@cvent/cdk-applications/types';
import { ciVersion } from '@cvent/cdk-lib';
import { Application } from '../lib/Application';
import { infraProps } from '../lib/commonProps';

describe('application', (): void => {
  test('with version', (): void => {
    const overrides: InfrastructureOverrideableProps = {
      pod: 'na1',
      stage: 'development',
      deploymentTarget: {
        awsAccountName: 'cvent-development',
        awsRegion: 'us-east-1',
        deploymentTargetName: 'ci',
        status: 'active'
      },
      version: ciVersion('1.1.1')
    };

    const infrastructure = applyInfrastructurePropsOverrides(infraProps, overrides);

    const app = new Application(infrastructure);
    expect(Template.fromStack(app.edgeStack)).toBeTruthy(); // dummy test
    expect(Template.fromStack(app.edgeStack)).toBeDefined();
  });
});
