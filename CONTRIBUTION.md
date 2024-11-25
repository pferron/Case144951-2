# Overview
As this repo has multiple teams working on it and has lots of development, so it is recommended to keep PRs small and to release
features early and often.

* All changes, with exception to bug fixes or minor UX changes, should be hidden behind an experiment so that it can
  be released dark.

# Before starting development

Before beginning development on major changes to an application, a design for the change should be reviewed and documented in ADR. This
should be posted in #tech-video-center-project so that this is widely visible to developers working on the project
and all primary reviewers for the repo should be tagged to make them aware of the design.

Some examples of major changes
* Any change to application initialization
* Any change to application routing
* Anything that requires a sweep of different widgets
* Adding a new npm dependency
* Adding a new service dependency
* Anything that doesn't have a single obvious way to implement it based on existing patterns

# Before asking for a review

Before PRs will be considered for merge to main, the following criteria should be met

* Major features are hidden behind an experiment variant that is off for all external users in production
* PR build has succeeded
* The DOD has been followed. [DOD](https://wiki.cvent.com/display/VH/Video-Hub+-+Definition+of+Done)
* Thoroughly tested locally by the developer
* The following information is included in the PR description
    * A link to the relevant Jira ticket
    * The acceptance criteria for the feature
* Title of the PR includes the id of the relevant Jira ticket, and a brief description of the change
* Please share the PR in the channel #tech-attendee-hub-fireball channel and give owning team 24 hrs to review the PR.
* Once all review comments have been addressed, please tag the owning team in the same thread to review again.

# Adding service owner reviewers

Once your PR is ready for review, look at the tooltip on the merge button to determine who needs to review the PR
before merging and add them as a reviewer.

# Development & Release Strategy

The repo uses a [trunk-based development strategy](https://trunkbaseddevelopment.com/).
Please follow the following steps starting with development until releasing to prod:

* Cut branch from main
* Do local development and test changes locally
* Raise PR against main branch.
* Do testing(TCW & TCE) on PR instance. 
* Merge to main when your changes are verified on local/PR instance
* Keep staging to verify the changes on high level so we don’t need more than 2 hours to verify changes on staging.
* After merging to main, monitor logs for potential issues in the deployed version.
* If there is any issue/ your day is ending(because of team working in different timezones) and changes are not verified, please revert your changes before leaving for the day to unblock others.
* Move the ticket to correct status if things are verified so there will not be much too and fro in releasing the version if we want to club some versions and release together.
* At last, please post the release version and previous release version in #tech-video-center-ui-release

## Releasing to staging,production
First keep a note of the previously deployed versions in different environments in case you need to rollback.
Refer to [Octo Dashboard Page](https://octo.core.cvent.org/app#/Spaces-1/projects/planner-event-hubs/deployments) for the same.

Once PR is merged to main, [CI build](https://ci-jenkins.core.cvent.org/job/Attendee/job/planner-event-hubs/) is auto-triggered, creates a release, pushes it to Octo, and automatically deploys it to staging enviroments.
You can view the created release on [Octo project releases](https://octo.core.cvent.org/app#/Spaces-1/projects/planner-event-hubs/deployments/releases).

* After certifying the release in staging, you need to deploy the release to the Production envs.
* Monitor splunk logs using this query - `index=cvt_production application="planner-event-hubs-ui"`

Note: If you don't have deployment access to specific regions, you can request the access via #tech-cd.
[Service Deploy Success](https://wiki.cvent.com/pages/viewpage.action?spaceKey=RD&title=Guidelines+for+Service+Deploy+Success)

## Notes for releasing to production
* Once you merge to main, you need to release your changes on the same/next business day post staging certification and regression analysis if needed.
* Always compare what version is deployed on the production with the version you are going to release, mention previous version deployed in your JIRA ticket/release channel.
* If there are some changes which are merged to main but not yet released, follow up on #tech-video-center-ui-release by tagging the person whose changes are not released to production yet.
* Ideally, the release should not have other changes but in case there are, then all tickets in the release version should be in `Done` status, but make sure once by checking ticket status for SOC2 compliance.
* If there is any ticket which is not in `Done` status, revert the changes to unblock your release.
* Deploy the version from Octo and share an update in #tech-video-center-ui-release channel once done.
* Once the changes are released to production, please mark all the tickets in the release to `Deployed` status for SOC2 compliance.

# Managing App Features
* When adding a new app feature, please mention the team as well in comment.
* When marking a feature ready for release, the team owning the feature will update the version based on current experiment version in production.
* The team owning the feature, after a week of the release update all released feature version to true and add ticket number in the comment to clean the feature flag.

# Before merging to main

Before merging to main, the following criteria should be met

* All changes other than bug fixes or minor UX refinements should be invisible to users (e.g. gated behind an
  experiment)
* All dependencies are already in **production** (not staging)
* Team is prepared to certify the code for release on the **same business day** (exceptions require prior approval of service owner)
* Team is prepared to release the code on the **same business day** (exceptions require prior approval of service owner)
* One of the primary reviewers for the repo has approved the PR
* The last [CI build](https://ci-jenkins.core.cvent.org/job/Attendee/job/planner-event-hubs/job/main/) to main passed (except for PRs specifically for fixing a broken build)

# After merging to main

If the [CI build](https://ci-jenkins.core.cvent.org/job/Attendee/job/planner-event-hubs/job/main/) fails after you merge to main,
you are responsible for immediately fixing it. You are responsible for watching the status of the build after you
merge to make sure it succeeds. **Please make sure both `Jenkins` and `Octo` are in `Green` state.**

After merging to main, the team that developed the feature should certify it for "dark release" (in the state that
will be visible with the experiment variants that are enabled for external users) as soon as possible.

In case you are working on a feature which requires to keep the code in staging for more than a day for testing, please tag all Video Leads( @video-dev-leads ). Once you are done verifying, please release all the changes in staging.

## Reverting after merging to main

Avoid reverting as much as possible because it adds drag for everyone.
Reverting interferes with other features being released and messes up history.

Dark features should not be reverted from main for failing certification. They should only be reverted if there is an unanticipated impact to non-dark features. 
Create a separate ticket for fixing the issue in the dark release.

If, for any reason, you have to revert your changes from main, please make sure that you:
* mention in the revert PR why you have to revert
* add the link to the original PR that you are reverting in the revert PR
* add test case(s) in the revert-of-revert PR around what caused the feature/PR getting reverted from main earlier


# Work-in-progress reviews

Work in progress reviews are allowed without meeting the criteria in "Before asking for a review". The title of the PR should start with WIP to clearly indicate that it is a work-in-progress review.
Please share the same in the #tech-attendee-hub-fireball channel.

# For reverting the release:
Go the release version that was deployed previously to your deployment and deploy it to the particular environment(s) where the revert is to be done.

# Sev1 Approvals
We have multiple teams working on the project in different timezones. `Sev1Group` has been created so that urgent issues can be released without depending on the owning team.