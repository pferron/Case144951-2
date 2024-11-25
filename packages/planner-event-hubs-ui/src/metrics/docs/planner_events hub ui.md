# planner events hub ui

**Product**: Events+

**Business Unit**: event

**Component**: planner-event-hubs-ui

**Version**:

**Rudderstack url**: https://app.rudderstack.com/trackingPlans/TBD

## Table of contents

- [CDP User Properties](#plannereventshubui-CDPUserProperties)
- [CDP Reserved User Properties](#plannereventshubui-CDPReservedUserProperties)
- [Custom User Properties](#plannereventshubui-CustomUserProperties)
- [Base Properties](#plannereventshubui-BaseProperties)
- [Reserved Properties](#plannereventshubui-ReservedProperties)
- [Contextual Fields](#plannereventshubui-ContextualFields)
- [Actions](#plannereventshubui-Actions)
  - [page_load](#plannereventshubui-1.-page_load)
  - [update_profile_with_custom_traits](#plannereventshubui-2.-update_profile_with_custom_traits)
  - [assign pages button clicked](#plannereventshubui-3.-assignpagesbuttonclicked)
  - [banner content section checked](#plannereventshubui-4.-bannercontentsectionchecked)
  - [banner design section checked](#plannereventshubui-5.-bannerdesignsectionchecked)
  - [banner image checked](#plannereventshubui-6.-bannerimagechecked)
  - [banner name provided](#plannereventshubui-7.-bannernameprovided)
  - [create banner button clicked](#plannereventshubui-8.-createbannerbuttonclicked)
  - [pages assign button clicked](#plannereventshubui-9.-pagesassignbuttonclicked)
  - [branding save button clicked](#plannereventshubui-10.-brandingsavebuttonclicked)
  - [logo image checked](#plannereventshubui-11.-logoimagechecked)
  - [add existing video button clicked](#plannereventshubui-12.-addexistingvideobuttonclicked)
  - [channel image checked](#plannereventshubui-13.-channelimagechecked)
  - [channel status toggled](#plannereventshubui-14.-channelstatustoggled)
  - [create a section button clicked](#plannereventshubui-15.-createasectionbuttonclicked)
  - [create button clicked](#plannereventshubui-16.-createbuttonclicked)
  - [create channel button clicked](#plannereventshubui-17.-createchannelbuttonclicked)
  - [create section add button clicked](#plannereventshubui-18.-createsectionaddbuttonclicked)
  - [delete channel button clicked](#plannereventshubui-19.-deletechannelbuttonclicked)
  - [select video from library add button clicked](#plannereventshubui-20.-selectvideofromlibraryaddbuttonclicked)
  - [create eventsplus hub button clicked](#plannereventshubui-21.-createeventsplushubbuttonclicked)
  - [hub status toggled](#plannereventshubui-22.-hubstatustoggled)
  - [image edit applied](#plannereventshubui-23.-imageeditapplied)
  - [image upload clicked](#plannereventshubui-24.-imageuploadclicked)
  - [connection switch toggled](#plannereventshubui-25.-connectionswitchtoggled)
  - [manage calendars button clicked](#plannereventshubui-26.-managecalendarsbuttonclicked)
  - [upcoming events calendar check mark clicked](#plannereventshubui-27.-upcomingeventscalendarcheckmarkclicked)
  - [upcoming events setup button clicked](#plannereventshubui-28.-upcomingeventssetupbuttonclicked)
  - [upcoming events switch toggled](#plannereventshubui-29.-upcomingeventsswitchtoggled)
  - [your events switch toggled](#plannereventshubui-30.-youreventsswitchtoggled)
  - [visibility check mark clicked](#plannereventshubui-31.-visibilitycheckmarkclicked)

## CDP User Properties

These are user properties used during the identification process. Usually right after users sign up or every time they login. These properties are stored and encrypted in the rl_trait cookie so that they can be shared cross domain. These properties are also carried as properties of every action tracked which can be used in the downstream tools to segment user data

| Property     | <div style="width:160px">Type</div> | Description                                                                              | Required |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------------------------- | -------- |
| userId       | string                              | The unique id that identifies the user                                                   | yes      |
| firstName    | string                              | The user's first name                                                                    | yes      |
| lastName     | string                              | The user's last name                                                                     | yes      |
| email        | string                              | The user email used during signup or account setup                                       | yes      |
| company      | string                              | The company the user works for                                                           | yes      |
| accountName  | string                              | The user account number. This is the accountNumber in CVII                               | yes      |
| persona      | string                              | Identifier to represent the user's characteristics                                       | yes      |
| license      | string                              | The type of license assigned to the user (ie. Self Service, Enterprise, etc)             | no       |
| subscription | string                              | The subscription the user holds for your product (ie. Webinar Free, Webinar Pro250, etc) | no       |

## CDP Reserved User Properties

These are user properties that are added by the framework whenever the user is identified with the CDP User Properties.

| Property       | Type   | Description                                                                                                                  | Required |
| -------------- | ------ | ---------------------------------------------------------------------------------------------------------------------------- | -------- |
| userGroup      | string | Identifier to reference the group a user belongs to. See below to learn more about how this property is set                  | yes      |
| lastLoginDate  | string | The last time the user was identified                                                                                        | yes      |
| firstLoginDate | string | For contracted users only which don't have a signup date. This property indicates when was the first time the user logged in | no       |
| signupDate     | string | For self-service users only. This property indicates when was the first time the user created an account                     | no       |

### userGroup

The userGroup property is being passed both as a base property and as a user property to properly segment users and events in downstream tools. The framework will compute its value based on the information provided when
the user is identified.

The criteria to determine if the user falls within the **internal** group is the following:

- We first check if the email domain includes any of these domains: `['cvent.com', 'growthrocks.com', 'no.com', 'no.mail', 'socialtables.com', 'ymail.com', 'crowdcompass.com', 'j.mail']`
- We then check if the company provided contains `Cvent` or if it starts with `web` as per instructed to internal users when creating Self Service accounts
- We also check if the accountName includes any of these prefix: `['CVE', 'QTW', 'WEB']`
- And lastly, we check if the initial referrer contains any of these domains: `['wiki.cvent', 'cvii', 't2.cvent']`

If none of the above is met, the framework will tag this user as an **external** user unless your [automation users' implementation](https://wiki.cvent.com/display/CDP/10.+Automation+Governance)
tags it as an **automation** user.

These are user properties that identify your users with information that are specific to your product (ie. nextWebinarDate, billingCycle, etc). These properties are stored and encrypted in the device's local storage so that they can be carried as properties of every action tracked

| Property | <div style="width:160px">Type</div> | Description | Required |
| -------- | ----------------------------------- | ----------- | -------- |

## Base Properties

These are properties that are automatically attached to every action that is sent to the downstream tools. They must be provided as base properties by your instrumentation when you initialize the metrics client

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

### More information about your base properties

\*<strong>userGroup</strong>

<ul>
<li><strong>automation</strong>: These users fall within the automation group (i.e. dd synthetics, load tests, automation tests)</li>
<li><strong>internal</strong>: These users are Cventers. Whenever a user is identify, the email, company name, account name and initial refferer are properties that are used to determine if this is an internal user</li>
<li><strong>external</strong>: These users are considered actual customers. If an internal user didn't follow the rules when creating accounts they will be placed in the external group</li>
<li><strong>unknown</strong>: This user is an annonymous user. Once they login or signup, they will be placed under one of the other groups</li>
</ul>
*<strong>persona</strong>
<ul>
<li><strong>attendee</strong>: These users are users that attend an event either in person or virtually</li>
<li><strong>exhibitorAdmin</strong>: These users are users that set up and manage an exhibitor for an event</li>
<li><strong>planner</strong>: These users are users that plan and coordinate all aspects of an event or webinar</li>
<li><strong>speaker</strong>: These users are users that present a topic or a talk during an event or webinar</li>
<li><strong>visitor</strong>: These users are annonymous users that visit any of our web sites (i.e cvent.com, knowledge center, etc)</li>
</ul>

## Reserved Properties

These are properties that are set explicitly by the metrics client. They are used to give more context to your actions and for analytics purposes

| Property | <div style="width:160px">Type</div>                                                                                                        | Description                                                                                                                                            | Required |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| pathname | string                                                                                                                                     | Represents a location in a hierarchical structure. It is a string constructed from a list of path segments, each of which is prefixed by a / character | yes      |
| duration | number                                                                                                                                     | For measure actions, this property is set automatically by the metric's client and indicates how long it took to record the action in miliseconds      | yes      |
| \*result | **One Of**:<li>success</li><li>error</li><li>expected_error</li><li>incomplete_measure</li>                                                | Identifier set automatically by the metric's client and used to reference the result of an action in the downstream tools                              | yes      |
| \*type   | **One Of**:<li>tracked</li><li>not_tracked</li><li>route_change_error</li><li>unhandled_error</li><li>handled_error</li><li>abandoned</li> | Identifier to tell if the action was tracked                                                                                                           | yes      |

### More information about reserved properties

\*<strong>result</strong>

<ul>
<li><strong>success</strong>: The page_load/action was tracked as success after receiving a response from the BE</li>
<li><strong>error</strong>: The page_load/action ended in an error after receiving a response from the BE</li>
<li><strong>expected_error</strong>: The action was tracked explicitly by the instrumentation as an expected error. Validation errors fall within this category</li>
<li><strong>incomplete_measure</strong>: The action was never tracked by the instrumentation. The metric client tracked it as incomplete on a route change</li>
</ul>
*<strong>type</strong>
<ul>
<li><strong>tracked</strong>: page_load/action was tracked via instrumentation</li>
<li><strong>not_tracked</strong>: page_load/action was missed by instrumentation, so page rendered with no error but duration is off</li>
<li><strong>route_change_error</strong>: next.js router error</li>
<li><strong>unhandled_error</strong>: The ErrorBoundary caught an error, and a full error screen was shown</li>
<li><strong>handled_error</strong>: The page had an error loading, but it is handled within the component</li>
<li><strong>abandoned</strong>: page_load was never tracked by the instrumentation. The metric client tracked it as abandoned on a route change</li>
</ul>

## Contextual Fields

Contextual fields give additional information about a particular event. The Rudderstack SDKs collect them and populate them automatically with every action.
To learn more and to see the list of available fields, [click here](https://www.rudderstack.com/docs/event-spec/standard-events/common-fields/#contextual-fields).

## Actions

In the section below, you will find the analytics priorities identified by product. Use them to understand what a metric is for, how it gets triggered,
which team is implementing it and general information.

### 1.-page_load

this action measures the time taken in navigations to any page, as measured from the browser

**status**: active

**unique name**: planner events hub ui page_load

**trigger**: the measurement starts when the user either changes routes or reloads the page and ends when the page indicates it has finished loading the main content

**release**: v1.0

**sdk**: analytics.js

**owner**: and1

**type**: measure

**phase**: analytics

**destinations**: all

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                            | Required |
| ---------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| url              | string                                                                           | The current page url                                                                                                                   | yes      |
| title            | string                                                                           | The current page title                                                                                                                 | yes      |
| pathname         | string                                                                           | The current page path (i.e. /events/home)                                                                                              | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                             | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                      | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                      | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                 | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                              | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                    | yes      |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                     | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application          | yes      |
| platform         | string                                                                           | Identifier to uniquely figure out the application that is sending the plan actions                                                     | yes      |
| accountMappingId | string                                                                           | TODO: provide a description for this attribute                                                                                         | no       |

**Payload Example**:

```
{
    'product': 'cvent.com'
    'businessUnit': 'marketing'
    'component': 'marketing-site'
    'appVersion': '1.0.1'
    'environmentName': 'pr50'
    'isCVIIUser': 'false'
    'pathname': '/en/blog/hospitality/how-to-start-hotel-business'
    'result': 'success'
    'type': 'tracked'
    'userGroup': 'unknown'
    'persona': 'visitor'
    'url': 'https://www.cvent.com/en/blog.../how-to-start-hotel-business'
    'title': 'How to Start a Hotel Business: The 8-Step Guide | Cvent Blog'
    'initial_referrer': 'https://www.google.com/'
    'initial_referring_domain': 'www.google.com'
    'referring_domain': 'www.google.com'
    'referrer': 'https://www.google.com/'
    'search': '(empty string)'
    'tab_url': 'https://www.cvent.com/en/blog.../how-to-start-hotel-business'
    'Session Id': '1686065044865'
    'platform': 'marketing-site'
}
```

### 2.-update_profile_with_custom_traits

this action tracks the users who were identified in order to update their user profile with custom properties in all downstream tools

**status**: active

**unique name**: planner events hub ui update_profile_with_custom_traits

**trigger**: this action is triggered as soon as the user is identified in the application with specific properties (i.e. subscription, billincCycle)

**release**: v1.0

**sdk**: analytics.js

**owner**: and1

**type**: track

**phase**: identify

**destinations**: all

**Properties**

| Property | <div style="width:160px">Type</div> | Description | Required |
| -------- | ----------------------------------- | ----------- | -------- |

**Payload Example**:
_Not Provided_

### 3.-assign pages button clicked

this action tracks the users who has intent to assign pages to banners in order to show banners on those pages

**status**: active

**unique name**: planner events hub ui assign pages button clicked

**trigger**: this action is triggered when user clicks on 'Assign pages' in page section of banner

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 4.-banner content section checked

this action tracks the users who provides banner details in order to update the banner content section

**status**: active

**unique name**: planner events hub ui banner content section checked

**trigger**: this action is triggered when user clicks on check mark button in edit state of banner content section

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property                            | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ----------------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| bannerTitle                         | string                                                                           | Title provided for the banner                                                                                                                                                                                                                                             | yes      |
| bannerBody                          | string                                                                           | Description provided for the banner                                                                                                                                                                                                                                       | no       |
| buttonText                          | string                                                                           | Button text if there are any buttons added to the banner                                                                                                                                                                                                                  | no       |
| whereWillThisButtonBringYourMembers | string                                                                           | Destination page or link on click on the button                                                                                                                                                                                                                           | no       |
| selectAPage                         | string                                                                           | Name of the page that button takes when selected Events+ hub                                                                                                                                                                                                              | no       |
| externalLink                        | string                                                                           | External Link to which the button clicks takes to                                                                                                                                                                                                                         | no       |
| appVersion                          | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product                             | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit                        | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component                           | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName                     | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId                              | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup                         | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign                         | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource                           | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium                           | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm                             | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent                          | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona                           | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser                          | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName                    | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 5.-banner design section checked

this action tracks the users who updates design section in order to change the text alignments in banner

**status**: active

**unique name**: planner events hub ui banner design section checked

**trigger**: this action is triggered when user clicks on check mark button in edit state of banner design section

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| textAlignment    | string                                                                           | Text alignment selected for the banner                                                                                                                                                                                                                                    | yes      |
| fontColor        | string                                                                           | Font color of the text that appears on the banner                                                                                                                                                                                                                         | no       |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 6.-banner image checked

this action tracks the users who saves the image in order to use in banners

**status**: active

**unique name**: planner events hub ui banner image checked

**trigger**: this action is triggered when user clicks on check mark button in edit state of website image section in banners section

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 7.-banner name provided

this action tracks the users who provide a name to banners in order to create the banner

**status**: active

**unique name**: planner events hub ui banner name provided

**trigger**: this action is triggered when user clicks on

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| bannerTemplate   | string                                                                           | Template chosen for the banner                                                                                                                                                                                                                                            | yes      |
| bannerName       | string                                                                           | Name provided for the banner                                                                                                                                                                                                                                              | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 8.-create banner button clicked

this action tracks the users who wants to create banner in order to use in eventsplus pages

**status**: active

**unique name**: planner events hub ui create banner button clicked

**trigger**: this action is triggered when the user clicks on Create Banner' button on the banners page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 9.-pages assign button clicked

this action tracks the users who assigns the pages to banners in order to show the banner on those pages

**status**: active

**unique name**: planner events hub ui pages assign button clicked

**trigger**: this action is triggered when user clicks on 'Assign' in the select 'Pages' modal

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| bannerPlacement  | string                                                                           | Name of the page assigned to the banner                                                                                                                                                                                                                                   | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 10.-branding save button clicked

this action tracks the users who makes changes in themes in order to change the colors of branding

**status**: active

**unique name**: planner events hub ui branding save button clicked

**trigger**: this action is triggered when clicks on save button in brandind edit page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property                | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ----------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| primaryColor            | string                                                                           | Primary color of the events+ hub                                                                                                                                                                                                                                          | yes      |
| secondaryColor          | string                                                                           | Secondary color color of the events+ hub                                                                                                                                                                                                                                  | yes      |
| backgroundColor         | string                                                                           | BackgroundColor color color of the events+ hub                                                                                                                                                                                                                            | yes      |
| selectYourMood          | string                                                                           | Mood of the events+ hub                                                                                                                                                                                                                                                   | yes      |
| safeColorMode           | boolean                                                                          | Whether safemode is turned on or off for the events+ hub                                                                                                                                                                                                                  | yes      |
| overrideBackgroundColor | boolean                                                                          | Whether background color is overriden for the events+ hub                                                                                                                                                                                                                 | no       |
| appVersion              | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product                 | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit            | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component               | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName         | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId                  | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup             | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign             | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource               | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium               | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm                 | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent              | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona               | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser              | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName        | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 11.-logo image checked

this action tracks the users who saves the image in order to use as logo in events+

**status**: active

**unique name**: planner events hub ui logo image checked

**trigger**: this action is triggered when user clicks on check mark button in edit state of website image section in branding section

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 12.-add existing video button clicked

this action tracks the users who clicks on add existing videos button in order to add videos to that channel

**status**: active

**unique name**: planner events hub ui add existing video button clicked

**trigger**: this action is triggered when used clicks on 'Delete channel' button on channel information page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 13.-channel image checked

this action tracks the users who saves the image in order to use it as thumbnail for channel

**status**: active

**unique name**: planner events hub ui channel image checked

**trigger**: this action is triggered when user clicks on check mark button in edit state of channel image section in a channel

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 14.-channel status toggled

this action tracks the users who changes the status of channel in order to make it Live or not

**status**: active

**unique name**: planner events hub ui channel status toggled

**trigger**: this action is triggered when user click on check mark button in the edit state of basic information section on channel information page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| channelStatus    | string                                                                           | Shows the status of channel whether it is Live or Not Live                                                                                                                                                                                                                | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 15.-create a section button clicked

this action tracks the users who wants to create videos sections in order to group certain videos together

**status**: active

**unique name**: planner events hub ui create a section button clicked

**trigger**: this action is triggered when user clicks on Create a section' button in edit state of channel videos section in the video tab of a channel

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 16.-create button clicked

this action tracks the users who clicks on create channel in order to create channel for events+

**status**: active

**unique name**: planner events hub ui create button clicked

**trigger**: this action is triggered when user clicks Create Channel button on the channels page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property           | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| channelName        | string                                                                           | Name of the Channel created                                                                                                                                                                                                                                               | yes      |
| channelDescription | string                                                                           | Description of the Channel created                                                                                                                                                                                                                                        | yes      |
| appVersion         | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product            | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit       | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component          | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName    | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId             | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup        | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign        | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource          | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium          | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm            | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent         | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona          | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser         | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName   | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 17.-create channel button clicked

this action tracks the users who clicks on create button in order to create the channel

**status**: active

**unique name**: planner events hub ui create channel button clicked

**trigger**: this action is triggered when user clicks on Create button within new channel creation modal

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 18.-create section add button clicked

this action tracks the users who creates videos section in order to group the videos

**status**: active

**unique name**: planner events hub ui create section add button clicked

**trigger**: this action is triggered when the user clicks on 'Add' in the 'Name your section' modal

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property           | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| sectionName        | string                                                                           | Name of the section created                                                                                                                                                                                                                                               | yes      |
| numberOfVideoAdded | number                                                                           | NUmber of videos added to that section                                                                                                                                                                                                                                    | yes      |
| appVersion         | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product            | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit       | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component          | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName    | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId             | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup        | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign        | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource          | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium          | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm            | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent         | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona          | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser         | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName   | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 19.-delete channel button clicked

this action tracks the users who clicks on delete channel button in order to delete that particular channel

**status**: active

**unique name**: planner events hub ui delete channel button clicked

**trigger**: this action is triggered when user click on 'Delete channel' button on channel information page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| triggerLocation  | string                                                                           | Page location from where the delete action is triggered                                                                                                                                                                                                                   | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 20.-select video from library add button clicked

this action tracks the users who select videos from list in order to update the videos in channel

**status**: active

**unique name**: planner events hub ui select video from library add button clicked

**trigger**: this action is triggered when user clicks on 'Add' in the select 'Video from Library'

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property           | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| numberOfVideoAdded | number                                                                           | Number of videos added to that channel                                                                                                                                                                                                                                    | yes      |
| appVersion         | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product            | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit       | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component          | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName    | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId             | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup        | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign        | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource          | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium          | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm            | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent         | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona          | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser         | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName   | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 21.-create eventsplus hub button clicked

this action tracks the users who clicks on create events+ hub in order to create a new events+ hub

**status**: active

**unique name**: planner events hub ui create eventsplus hub button clicked

**trigger**: this action is triggered when user clicks on Create Events+ Hub button within New Events+ Hub creation modal

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property                 | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ------------------------ | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| hubName                  | string                                                                           | Name of the events+ hub created                                                                                                                                                                                                                                           | yes      |
| eventHubLanguageSelected | string                                                                           | Language of the events+ hub while creation                                                                                                                                                                                                                                | yes      |
| hubOwnerFirstName        | string                                                                           | First name of the owner creating the events+ hub                                                                                                                                                                                                                          | yes      |
| hubOwnerLastName         | string                                                                           | Last name of the owner creating the events+ hub                                                                                                                                                                                                                           | yes      |
| hubOwnerEmail            | string                                                                           | Email of the owner creating the events+ hub                                                                                                                                                                                                                               | yes      |
| triggerLocation          | string                                                                           | Location from where the create action is triggered                                                                                                                                                                                                                        | yes      |
| appVersion               | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product                  | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit             | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component                | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName          | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId                   | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup              | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign              | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource                | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium                | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm                  | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent               | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona                | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser               | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName         | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 22.-hub status toggled

this action tracks the users who changes the status of events+ in order to make it live or not

**status**: active

**unique name**: planner events hub ui hub status toggled

**trigger**: this action is triggered when user clicks on check mark button in the edit state of Events+ Hub Status section

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| hubStatus        | string                                                                           | New status of events+ hub                                                                                                                                                                                                                                                 | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 23.-image edit applied

this action tracks the users who uploads image in order to use it as logo or banner image or channel image

**status**: active

**unique name**: planner events hub ui image edit applied

**trigger**: this action is triggered when user clicks on Apply' in the image editor during image upload process

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| imageAspectRatio | string                                                                           | ImageAspectRatio of the selected Image                                                                                                                                                                                                                                    | no       |
| imageWidth       | string                                                                           | ImageWidth of the selected Image                                                                                                                                                                                                                                          | yes      |
| imageHeight      | string                                                                           | ImageHeight of the selected Image                                                                                                                                                                                                                                         | yes      |
| triggerLocation  | string                                                                           | Location from where the upload action is triggered                                                                                                                                                                                                                        | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 24.-image upload clicked

this action tracks the users who wants to upload image in order to use it in logo banners or channels

**status**: active

**unique name**: planner events hub ui image upload clicked

**trigger**: this action is triggered when user clicks on Upload' button on image edit component in branding, banners or channels

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| triggerLocation  | string                                                                           | Location from where the upload action is triggered                                                                                                                                                                                                                        | no       |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 25.-connection switch toggled

this action tracks the users who toggles connections feature in order to turn it on or off

**status**: active

**unique name**: planner events hub ui connection switch toggled

**trigger**: this action is triggered when user clicks on switch button on 'connections' feature card in Events+ Hub feature page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| connectionStatus | string                                                                           | Shows the status of connections feature whether it is on or off                                                                                                                                                                                                           | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 26.-manage calendars button clicked

this action tracks the users who clicks on manage calendar button in order to make changes to calendar

**status**: active

**unique name**: planner events hub ui manage calendars button clicked

**trigger**: this action is triggered when user clicks on 'Manage calendars' button on the 'Calendars' card in upcoming events feature section

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 27.-upcoming events calendar check mark clicked

this action tracks the users who selects a calendar in order to use in upcoming events page

**status**: active

**unique name**: planner events hub ui upcoming events calendar check mark clicked

**trigger**: this action is triggered when user clicks on check mark in the edit state of 'Upcoming Events' card in the upcoming events

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property          | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ----------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| eventCalendarName | string                                                                           | Name of the calendar selected to use in upcoming events page                                                                                                                                                                                                              | yes      |
| appVersion        | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product           | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit      | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component         | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName   | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId            | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup       | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign       | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource         | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium         | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm           | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent        | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona         | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser        | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName  | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 28.-upcoming events setup button clicked

this action tracks the users who clicks on setup button in order to setup upcoming events calendar

**status**: active

**unique name**: planner events hub ui upcoming events setup button clicked

**trigger**: this action is triggered when user clicks on 'Setup' button on 'Upcoming Events' feature card on the Events+ hub feature page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 29.-upcoming events switch toggled

this action tracks the users who toggles upcoming events feature in order to turn it on or off

**status**: active

**unique name**: planner events hub ui upcoming events switch toggled

**trigger**: this action is triggered when user clicks on switch button on 'upcoming events' feature card in Events+ Hub feature page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property             | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| -------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| upcomingEventsStatus | string                                                                           | Shows the status of upcoming events feature whether it is on or off                                                                                                                                                                                                       | yes      |
| appVersion           | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product              | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit         | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component            | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName      | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId               | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup          | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign          | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource            | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium            | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm              | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent           | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona            | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser           | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName     | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 30.-your events switch toggled

this action tracks the users who toggles your events feature in order to turn it on or off

**status**: active

**unique name**: planner events hub ui your events switch toggled

**trigger**: this action is triggered when user clicks on switch button on 'Your events' feature card in Events+ Hub feature page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| yourEventsStatus | string                                                                           | Shows the status of your events feature whether it is on or off                                                                                                                                                                                                           | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_

### 31.-visibility check mark clicked

this action tracks the users who changes visibility in order to set the visibility of events+

**status**: active

**unique name**: planner events hub ui visibility check mark clicked

**trigger**: this action is triggered when user clicks on check mark on visibility section edit state on the visitor permissions page

**release**: v2.0

**sdk**: analytics.js

**owner**: red

**type**: track

**phase**: engagement

**destinations**: datadog,Snowflake,Mixpanel

**Properties**

| Property         | <div style="width:160px">Type</div>                                              | Description                                                                                                                                                                                                                                                               | Required |
| ---------------- | -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| visibilityStatus | string                                                                           | Conditions determines the visibility of the events+                                                                                                                                                                                                                       | yes      |
| appVersion       | string                                                                           | The current application version. Value should be grabbed from your app's package.json file                                                                                                                                                                                | yes      |
| product          | string                                                                           | Identifier to reference the product that is sending the action to the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                    | yes      |
| businessUnit     | string                                                                           | Identifier to reference the business unit in the downstream tools. Visit the Product Breakdown wiki to learn more                                                                                                                                                         | yes      |
| component        | string                                                                           | Unique identifier to reference the application that is sending the action to the downstream tools                                                                                                                                                                         | yes      |
| environmentName  | string                                                                           | Identifier to reference the environment where the action was sent from                                                                                                                                                                                                    | yes      |
| userId           | string                                                                           | Identifier to reference the user that executed the action                                                                                                                                                                                                                 | no       |
| \*userGroup      | **One Of**:<li>automation</li><li>internal</li><li>external</li><li>unknown</li> | Identifier to reference the group a user belongs to                                                                                                                                                                                                                       | yes      |
| utmCampaign      | string                                                                           | The campaign name the user belongs to. This property is automatically captured by the framework and set as a base property as long as the utm_campaign param is in the current url as part of the query string                                                            | no       |
| utmSource        | string                                                                           | The source of the traffic, that is, from which site, advertiser, or publication the user came from. This property is automatically captured by the framework and set as a base property as long as the utm_source param is in the current url as part of the query string | no       |
| utmMedium        | string                                                                           | Defines which medium the visitor used to find our website. This property is automatically captured by the framework and set as a base property as long as the utm_medium param is in the current url as part of the query string                                          | no       |
| utmTerm          | string                                                                           | Used to manually identify paid keywords targeted by your campaign. This property is automatically captured by the framework and set as a base property as long as the utm_term param is in the current url as part of the query string                                    | no       |
| utmContent       | string                                                                           | Used to identify the exact element on an ad or promotion that was clicked. This property is automatically captured by the framework and set as a base property as long as the utm_content param is in the current url as part of the query string                         | no       |
| \*persona        | **One Of**:<li>attendee</li><li>planner</li><li>speaker</li><li>visitor</li>     | Identifier to represent the user's characteristics                                                                                                                                                                                                                        | yes      |
| isCVIIUser       | boolean                                                                          | Identifier to reference if an action was executed by a user logging in from cvii or a user loggin from within the application                                                                                                                                             | yes      |
| trackingPlanName | string                                                                           | Identifier to reference the name of the tracking plan this action is associated with                                                                                                                                                                                      | yes      |

**Payload Example**:
_Not Provided_
