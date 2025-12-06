# Shared Packages

---

## @dhaaga/bridge

Workhorse behind the Dhaaga project.

Implements an api/interface/object level interface
around supported decentralized protocols and 
api client libraries.

It is designed to be consumed in three levels 
of abstractions:

### A) As a unified API Client

Intended for low-level consumption and response body post-processing (for 
example, [how mastodon returns pagination tokens embedded in headers]
(https://docs.joinmastodon.org/methods/bookmarks/), or how misskey uses per-post
separate keys for pagination.

Consumers of this library should never have to use this level of abstraction.

```ts
const client = new DhaagaClient(crdentials);
const data = await client.statuses.getPost(id);
console.log(data)
```

### B) As an abstraction interface

A balanced middle layer between the raw response object model and the object 
model.

At this layer of abstraction, we can still do protocol level operations 
since we still have access to the raw response object, along-with various 
utility functions built on top of it..


```ts
const DRIVER = "bluesky" | "mastodon" | "misskey"
const client = new DhaagaClient(crdentials);
const data = await client.statuses.getPost(id);
const i = PostParser.rawToInterface(data, DRIVER);
console.log(i.isReply());
```

### C) As an object model

At this level of abstraction, the api response has been:

- processed into a simple JSON object.
- decluttered of redundant/irrelevant information
- is type-safe
- all contents have been processed into ASTs (MfM, Facets, etc.)

This efficient format can be stored and operated on using the following 
helper libraries:

- Processors → 1-pass calculations to embed extras *(e.g. - post reply count)*
- Viewers → helper functions to extract any relevant information
- Mutators → helps perform api action on the object model *(e.g - like/share)* 

This is 95% of what the downstream apps interact with.

```ts
const DRIVER = "bluesky" | "mastodon" | "misskey"
const SERVER = "misskey.io" | "mastodon.social"
const client = new DhaagaClient(crdentials);
const data = await client.statuses.getPost(id);
const post = PostParser.parse(data, DRIVER, SERVER);

// if -> post.meta.isReply
console.log(post.replyTo.postedBy, post.replyTo.content.parsed);
// else
console.log(post.postedBy, post.content.parsed);
```

## @dhaaga/react

Since we have two react codebases *(mobile and web)*, this library stores
the shared components between them:

- reducers
- react context wrappers
- hooks *(authentication, session, etc.)*
- state management logic

## @dhaaga/orm

I wrote my own sqlite ORM after mongodb 
[deprecated realm db](https://github.com/realm/realm-swift/discussions/8680) 
and caused the project months of setback and architectural pivot.

It has full entity CRUD support, migration runners/sync 
and fully integrates with expo-sqlite with no gotchas.

I wanted maximum flexibility and long-term stability; So, I chose not to 
go with any existing library solutions.

## @dhaaga/db

Used by the mobile app only.

Entity definitions and repo/service functions and utility
wrapper for said entities.