import type { CommonInfrastructureProps } from '@cvent/cdk-applications/types';
import { RedisEngineVersion } from '@cvent/cdk-lib/elasticache';
import { commonTags } from './tags';

export const infraProps: CommonInfrastructureProps = {
  appName: 'planner-event-hubs',
  namingConvention: 'NX-WebApplication',
  tags: commonTags,
  application: { type: 'WebApplication', compute: 'fargate', visibility: 'public', plannerApp: true },
  redisCluster: {
    engineVersion: RedisEngineVersion.VER_7_0,
    replicaCount: 3,
    instanceType: 'cache.t3.micro',
    logicalIdSuffix: '2'
  }
};
