# 4. Apollo REST Datasource

Date: 2022-05-31

## Status

Accepted

## Context

[Apollo Datasources](https://www.apollographql.com/docs/apollo-server/v2/data/data-sources/) are an ApolloServer feature providing connection, request and cache management for REST APIs and databases.

Main benefits of Apollo Datasources over custom clients:

- Configurable cache storage with KeyValueInterface
- Access to the GraphQL Request's context
- Well documented and consistent interfaces and extension points

The REST Datasource additionally provides:

- GET request de-duplication (per ApolloServer instance)
- HTTP cache implementation with revalidation support
  - Default behavior respects standard cache hints from REST services
- pre-request processing (via willSendRequest)
- error handling (via didEncounterError)
- cache overrides (via cacheOptionsFor)
  - Fully customizable TTL
- cache key overrides (via cacheKeyFor)
- OOTB distributed cache store support with apollo-server-cache-redis and RedisCache construct from NX

Requirements we have that REST Datasource does not meet OOTB

- cache on write support (e.g. when updating an entity that is cached, the cache should be updated or invalidated)
- resiliency to remote store glitches (e.g. if we cannot write or read from the cache store, end-user requests should still be fully satisfied)
- support to skip the cache entirely when specifying custom header in the request to assist with operational support

Notably, the core Apollo team transitioned to a new set of maintainers around 2 years ago. The 'new' maintainers have not yet spent much time working on DataSources in general and particularly the RESTDataSource as one maintainer notes in this [GitHub Issue Comment](https://github.com/apollographql/apollo-server/pull/5070#issuecomment-847980268).

Also noteworthy is that the current HTTP clients in the planner-event-hubs project are using fetch from the nucleus-networking packages, which is deprecated and not receiving security updates without explicit requests from dev teams; so eventually we will need to migrate to @cvent/fetch.

### Additional Context: ApolloClient cache

ApolloClient is mentioned here to provide context and to jump-start discussion of further optimizations as needed. No decisions are being made within Graph layers yet, only REST clients.

ApolloClient manages its own cache and respects [cache hints from ApolloServer](https://www.apollographql.com/docs/apollo-server/v2/performance/caching/) GraphQL responses. ApolloServer can provide cache hints statically or dynamically. CDN support is available via [Automatic persisted queries](https://www.apollographql.com/docs/apollo-server/v2/performance/apq).

Further reading:

- https://github.com/ardatan/graphql-import/issues/153
- https://www.apollographql.com/blog/backend/layering-graphql-on-top-of-rest/#data-sources-partial-query-caching

References

- https://www.npmjs.com/package/apollo-datasource-rest
- https://www.apollographql.com/docs/apollo-server/v2/data/data-sources/
- https://github.com/apollographql/apollo-server/blob/main/packages/apollo-datasource-rest/src/RESTDataSource.ts
- https://khalilstemmler.com/blogs/graphql/how-apollo-rest-data-source-caches-api-calls/#Request-Deduplication
- https://www.apollographql.com/blog/backend/data-sources/a-deep-dive-on-apollo-data-sources/

## Decision

Rather than fully implement a custom data source from scratch, which would see us re-implement many features from the RESTDataSource that ships with Apollo, it will be cost-effective to spring-board a custom data source from the relatively small RESTDataSource package and then augment to fit the remaining requirements.

RESTDatasource should be the default choice when looking to integrate with a new REST API.

## Consequence

We will have full control over the RESTDataSource package that will allow us to implement necessary changes to meet requirements without re-inventing the wheel. Since RESTDataSource uses node-fetch and common request/response utilities from apollo-server-env, we can eventually switch node-fetch for @cvent/fetch. Also, because the ported package is based on code common with ApolloServer 2 & 3, we have the option to eventually backport to the original package.
