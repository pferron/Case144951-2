# 8. Member login/signup using magic link

Date: 2023-04-25

## Status

Accepted

## Context

Member login/signup in a video center can be done by entering your firstName, lastName and email on login or signup modal. 
This will send email with a magic link which will directly login or signup the member into video center and refresh all the tabs opened for the same video center .

Magic link - this experience was originally designed for native mobile apps to make it easy to login when email clients are configured, and people generally don't use password managers. It also gives better deep linking possibilities to apps. While we are not as mobile focused, a significant amount of tech work has been completed on this which would could use to start. Advantages are opposite of those of standard username/password: no 2FA required, no password complexity, etc.

This magic link will contain requestId in the url which will correspond to a couchbase document contain details about member, number of times email has been sent by the same member in order to prevent spamming etc.

Example magic link :  https://web-staging.cvent.com/video-center/c3058110-8b20-48b9-a30b-9b0485ca2b57?env=S606&requestId=15fbd666-57ba-4e2c-9b86-e0476cd48b90

## Decision

Right now we will only use magic link sent in the email to se possible way to login/signup into the video center.

## Consequences

Member can simply enter into video center by single click on the email. But, there can be some delays in reaching emails to the email box. 