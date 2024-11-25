# End-2-End UI Testing with Webdriver.io v6

## Quick Start

If the project has not already installed all packages to ../node-modules run:

```
pnpm install
```

Run e2e tests:

```
pnpm test:e2e
```

Run generic Webdriver.io examples tests here: ./src/specs/examples

```
pnpm test:examples
```

## [Project Structure](https://wiki.cvent.com/display/RD/Getting+Started+with+the+NX+Framework#GettingStartedwiththeNXFramework-my-first-package-app-e2e)

- ./configs
  - wdio.conf.ts
    - Example wdio config components for Jasmine tests
- ./src/sitespeed
  - Sitespeedio scripts
- ./src/pages
  - Page Object classes
  - /examples folder
    - Webdriver.io generic page object examples
- ./src/specs
  - Jasmine tests
    - /examples folder
      - Webdriver.io generic tests with expect-webdriverio assertion examples

## Webdriver.io

- wdio runner powers this framework
- [Easy to select dom elements](https://webdriver.io/docs/selectors.html)

## Sitespeed

[Sitespeed.io](https://www.sitespeed.io/) is a set of Open Source tools that makes it easy to monitor and measure the performance of your website.

1. Write JS test file (also called [user journey](https://www.sitespeed.io/documentation/sitespeed.io/prepostscript/)) to be executed

   - Many examples in [Stash sitespeed-metrics repo](https://stash.cvent.net/projects/QE/repos/sitespeed-metrics/browse)

2. Run locally using `pnpm sitespeed.io [options] <url>/<file>`
   1. e.g. `pnpm sitespeed.io --multi -n 1 --debug src/sitespeed/login.js`
   2. `pnpm sitespeed` will run existing example
3. Use [configuration parameters](https://www.sitespeed.io/documentation/sitespeed.io/configuration/)

## Page Objects

- This project uses the Page Object Pattern in classes here: ./src/pages
- [Webdriver.io Page Objects docs](https://webdriver.io/docs/pageobjects.html)
- All [object-repository](https://stash/projects/QE/repos/object-repository/browse) locators are also available in the package `@cvent-wdio/object-enums-<branchName>`
  - [To generate them yourself see here](https://wiki.cvent.com/display/QE/Cvent-wdio+Guide+Book#23gen-object-enums)
- Pages can be reused in external repos by running the `pnpm publish:pages` command
  - Additional pages can be exported by including them in the `src/pages/index.js` file
  - `publish:pages` includes the `build:pages` command which transpiles the pages for use in external projects
  - After publishing to nexus, pages can be imported in an external repo's package.json file by adding `"@cvent-wdio/<package-name>>": "^0.1.1-SNAPSHOT"` to it's devDependencies
  - Published pages can then be used in a local repo's tests by adding `import { FormPage } from '@cvent-wdio/<package-name>';` at the top of the file

## Assertions

- Webdriver.io v6 comes with the expect-webdriverio assertion library
  - Allows you to use all Jest assertions/matchers plus powerful webdriverio specific ones
- [expect-webdriverio Matchers](https://webdriver.io/docs/api/expect.html)

## Notes

- Tests can not be run directly from .spec files
  - They must be run using the wdio runner as seen in the scripts in ./package.json
- These tests use the @wdio/sync library to call selectors
- The tests run using devtools/Puppeteer on headless chrome by default
  - To run on other browsers/devices update the capabilities array in wdio.conf.ts
  - To run on BrowserStack uncomment browserStack_v6 config in wdio.conf.ts
  - Other preset configs available here:
    - [@cvent-wdio/wdio-configs package](https://stash.cvent.net/projects/QE/repos/cvent-wdio/browse/packages/wdio-configs/src/index.js)
- Typescript usage: WebdriverIO types are set up via `@wdio/sync` types in `tsconfig.json`, do not import `webdriverio` as it'd switch to async types.

## @cvent-wdio

- @cvent-wdio scope contains Cvent specific supporting packages for these tests
- [Cvent-WDIO Guide Book](https://wiki.cvent.com/display/QE/Cvent-wdio+Guide+Book)
- [cvent-wdio mono-repo](https://stash/projects/QE/repos/cvent-wdio/browse) is where these packages will be continually updated
  - **_Please Contribute!_**
