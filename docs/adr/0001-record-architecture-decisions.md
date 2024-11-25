# 1. Record architecture decisions

Date: 2022-02-04

## Status

Accepted

## Context

We need to record the architectural decisions made on this project.

## Decision

We will use Architecture Decision Records, as [described by Michael Nygard](http://thinkrelevance.com/blog/2011/11/15/documenting-architecture-decisions).

## Consequences

See Michael Nygard's article, linked above. For a lightweight ADR toolset, see Nat Pryce's [adr-tools](https://github.com/npryce/adr-tools).  It is recommended that you install these tools as it will make it easier to create and manage ADR documents.

Install adr-tools:

```shell
asdf plugin add adr-tools
asdf install
```

Create new proposal:

```shell
adr new Title of Proposal
```