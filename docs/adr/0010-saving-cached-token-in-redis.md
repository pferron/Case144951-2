# 10. Saving cached tokens in redis 

Date: 2023-04-25

## Status

Accepted

## Context

In order to avoid security risks we don't want to provide all the roles to the public token(cvent-auth) as anybody can use that token to hit APIs, graphql layer with additional roles and accesses which were provided for that public token.

Hence, public token will only have minimal access for video hub ui and we will be creating new token with all the required roles while calling graph layer of planner-event-hubs. All the required roles will be present in 

https://stash.cvent.net/projects/AX/repos/planner-event-hubs/browse/packages/planner-event-hubs-ui/src/server/auth/authorizations.ts

We can add new role we want to provide to above file.
Newly created token will be created for 23 hours
We will cache this newly created token in Redis for 24 hrs. We are using same common logic for redis caching already present in video hub ui.

We are also caching one time token created for subscription connection in redis. 

## Decision

Redis will use the same token for 24 hours instead of creating new one everytime with all the required roles.
We are creating token for 23 hours intentionally because 24 hours is the max limit from auth-service and we want to set 23+1(24) hour of cache in order to avoid wonkiness around expiration

## Consequences

This will reduce network calls to auth service for creating token everytime and will be reusing the same token from the redis cache.