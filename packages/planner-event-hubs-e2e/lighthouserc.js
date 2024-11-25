// Docker image for e2e module tries to copy lighthouserc.js file.
// The build fails when the file is not found. So we added a dummy file to get passing builds.
// This was discussed on nx channel here: https://cvent.slack.com/archives/CQTU2PT1N/p1666359339626329?thread_ts=1666357947.949649&cid=CQTU2PT1N

// const merge = require('lodash.merge');
// const { getConfig, cventDefaultAssertions } = require('@cvent/lighthouse-utils');
//
// // Lighthouse Setup
// const config = {
//   ci: {
//     // Change this to assert what you want based on your app, ref: https://wiki.cvent.com/display/QE/Lighthouse+CI
//     // The default lighthouse assertions are here:
//     //    https://github.com/GoogleChrome/lighthouse/blob/v5.5.0/lighthouse-core/config/default-config.js#L375-L407
//     // The default Cvent assertions are here:
//     //    https://stash.cvent.net/projects/QE/repos/lighthouse-utils/browse/packages/lighthouse-utils/src/configs/index.ts#74-95
//     assert: {
//       assertions: {
//         // Category values set using the baselines derived from the lighthouse dashboard
//         'categories:performance': ['error', { minScore: 0.6 }],
//         'categories:accessibility': ['error', { minScore: 0.98 }],
//         'categories:best-practices': ['error', { minScore: 0.83 }],
//         'categories:seo': ['error', { minScore: 0.8 }],
//         'categories:pwa': ['error', { minScore: 0.22 }],
//         ...cventDefaultAssertions
//       }
//     },
//     collect: {
//       puppeteerScript: 'src/utils/launchLighthouseBrowser.ts', // Launch browser
//       url: [process.env.BASE_URL, process.env.BASE_URL + '/docs'], // urls to analyze
//       // comment out below line for local runs
//       chromePath: '/usr/bin/chromium-browser' // don't use the bundled docker chromium
//     },
//     upload: {
//       // token must be set per project: use `pnpm lhci:wizard` to generate
//       token: '52b9c67f-4367-4ce3-a7e7-dad5332ccc8a' // could also use LHCI_TOKEN variable instead,
//     }
//   }
// };
//
// module.exports = merge(getConfig(), config);
