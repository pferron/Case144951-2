# 8. Subscriptions in video center - Connections

Date: 2023-04-25

## Status

Accepted

## Context

We need to notify the logged in member that new connection request has been sent to that member.
We want to avoid reloading the page again and again and want to update the same in the real time. We are using subscriptions provided by Apollo for achieving real time notifications for new connection requests.
In addition to queries and mutations, GraphQL supports a third operation type: subscriptions.

Like queries, subscriptions enable you to fetch data. Unlike queries, subscriptions are long-lasting operations that can change their result over time. They can maintain an active connection to your GraphQL server (most commonly via WebSocket), enabling the server to push updates to the subscription's result.

Subscriptions are useful for notifying your client in real time about changes to back-end data, such as the creation of a new object or updates to an important field.
When connection request is sent to any contact, we are sending a mutation update from attendee-connections which in turn triggers our subscription.

## Decision

We have created new hook useSubscription which can be used on any page. Top Navigation panel will be updated with the new pending connection count until there is any action(Accept/Decline) on that request.

## Consequences

Real time updates on connection without reload