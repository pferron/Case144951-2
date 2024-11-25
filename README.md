# planner-event-hubs

Planner facing CDF application for Events+ product. This is a mono repo with graph and UI layers.

See https://framework.docs.cvent.org for complete documentation.

Note: You will likely see many legacy and/or anti-patterns in this code. This project was born from a merge of video-hub-ui/CDF Graph and planner-video-solution/NX UI layers. 

## Architectural Decision Records

This repository utilizes ADR to record architectural decisions made in the development of Video Hub. Please see [here](docs/adr/0001-record-architecture-decisions.md) for details on what ADR is and the tools you need to install to use them.

## Running the application locally

### Installing oktaws
In order to properly build the app with the "build" command, you must have oktaws installed and configured for the cvt-event-dev account. See https://wiki.cvent.com/display/AWS/Oktaws for instructions. Unfortunately at this time, the `oktaws init` command from the wiki does not generate the proper toml file for cdf projects yet, so your `~/.oktaws/cvent.toml` should look like this: https://stash.cvent.net/projects/GCVT/repos/development-framework/browse/.oktaws/cvent.toml

### Install required dependencies

1. Install `asdf` if needed. [Instructions](https://wiki.cvent.com/x/8wCNC)
2. Install asdf plugins if needed.

```
asdf plugin add nodejs
asdf plugin add pnpm
asdf plugin add python
asdf plugin add adr-tools
asdf plugin-add phrase https://github.com/phrase/asdf-phrase
```

3. From project root, run `asdf install` to ensure you have the needed languages, dev tools, etc.
4. From project root, run the following commands:
```bash
git clean -dfx
pnpm install
pnpm build
cd packages/planner-event-hubs-ui
pnpm dev
```
5. The application can be accessed at http://localhost:3000/eventsplus/<path to page you want to visit>.
6. The graph for this application can be accessed at: http://localhost:3000/video-center/api/graphql

Note: If you are using the GQl playground don't forget to update the graph url in the address bar of the playground.
Note: asdf does not play nice with nvm which may need to be [uninstalled](https://github.com/nvm-sh/nvm/issues/298), but can be used instead of nvm by [setting a global default](https://asdf-vm.com/guide/getting-started.html#global).

### Instructions for installing `redis`
You need to install redis if you plan to work in the following areas
* AccountBearerCache
* TempImageCache
* end-point in pages/api/redis.
* MemberLogin


1.  `brew install redis` and follow the instructions printed from homebrew to manage the redis start/stop behavior. 

    Alternatively, you can follow these docs for setting up redis :

    https://redis.io/docs/stack/get-started/install/docker/
    https://redis.io/docs/manual/cli/



Note: local dev uses InMemoryLRUCache by default. This is controlled by the USE_REMOTE_CACHE environment variable. This variable is set via Hogan in `.env.template` and false in .env.development. For login inMemoryLRUCache won't work on local.

To use redis cache locally, ensure redis is running and then start application with

```bash
USE_REMOTE_CACHE=true pnpm dev
```

### Various helpful commands

##### Build

```bash
pnpm build
```

##### Schema generation

```bash
cd packages/planner-event-hubs-ui
pnpm build
```

##### Verifying lint

```bash
pnpm lint
```

##### Fixing lint issues

```bash
pnpm fix
```

##### Updating snapshots of UTs

```bash
cd packages/planner-event-hubs-ui
jest -u
```

##### Running storybook

```bash
cd packages/planner-event-hubs-ui
pnpm storybook
```
Visit http://localhost:6006/

### Troubleshooting

1. `pnpm build` only runs changed packages, so if you want to re-run the build for all packages, you can delete the nx cache.
```
rm -rf node_modules/.cache/nx
```

2. If you are experiencing issues with hogan config values not being up to date clean out the .hogan directory and restart the service or test run.
```
git clean -dfx
```

## Testing the application locally

Running the tests using the web storm IDE should work fine in most of the cases. If someone prefers using cli use the following commands:

### To run the unit tests

```bash
cd packages/planner-event-hubs-ui
pnpm test
```

### To run the ITs tests

1. Update the application URL in the env file, which you want to test the ITs on.
```bash
cd packages/planner-event-hubs-it
pnpm test:it
```

[IT Static Test Data](/docs/it/staticTestData.md)

### To run the e2es tests

1. Update the application URL in the env file, which you want to test the e2es on.
```bash
cd packages/planner-event-hubs-e2e
pnpm test:e2e
```

## Pushing Commits

1. Before pushing your commit to the repo, you should create a changeset (One changeset per PR, not per commit)
```bash
pnpm changeset
```
2. Make sure the commit message has details of the exact code changes done along with appropriate ticket number
