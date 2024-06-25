### About

These are the internal, shared packages for this project.
They are written in typescript and can be imported directly (So, no need to
build)

### Their Utility

#### shared-abstraction-activitypub

This package defines adapters and interfaces for common types of entities
found in ActivityPub (e.g. - Status, Profile)

By using adapter pattern, we try to abstract away the fragmented api logic
in the fediverse.

For example, many a times, different implementations of ActivityPub have
different APIs to perform the same action. Or, their data shape might be
different.

In other cases, an action might be entirely unsupported (e.g - custom emoji
reaction in Misskey and its forks).

#### shared-provider-mastodon

We try to use existing libraries (such as misskey-js, masto.js, megalodon).
But, sometimes, we just have to write our own code to suit project needs.

This package houses those custom code.

#### shared-provider-misskey

Same as above, but for Misskey

#### shared-utility-html-parser

Parsing post content in a web client --> 😇
Parsing post content in a mobile client --> 🥲

It is very tricky to get HTML content rendering correctly in a native app.
This includes support for instance emojis, parsing links and hashtags etc.

This package acts as a middleware, which manipulates the received HTML content
to make it easier to be consumed by a node-based parser
like [MFM-js](https://github.com/misskey-dev/mfm.js).

### Their Purpose

Just keeping all this logic separate, in case I ever have to bring back the
desktop app.