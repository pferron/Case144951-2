## Definitions for analytics facts

**Important!**

See [`react-analytics`](https://stash.cvent.net/projects/AX/repos/react-analytics/browse) README on how to format fact definitions.

Every fact publish includes base properties defined in [`analytics/baseProperties.js`]

## Verifying facts are sent

To enable sending analytics during local development set the ENABLE_ANALYTICS environment variable to true:

```shell
ENABLE_ANALYTICS=true pnpm dev
```

To confirm facts are sent and accepted by the analytics service you can verify that a POST to the `/batch_facts` endpoint is made when your fact is tracked. Note that facts are not sent by default when running locally.

To confirm facts are being received by the analytics service use the jenkins utility job: https://ci-jenkins.core.cvent.org/job/Analytics/job/analytics-staging-cli-utility/job/master/

Parameters:

```
AWS_ACCOUNT: cvent-development
AWS_REGION: us-east-1
FACT_NAME: engage_action (OR engage_page_view OR aa_attendee_activities)
HOURS: 0
```

Note: the FACT_NAME field is determined by the type and the destination of your fact definition. An action sent to Analytics will be `engage_action`, a page view sent to Analytics will be `engage_page_view`.
