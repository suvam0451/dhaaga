<h1 align="center">Dhaaga</h1>

<p align="center" style="max-width: 390px; margin: auto">
    An opinionated, cross-platform (Android & iOS) mobile client for 
Mastodon and Misskey
</p>

## About

This mobile client is my contribution to the fediverse.

I started this project to build creative solutions to the little nuances and
inconveniences in ActivityPub ecosystem.

The project is in **very early MVP stage**.

## Features

#### Timeline Widget

An intuitive way to switch between timelines/hashtags/lists.

<details>
<summary>Screenshots</summary>
<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/a22abeb0-105f-47cb-b9af-380789038a44" 
/>
</details>

<details>
<summary>Highlights</summary>
    
- ✅ Search and browse hashtags
    - 🚧 Guest browsing a hashtag from remote instance will be supported in the
      future.
- ✅ Search and browse a user's timeline directly
- ✅ Browse your list timelines
- 🚧 Remote instance browsing will be added in the future
</details>

#### Better Translation Support

Ethical use of AI tools to break language barrier and improve communication.

<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/ac99610f-3479-4f7a-a890-3cc9547fbbe3" 
/>

<details>

<summary>Highlights:</summary>

- ✅ Long-Press translate button to generate explanation with openAI
    - 🚧 Only english is supported for demonstration.
- 🚧 This feature will be added for alt-texts

</details>

## Planned Features

Some distinctive features I am considering adding to the app:

- 🖼️ A **bookmark gallery**, that lets us browse bookmarks by
  hashtag/user.
- 🖼️ A dedicated **gallery mode** for user profile browsing, to better
  appreciate Artist profiles.
- 🔒 Ability to **privately follow hashtags/users** client-side.
- 🔒 **A client-side block-list, that can be hosted online and shared
  between users using a QR code** (similar to DNS filters). The user can
  configure the rules in-app.

### Building From Source

This project is a monorepo. You can find individual README files in
`/packages` and
`/apps/*` folders with specific instructions.

### Meaning and Legacy

Dhaaga (धागा) is the Hindi word for a type of thin, twisted strand of fiber (generally used for sewing).

In many cultures, it also symbolizes connections, ties, or threads that bind
people or things together.

<details>
<summary>The Old Desktop App</summary>
This project started in 2023 to be a desktop app supporting Mastodon
and Meta's Threads platform. Development was halted because of Meta's
legal notice to various reverse-engineering APIs to cease development.

The project was rebooted in May 2024 as a mobile Fediverse client.

You can read the legacy README [here]()
</details>

### License

The source code for this project is made available under [AGPL-3.0 license]()

For explicit purpose of distribution via app stores,
additional changes are requested by the developer.
You can read
more [here](https://github.com/suvam0451/dhaaga/blob/feat/better-comment-thread/COPYING.md#request-for-forksusers-intending-redistribution-of-binaries)

<details>
<summary>Other licenses</summary>
As of now, there are no art assets that need separate licensing. If ever added,
they will be put in a folder isolated from remaining source code and license
made clear.

All fonts used have FLOSS license. You can find them in `/packages/fonts/*`.
</details>

--- 

© 2023-Present Debashish Patra 
