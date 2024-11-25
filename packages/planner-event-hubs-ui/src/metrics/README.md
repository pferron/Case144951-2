# Page Actions Analytics

Rudderstack is the CDP solution we chose to create a central repository that ingests data from different sources and acts as our data warehouse to store large amounts of data so that later we can analyze it and present it accurately.

As part of the CDP initiative, we want to start consuming the [tracking-plan-publisher](https://stash.cvent.net/projects/INCB/repos/rudderstack/browse/packages/tracking-plan-publisher) CLI tool to allow us to create tracking plans and publish them to Rudderstack.

## Upgrading the tracking-plan-publisher CLI

It is highly recommended to delete the **node_modules** folder (both at the root and the one at the packages level) every time you update the tracking-plan-publisher CLI. This is to guaranteed that your local repository is using the latest version of the CLI. There's been a few issues due to some developers not running the latest version.

## CDP packages Changes

### v5.0.6 (Latest version)

- [cli] Generates IdentityProvider for the init command
- [cli] Prettifies files for init command

## Adding action definitions

We want to build tracking plans using action definitions defined in json files that follow the [CAP V2](https://wiki.cvent.com/pages/viewpage.action?spaceKey=Webinar&title=CAP+-+CDP+Action+Plan) nomenclature. The CLI helps you create action definitions and makes sure the CAP V2 nomenclature is enforced.

Every time you need to add a new action definition you can use the command below to create the json definition:

```
pnpm tracking-plan-publisher new action --name video background uploaded --type track --folder presentation
```

The command above will create a new action defition under the `/metrics/actions/presentation` directory. Before generating the api, you should update your new action definition providing accurate information and adding the properties that you intent to pass when this action is tracked within the application.

The latest version of the CLI requires you to pass the following parameters:

- name: The name of your action. Should follow the CAP V2 nomenclature
- type: The type of action. Supported values are: track or measure
- folder: The folder where you want to create your new action

## Code Structure

If you are using the pageActions api, the CLI will create react hooks based on your actions' folders under the `/metrics/client/react` directory and analytics' modules under the `/metrics/client/web` directory if your action sdk is set to **analytics.js** in your definition file. If you chose the **analytics-node** sdk, then your client will be created under the `/metrics/client/server` directory.

For instance, if you have the following folder structure:

```
- actions
    - presentation
    - activation
```

and your run the `generate` command, the CLI will create the following files

```
- client
  - react
    - useActivationPageActionsApi.ts
    - usePresentationPageActionsApi.ts
  - web
    activationWebAnalytics.ts
    presentationWebAnalytics.ts
```

Each file will contain all the api functions defined under its folder. If you are using react and wanted to track an action in the presentation page, you could access the api function like in the example below:

```
import usePresentationPageActionsApi from '@metrics/client/react/usePresentationPageActionsApi';

// Import the functions you need
const { videoStorageFullAlertRendered, videoUploadDurationExceeded } = usePresentationPageActionsApi();
```

> **IMPORTANT**: We strongly recommend to structure your actions in folders based on the page that is tracking them (ie. presentation, home, etc). This will make sure that you are only loading code needed for the current page rather than loading a single big file containing all of your applications' page actions functions.

## Using the auto generated code

During development and after you have added or updated an action definition, it is recommended you run the `pnpm tracking-plan-publisher generate` script so that you can use the auto generated clients to write your implementation. This command will include the ajv validators to make sure your implementation is passing all required props.

Once you have tested your implementation and confirmed it is good to go, you must run `pnpm tracking-plan-publisher generate -noValidators` command so that the ajv validators are removed from the auto generated code. Your PR build will fail if you push a PR with the ajv validators.

# Troubleshoting

- If you forgot to remove the ajv validators before putting a PR, your PR will most likely fail. To fix it, simply run the command below and push your changes.

```
pnpm tracking-plan-publisher generate -noValidators
```

- If you get a `poetry command not found` error when publishing the plan to the wiki space, it is due to not having poetry installed. To fix it simply run

```
 asdf plugin-add poetry https://github.com/asdf-community/asdf-poetry.git
```

# Further Reading

- [Tracking Plan Publisher CLI](https://stash.cvent.net/projects/INCB/repos/rudderstack/browse/packages/tracking-plan-publisher)
- [Page Actions API](https://stash.cvent.net/projects/INCB/repos/sli-emitter/browse/packages/sli-nextjs-metrics)
- [Rudderstack Web SDK](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-javascript-sdk/)
- [Rudderstack Node SDK](https://www.rudderstack.com/docs/sources/event-streams/sdks/rudderstack-node-sdk/)
