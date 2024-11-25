#!/usr/bin/env groovy

@Library('pipeline-utils') _

// https://nx.docs.cvent.org/docs/build_deploy/ci_cd
buildPipeline(
  packageFilter: 'root-only',
  stablePrereleaseId: true,
  awsUser: 'cdk',
  label: 'ecs-x86-xlarge',
  ci: [
    lock: 'branch' // allow parallel ci builds across branches
  ],
  release: [
    branches: ['main']
  ],
  publish: [
      [ branches: ['release/.*', 'hotfix/.*'], id: 'pre-release' ],
    ],
  slack: [
    [branches: ['main', 'release/.*', 'hotfix/.*'], channels: ['tech-events-plus-release']],
    [branches: ['.*'], channels: ['_owner_']]
  ],
  checkmarx: [
      // https://wiki.cvent.com/display/DEV/Checkmarx+Teams+and+Scan+Preset
      branch: 'main',
      // Setting this to true will force builds to wait for results prior to completion
      syncMode: false,
      teamPath: 'CxServer\\SAST\\Cvent\\Web Attendee Experience',
      presetValue: '100008' //Cvent Web Application Policy
    ],
  ddTags: [
    'framework:nx'
  ]
)
