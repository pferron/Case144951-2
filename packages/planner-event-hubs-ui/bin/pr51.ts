import { RuntimeApp } from '@cvent/cdk-applications/apps/RuntimeApp';
import { infrastructure } from '@cvent/planner-event-hubs-cdk/bin/pr51';
import { version } from '../package.json';

new RuntimeApp({
  infrastructure,
  version
});
