# 2. VHUI as universal video proxy

Date: 2022-02-04

## Status

Accepted

## Context

S3 requires that we provide a security token inorder to access thumbnails and videos.  universal-video is responsible for generating
the tokens, but will only do so in the presence of a token (bearer or api key).  The security tokens can have varying length of 
validity (usually 24 hours, but changing that length will require a ruling from security team).

## Decision

All requests for video related content (thumbnails, HLS, MP4, etc) will need to flow through the graphQL layer in VH-UI so that the
token (api key in this case) can be add by the VHS-UI backend.

## Consequences

It means that all requests have to go through an extra layer (browser can't directly talk to UVS).
