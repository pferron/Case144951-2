# planner-event-hubs Runbook

planner-event-hubs is the planner facing side to Events+.

This repo contains a graph layer for Events+ for the planner side, along with all the UI components for planner side.

## Documentation

[High level architecture for video center](https://wiki.cvent.com/display/VH/Video+Center+Architecture)

The application is based on CDF framework, for more information on CDF framework, please check out https://framework.docs.cvent.org/

For more information regarding the features planner-event-hubs supports, please check out this wiki:  https://wiki.cvent.com/display/VH/Video+Center+App+Support+Training

## Dependencies
Dependencies for the service can be found here in Datadog:

https://cvent.datadoghq.com/services?query=planner-event-hubs%20&env=pr50&fromUser=true&lens=Performance&service=planner-event-hubs&view=map&start=1718722409188&end=1718808809188

## Automated Tests
E2E Jenkins Job: https://jenkins.core.cvent.org/job/run-cdf-e2e/
- REPO: ssh://git@stash.cvent.net:7999/ax/planner-event-hubs.git
- E2E_PACKAGE_PATH: packages/planner-event-hubs-e2e

IT Jenkins Job: https://jenkins.core.cvent.org/job/run-cdf-it/
- REPO: ssh://git@stash.cvent.net:7999/ax/planner-event-hubs.git
- E2E_PACKAGE_PATH: packages/planner-event-hubs-it

## Error Monitoring

- [sg50 APM](https://cvent.datadoghq.com/apm/services/planner-event-hubs/operations/next.request/resources?query=env%3Apr50%20operation_name%3Anext.request%20service%3Aplanner-event-hubs&dependencyMap=qson%3A%28data%3A%28telemetrySelection%3Aall_sources%29%2Cversion%3A%210%29&deployments=qson%3A%28data%3A%28hits%3A%28selected%3Aversion_count%29%2Cerrors%3A%28selected%3Aversion_count%29%2Clatency%3A%2195%2CtopN%3A%215%29%2Cversion%3A%210%29&env=sg50&fromUser=false&groupMapByOperation=null&infrastructure=qson%3A%28data%3A%28viewType%3Apods%29%2Cversion%3A%210%29&panels=qson%3A%28data%3A%28%29%2Cversion%3A%210%29&resources=qson%3A%28data%3A%28visible%3A%21t%2Chits%3A%28selected%3Atotal%29%2Cerrors%3A%28selected%3Atotal%29%2Clatency%3A%28selected%3Ap95%29%2CtopN%3A%215%29%2Cversion%3A%211%29&summary=qson%3A%28data%3A%28visible%3A%21t%2Cerrors%3A%28selected%3Acount%29%2Chits%3A%28selected%3Aversion_rate%29%2Clatency%3A%28selected%3Alatency%2Cslot%3A%28agg%3A75%29%2Cdistribution%3A%28isLogScale%3A%21f%29%29%2Csublayer%3A%28selected%3Apercentage%2Cslot%3A%28layers%3Aservice%253A5%29%29%29%2Cversion%3A%211%29&view=spans&start=1718912873990&end=1718916473990&paused=false)

- [pr50 APM](https://cvent.datadoghq.com/apm/services/planner-event-hubs/operations/next.request/resources?env=pr50&groupMapByOperation=null&view=spans&start=1718803550192&end=1718807150192&paused=false)

- [pr53 APM](https://cvent.datadoghq.com/apm/services/planner-event-hubs/operations/next.request/resources?query=env%3Apr53%20operation_name%3Anext.request%20service%3Aplanner-event-hubs&dependencyMap=qson%3A%28data%3A%28telemetrySelection%3Aall_sources%29%2Cversion%3A%210%29&deployments=qson%3A%28data%3A%28hits%3A%28selected%3Aversion_count%29%2Cerrors%3A%28selected%3Aversion_count%29%2Clatency%3A%2195%2CtopN%3A%215%29%2Cversion%3A%210%29&env=pr53&fromUser=false&groupMapByOperation=null&infrastructure=qson%3A%28data%3A%28viewType%3Apods%29%2Cversion%3A%210%29&isInferred=false&panels=qson%3A%28data%3A%28%29%2Cversion%3A%210%29&resources=qson%3A%28data%3A%28visible%3A%21t%2Chits%3A%28selected%3Atotal%29%2Cerrors%3A%28selected%3Atotal%29%2Clatency%3A%28selected%3Ap95%29%2CtopN%3A%215%29%2Cversion%3A%211%29&summary=qson%3A%28data%3A%28visible%3A%21t%2Cerrors%3A%28selected%3Acount%29%2Chits%3A%28selected%3Aversion_rate%29%2Clatency%3A%28selected%3Alatency%2Cslot%3A%28agg%3A75%29%2Cdistribution%3A%28isLogScale%3A%21f%29%29%2Csublayer%3A%28selected%3Apercentage%2Cslot%3A%28layers%3Aservice%253A5%29%29%29%2Cversion%3A%211%29&view=spans&start=1718912943959&end=1718916543959&paused=false)

- [sg50 Server Logs](https://cvent.datadoghq.com/logs?query=env%3Asg50%20service%3Aplanner-event-hubs%20source%3Anodejs%20&agg_m=count&agg_m_source=base&agg_t=count&cols=host%2Cservice&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=desc&viz=stream&from_ts=1719249647760&to_ts=1719336047760&live=true)

- [sg50 Browser Logs](https://cvent.datadoghq.com/logs?query=env%3Asg50%20service%3Aplanner-event-hubs%20source%3Abrowser%20&agg_m=count&agg_m_source=base&agg_t=count&cols=host%2Cservice&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=desc&viz=stream&from_ts=1719249647760&to_ts=1719336047760&live=true)

- [pr50 Server Logs](https://cvent.datadoghq.com/logs?query=env%3Apr50%20service%3Aplanner-event-hubs%20source%3Anodejs%20&agg_m=count&agg_m_source=base&agg_t=count&cols=host%2Cservice&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=desc&viz=stream&from_ts=1719249647760&to_ts=1719336047760&live=true)

- [pr50 Browser Logs](https://cvent.datadoghq.com/logs?query=env%3Apr50%20service%3Aplanner-event-hubs%20source%3Abrowser%20&agg_m=count&agg_m_source=base&agg_t=count&cols=host%2Cservice&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=desc&viz=stream&from_ts=1719249647760&to_ts=1719336047760&live=true)

- [pr53 Server Logs](https://cvent.datadoghq.com/logs?query=env%3Apr53%20service%3Aplanner-event-hubs%20source%3Anodejs%20&agg_m=count&agg_m_source=base&agg_t=count&cols=host%2Cservice&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=desc&viz=stream&from_ts=1719249647760&to_ts=1719336047760&live=true)

- [pr53 Browser Logs](https://cvent.datadoghq.com/logs?query=env%3Apr53%20service%3Aplanner-event-hubs%20source%3Abrowser%20&agg_m=count&agg_m_source=base&agg_t=count&cols=host%2Cservice&fromUser=true&messageDisplay=inline&refresh_mode=sliding&storage=hot&stream_sort=desc&viz=stream&from_ts=1719249647760&to_ts=1719336047760&live=true)

- [RUM](https://cvent.datadoghq.com/rum/performance-monitoring?query=%40session.type%3Auser%20%40application.id%3Af3847f2c-9db7-47d1-8e7b-9ad3196f6bcd&filters=%5B%22env%22%2C%22service%22%2C%22version%22%2C%22%40session.type%22%2C%22%40geo.country%22%2C%22%40device.type%22%2C%22%40usr.email%22%5D&tab=overview&from_ts=1719248550161&to_ts=1719334950161&live=true)


## SMEs

Developers - @oss-red-devs

Leads - Jeremiah Heller, Vinod Subbanna

## SMEs
* Backstage: https://backstage.core.cvent.org/catalog/default/component/planner-event-hubs