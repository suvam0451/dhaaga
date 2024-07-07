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

## ✨ Features

#### 🌟 Timeline Widget

An intuitive way to switch between timelines/hashtags/lists.

<details>
<summary>Screenshots</summary>
<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/af8310f9-9701-4765-b212-6b3092c86af5" 
/>
<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/aa9c4101-2106-41c1-a85c-2de4272f1e03" 
/>
<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/a22abeb0-105f-47cb-b9af-380789038a44" 
/>
<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/8b2cee3d-79d6-4938-a993-71302d3ac7cc" 
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

#### 🌟 Better Translation Support

Ethical use of AI tools to break language barrier and improve communication.

<details>
<summary>Screenshots</summary>
<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/ac99610f-3479-4f7a-a890-3cc9547fbbe3" 
/>
</details>

<details>

<summary>Highlights:</summary>

- ✅ Long-Press translate button to generate explanation with openAI
    - 🚧 Only english is supported for demonstration.
- 🚧 This feature will be added for alt-texts

</details>

#### 🌟 Better Comment Threads

A cleaner comment browsing experience, taking references from lemmy clients.

<details>
<summary>Screenshots</summary>
<img 
    width = "384px" 
    height="auto" 
    src="https://github.com/suvam0451/dhaaga/assets/44526763/6d96bbf5-0a33-40e6-8155-6258951ff303" 
/>
</details>

<details>
<summary>Highlights:</summary>

- ✅ Nested comments of any depth is supported
- ✅ Replies are color-coded to make it easy to track origin
- 🚧 Use a dedicated color palette, instead of random colors
- 🚧 More interaction options
- 🚧 Global actions like "Collapse/Expand All"

</details>

## ✨ Planned Features

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

Dhaaga (धागा) is the Hindi word for a type of thin, twisted strand of fiber (
generally used for sewing).

In many cultures, it also symbolizes connections, ties, or threads that bind
people or things together.

<details>
<summary>The Desktop App</summary>
This project started in 2023 to be a desktop app supporting Mastodon
and Meta's Threads platform. Development was halted because of Meta's
legal notice to various reverse-engineering APIs to cease development.

The project was rebooted in May 2024 as a mobile Fediverse client.

You can read the legacy README [here]()
</details>

### License

The source code is licensed to you under [AGPL-3.0](./LICENSE) only.

You agree to make your contributions be
licensed under [MIT]().

The author reserves the right to dual-license
any package from this project
under either of the above licenses.

If you are distributing a fork of this project via any app store
or package manager, please
consider using distinctive logo and name.

For any other enquiries, please [mail the author](mailto:hi@suvam.io).

--- 

© 2023-Present Debashish Patra 
