# 7. Managing App features for the service

Date: 2023-04-04

## Status

Accepted

## Context

Lot of times the engineering works on features which are of medium or large size, which takes months to complete.
These features are build in small pieces. Once the feature is build, the UAT process kicks in and the UAT team needs to be given time to test the features.
We cannot keep the code from merging till the feature is complete as it can lead to stale branches and conflicts.
One of the strategy we use is feature gating, which allows us to send our code to higher regions without client impact.
This strategy also allows us to control the roll-out and the roll-out plan.

In this repo, we have two types of feature gating:

- The repo level experiment [events_plus_feature_version](https://admin.core.cvent.org/experiment/events_plus_feature_version)
- Custom experiments which can be configured in admin portal

## Decision

### Experiment Client

To get the experiment values, the repo uses the [experiment-client-ts](https://stash.cvent.net/projects/EX/repos/experiments-client-ts/browse) library.
For more information, please go through the [README](https://stash.cvent.net/projects/EX/repos/experiments-client-ts/browse/README.md) of the library.

It is recommended that all new development should be feature-gated, with exceptions like bugs, hot fixes.

Feature Enablement

1. Every feature has a version associated with it in the [appFeatures.ts](packages/planner-event-hubs-ui/appFeatures.ts) file.
2. Every identifier(eg: account id) is placed under a variant of the experiment.
3. If the variant has `version` property in the metadata(eg: metadata: {version: 1}), that is used to determine if the feature is enabled or not.
4. If the variant has `version` property is not present in the metadata property, then the variant id is treated as version.
5. The version defined in appFeatures.ts file should be less than or equal to the evaluated version for a feature to be enabled.
6. Make sure that the version in the metadata field is a number.
7. For planner-event-hubs member side, it is always wrt an accountId. So the identifier can be account number.

## Consequences

All the calls for experiment would now be using the client which listens to change in the experiment values and no calls should go the experiment-service in the repo.
