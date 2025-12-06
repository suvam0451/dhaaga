## Fediverse API Bridge

`@dhaaga/bridge` implements a unified api interface for the fediverse
and includes utility libraries and helper functions to easily build apps
and perform common SNS actions in a platform/protocol agnostic way.

- 🔋 Batteries included
- 🏰 Fully type-safe
- 🍰 Balances utility/flexibility using a layered approach 

### Supported Entities

At the heart of the bridge, all api response objects are
converted into one of the following primitives:

```js
enum BridgedEntity {
  USER, // --> profiles
  POST, // --> posts
  LINK, // --> mastodon links (not implemented, low prio)
  TAG, // hashtags
  FEED, // atproto feeds
  MESSAGE, // individual message items
  CHATROOM, // conversation
}
```

The following sections will demonstrate how the bridge library performs
these conversions using a layered approach, balancing flexibility and utility

### Api Client

Unlike other npm libraries, Dhaaga does not have separate 
API interfaces for each platform.

Instead, you provide a "driver" and a "server" string, plus
your auth credentials, and the bridge will route your request to
use the appropriate protocol and do the input conversions.

```ts
/**
 * For ActivityPub compatible platforms, this can be 
 * fond in the .well-nown endpoint
 */

type ATPROTO_PAYLOAD = AtprotoSession & {
  instance: string, // your server (e.g. - "bsky.social")
  pdsUrl: string,
}

type AP_PAYLOAD = {
  instance: string, // your server (e.g. - "misskey.io")
  token: string // your api key
}

type Payload = ATPROTO_PAYLOAD | AP_PAYLOAD

// this is how you generate a client interface
const client = ActivityPubClientFactory.get(
	driver, // your server's detected driver
        typeof Payload
)
```

In many cases, direct api calls need to be made using a specific driver group.
In such cases, you can cast the client object into the corresponding derived
class to perform those actions.

```ts
// this is how you generate a client interface
const client = ActivityPubClientFactory.get(
	driver, // your server's expected driver
	typeof Payload
)

// this will be typed for atproto!
const result = (client as BlueskyRestClient).accounts.get("123") 
```

^ This approach is recommended when not using parsers and implementors.

### Implementors

While the api client *(generated using code above)* lets you
make api calls in a platform-agnostic way, the response objects 
are still going to be shaped different.

The `implementors` read raw api outputs, and translate them into 
unified interfaces to inspect supported entities.

Using implementors directly *(skipping parsers)* is recommended, when:

- You want to access the original response objects 
- To perform protocol level work *(e.g. - lazy loading mastodon 
  parent posts, which needs >1 api calls)* 
- To support more flexible/advanced operations

```ts
// For objects
async function getEntityInterface(): Promise<UserInterface> {
  const resultA = await client.accounts.get("123") // fetch a profile
  if (resultA.isErr()) return // handle errors
  return UserParser.rawToInterface<unknown>(resultA.unwrap(), driver)
}

// For arrays
async function getEntityInterfaceArray(query: any): Promise<UserInterface> {
  const resultA = await client.accounts.likes(query) // fetch a profile
  if (resultA.isErr()) return // handle errors
  return UserParser.rawToInterface<unknown[]>(resultA.unwrap(), driver)
}
```

^ This is how you can consume api outputs as interfaces. Very useful for 
debugging, when parsers don't produce the expected results

### Parsers

- Storing original api payloads is heavy on RAM
- Interfaces are hard to consume *(e.g. - storage, transport etc.)*

Parsers compress the objects even further, converting the interfaces 
generated from above sections to **type-safe json objects**.

```ts
/**
 * You should determine and store the "driver" and "server" during login
 * process and cache it alongside your auth tokens.
 * 
 * e.g. - { "driver": "misskey", "server": "misskey.io", "token": "<secret>" }
 */

// To parse objects
async function getEntityObject(): Promise<UserInterface> {
  const resultA = await client.accounts.get("123") // fetch a profile
  if(resultA.isErr()) return // handle errors
  return UserParser.parse<unknown>(resultA.unwrap(), driver, server)
}

// To parse arrays
async function getEntityObjectArray(query: any): Promise<UserInterface> {
  const resultA = await client.accounts.likes(query) // fetch a profile
  if(resultA.isErr()) return // handle errors
  return UserParser.parse<unknown[]>(resultA.unwrap(), driver, server)
}
```

*NOTE: Parsing gets rid of the original response object. 
You can preserve them, if needed, using the code below:*

```ts
// For objects
async function getEntityObject(): Promise<UserInterface> {
  // if you need the implementor, as well
  const resultAA = await client.accounts.get("123") // fetch a profile
  if(resultAA.isErr()) return // handle errors
  const _interface = UserParser.rawToInterface<unknown>(resultAA.unwrap(), driver)
  const _object = UserParser.interfaceToJson<unknown>(_interface, driver, server)
}

// For arrays
async function getEntityObjectArray(query: any): Promise<UserInterface> {
	// if you need the implementor, as well
  const resultAA = await client.accounts.get("123") // fetch a profile
  if(resultAA.isErr()) return // handle errors
  const _interface = UserParser.rawToInterface<unknown[]>(resultAA.unwrap(), driver)
  const _object = UserParser.interfaceToJson<unknown[]>(_interface, driver, server)
}
```

---

© 2025 Debashish Patra