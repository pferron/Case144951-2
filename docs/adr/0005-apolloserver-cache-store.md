# 5. ApolloServer Cache Store

Date: 2022-05-31

## Status

Accepted

## Context

### Operational Costs

#### DynamoDB (709.32 USD - 1,393.64 USD /month)

Estimated monthly cost based on _peak_ usage seen in AH over 7 days from May 9 - May 16 2022

Monthly total: 709.32 USD - 1,393.64 USD

- 25 USD /month data storage
- 613.20 USD /month eventually consistent read operations
  - 1,226.40 USD /month for strongly consistent read operations
- 71.12 USD /month standard write operations
  - 142.24 USD /month transactional write operations

Above rates arrived at using AWS Cost Calculator and peak CloudWatch metrics from AttendeeHub (below), using OnDemand capacity only and no DAX selection

- 100GB storage at average item size of 3KB
- 100% standard writes at 433 per minute (TTL deletions + write operations from CloudWatch)
- 100% eventually consistent reads at 112,000 per minute

attendee-experience-data-table-production CloudWatch metrics

- provisioned as on-demand
- stores ~400mb in Dynamo
- peaked at 1.12k read ops
- peaked at 433 write ops
- encountered throttling for 85 write ops (throughput exceeded per-minute capacity)
- peaked at 57k TTL deletions (TTL deletes are provided at no cost by AWS) https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TTL.html
- total cost for 2022 ??

#### Redis (37.23 USD - 148.92 USD)

- 3 nodes of cache.t3.micro (0.5 Gib / 537 MB) OnDemand instances, No Data Tiering and 100% utilization: 37.23 USD
- 3 nodes of cache.t3.small (1.37 GiB / 1471 MB) OnDemand instances, No Data Tiering and 100% utilization: 74.46 USD
- 3 nodes of cache.t3.medium (3.09 GiB / 3318 MB) OnDemand instances, No Data Tiering and 100% utilization: 148.92 USD

### Development Costs

#### DynamoDB

Main problems faced by AttendeeHub (in order of effort)

1. Hot Keys
1. Batching/accessing multiple docs
1. Preventing cache stampedes
1. Handling situations where our docs are too big for DynamoDb

It's not clear how much development time has been invested here; the work to maintain and improve the Dynamo integration has been on-going.

#### Redis

Redis avoids 3 of the above problems faced by DynamoDB, leaving only cache stampedes as a concern. ApolloServer Data sources provide request de-duplication out of the box that will help with stampedes.

## Decision

AWS ElastiCache for Redis will be the remote store for REST resource data.

We looked at AttendeeHub as guiding light, and considered development and operational costs.

## Consequence

Redis should allow for less investment in development time and operational overhead (relative to Dynamo)
