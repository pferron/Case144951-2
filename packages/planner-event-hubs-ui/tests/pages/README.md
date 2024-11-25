Unit tests for any code under src/pages/ should be added here. **tests**/ can technically be added directly to the src/pages/ folder (and will work when running tests directly), they will fail with a `describe not defined` error during app start because (by default), all files in this folder are included at runtime and considered as pages that can be routed to via NextJS.

Here's an example of the error you might see in a PR build as a result of this mistake

```
[build:ci] > Build error occurred
[build:ci] ReferenceError: describe is not defined
[build:ci]     at Object.6264 (/build/workspace/Attendee_planner-event-hubs_PR-643/packages/planner-event-hubs-ui/.next/shared/server/pages/__tests__/500.test.js:102:1)
[build:ci]     at __webpack_require__ (/build/workspace/Attendee_planner-event-hubs_PR-643/packages/planner-event-hubs-ui/.next/shared/server/webpack-runtime.js:25:42)
[build:ci]     at __webpack_exec__ (/build/workspace/Attendee_planner-event-hubs_PR-643/packages/planner-event-hubs-ui/.next/shared/server/pages/__tests__/500.test.js:248:39)
[build:ci]     at /build/workspace/Attendee_planner-event-hubs_PR-643/packages/planner-event-hubs-ui/.next/shared/server/pages/__tests__/500.test.js:249:77
[build:ci]     at Function.__webpack_require__.X (/build/workspace/Attendee_planner-event-hubs_PR-643/packages/planner-event-hubs-ui/.next/shared/server/webpack-runtime.js:220:21)
[build:ci]     at /build/workspace/Attendee_planner-event-hubs_PR-643/packages/planner-event-hubs-ui/.next/shared/server/pages/__tests__/500.test.js:249:47
[build:ci]     at Object.<anonymous> (/build/workspace/Attendee_planner-event-hubs_PR-643/packages/planner-event-hubs-ui/.next/shared/server/pages/__tests__/500.test.js:252:3)
[build:ci]     at Module._compile (node:internal/modules/cjs/loader:1155:14)
[build:ci]     at Object.Module._extensions..js (node:internal/modules/cjs/loader:1209:10)
[build:ci]     at Module.load (node:internal/modules/cjs/loader:1033:32) {
[build:ci]   type: 'ReferenceError'
```
