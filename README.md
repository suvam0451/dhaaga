<h1 align="center">Dhaaga</h1>

<p align="center" style="max-width: 390px; margin: auto">
    An opinionated, cross-platform (Android & iOS) mobile client for 
Mastodon and Misskey
</p>

### About

Welcome! This mobile client is my personal contribution to the fediverse.

I started this project to build creative solutions to the little nuances and
inconveniences of ActivityPub and it's implementations,
which, in my opinion, drive a normal user like myself away from viewing
fediverse as a viable social networking alternative.

The project is in it's **very early MVP stage**. But, after a month of
groundwork, I am now comfortable in sharing builds and updates to get more
eyes on the project.

Some essential features like composing posts is not supported yet.
So, star the project and be on the lookout for a stable build in upcoming
months.

^ Most of the browsing features are done already. If you don't mind the
above, then please feel free to contribute.

### Features

#### Timeline Widget

A convenient and intuitive way to switch between timelines/hashtags/lists.

No need to pin/set anything in advance. Just search, set and launch.

<details>

<summary>Highlights:</summary>

- ✅ Search and browse hashtags
    - 🚧 Guest browsing a hashtag from remote instance will be supported in the
      future.
- ✅ Search and browse a user's timeline directly
- ✅ Browse your list timelines
- 🚧 Remote instance browsing will be added in the future

</details>

### Planned Features

The usual features found in any other Mastodon/Misskey clients will
continue to be added.

Some distinctive features I am considering adding to the app, in the future:

- [Utility] A **bookmark gallery**, that lets us browse bookmarks by
  hashtag/user.
- [Utility] A dedicated **gallery mode** for user profile browsing, to better
  appreciate Artist profiles.
- [Privacy]: Ability to **privately follow hashtags/users** client-side.
- [Privacy]: **A client-side block-list, that can be hosted online and shared
  between users using a QR code** (similar to DNS filters). The user can
  configure the rules in-app.

### Building From Source

This project is a monorepo. You can find individual README files in
/packages and
/apps/* folders with specific instructions.

### Legacy and Meaning

Dhaaga (धागा) means "thin, twisted strands of fiber (used for sewing)".
In many cultures, it also symbolizes connections, ties, or threads that bind
people or things together.

This project started in 2023 to be a desktop app supporting Mastodon
and Meta's Threads platform. Development was halted because of Meta's
legal notice to various reverse-engineering APIs.

You can read the legacy README [here]()

### License

The source code for this project is made available under [AGPL-3.0 license]()

For explicit purpose of distribution via app stores,
additional changes are requested by the developer.
You can read
more [here](https://github.com/suvam0451/dhaaga/blob/feat/better-comment-thread/COPYING.md#request-for-forksusers-intending-redistribution-of-binaries)

As of now, there are no art assets that need separate licensing. If ever added,
they will be put in a folder isolated from remaining source code and license
made clear.

All fonts used have FLOSS license. You can find them in `/packages/fonts/*`.

--- 

© 2023-Present Debashish Patra 