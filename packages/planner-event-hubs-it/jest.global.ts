import { LoggerFactory } from '@cvent/logging/LoggerFactory';
import { loadConfig } from '@cvent/app-config/loadConfig';
import { parseCdkOutputs } from '@cvent/app-config/parseCdkOutputs';

const LOG = LoggerFactory.create('jest-global-setup');

export default async function globalSetup(_globalConfig, _projectConfig) {
  LOG.debug('***** Start: Jest global setup *****');

  // Load hogan configs from env files
  await loadConfig({ hoganBranch: process.env.HOGAN_BRANCH });

  // Allow overriding base url via env var
  if (!process.env.BASE_URL) {
    LOG.info('No process.env.BASE_URL found, defaulting to localhost');
    process.env.BASE_URL = 'http://localhost:3000';
  }

  // Load application base url
  if (process.env.JENKINS_BUILD === 'true') {
    const { PRLoadBalancerDNS, NxDomainName } = await parseCdkOutputs('../planner-event-hubs-cdk/outputs.json');
    if (PRLoadBalancerDNS) {
      // PR build, use load balancer with PR specific route53 cname
      process.env.BASE_URL = `https://${PRLoadBalancerDNS}`;
    } else if (NxDomainName) {
      // Branch build, use cloudfront cname which gets routed to ci service instance
      process.env.BASE_URL = `https://${NxDomainName}`;
    }
  }
  LOG.debug('***** Done: Jest global setup *****');
}
