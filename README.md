# Dhaaga

Dhaaga client is an unofficial, feature-rich social media client for popular social media websites.

Currently supports Meta's [Threads](https://www.threads.net/) and [Mastodon](https://joinmastodon.org/) platform, with a direction to support other popular [Fediverse](https://en.wikipedia.org/wiki/Fediverse) platforms.

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/client-showcase/Project_Home.png" alt="Home Screen">
</p>

Special shotout to [The Wails Project](https://wails.io/) and it's creator [@leaanthony](https://github.com/leaanthony), without whose contribution in the go/js open source community, this project would not have been poossible.

<br/>

## Summary

- [Vision](#vision)
- [How to install](#how-to-install)
- [Disclaimer](#disclaimer)
- [Features](#list-of-features)
- [FAQ](#faq)
- [Feature Roadmap](#feature-roadmap)
- [Final Words](#final-words)
- [License](#license)

<br/>

## Vision

### What this app wants to be:

- 🫶 A reimagined way of browsing the Fediverse.
- 🔍 A cross-platform, cross domain interest discovery and tracking tool.
- 🖼️ A convenient and damn pretty ✨ gallery and daily newsletter app.
- 🧑‍💻 An OSINT tool (Disclaimer: FOR EDUCATIONAL PURPOSE ONLY! The contributors do not assume any responsibility for the use of this tool.)
- 😇 An API friendly client, with client-side caching and optimisations to prevent spam.

### What this app does not want to be:

- ❌ An official client recognized by any social media platform.
- ❌ An alternative to the official apps (or third party alternatives thereof), with 100% feature coverage.
- ❌ A content scraping tool.

<br/>

## How to install

<div align="center">

| OS              | Download                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------ |
| Windows         | [Download](https://github.com/suvam0451/dhaaga/releases/download/v0.4.0/Dhaaga-Windows-v0.4.0-installer.zip) |
| MacOS Universal | [Download](https://github.com/suvam0451/dhaaga/releases/download/v0.4.0/Dhaaga-MacOS-Universal-v0.4.0.zip)   |
| MacOS M1        | [Download](https://github.com/suvam0451/dhaaga/releases/download/v0.4.0/Dhaaga-MacOS-M1-v0.4.0.zip)          |

</div>

<br/>

### Building on your own

**Ensure you've [Node & NPM](https://nodejs.org/en/download) and [Go 1.18](https://go.dev/dl/) already installed**

1. Install 'wails' CLI tool:

```sh
$ go install github.com/wailsapp/wails/v2/cmd/wails@latest
```

<br/>

2. Building for your system (can take some time):

```sh
$ wails build
```

<br/>

3. Moving builded binary/executable to a suitable location:

#### MacOS

```sh
# M1 Mac
wails build -platform darwin/amd64
# Intel Mac
wails build -platform darwin/universal
```

#### Windows

Just copy or cut 'build/bin/Dhaaga.exe' to any suitable location for easy access.

<br/>

## Disclaimer

This client is designed to be responsible and respectful and it is up to you to decide what you do with it. I don't claim any responsibility if any of your social media account is affected by how you use this client.

<br/>

## ✨ List of Features

### New in v0.6.0

<details>
 <summary>Onboarding workflow for Mastodon 🐘 + Improved columns 🚀</summary>

### Summary

I spent a lot of time to enhance column interactions and provide a decent authentication workflow for Mastodon users.

Features included:

✨ In-App Auth workflow for Mastodon

OAuth workflow for Mastodon is now supported.

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/desktop-docs/mastodon-auth/Step3-Paste-Code-And-Create-Account.png" alt="Mastodon Auth">
</p>

✨ Auto-Pagination feature for columns. Auto-Loading next set of posts in sets fo 20 is a nice QoL.

However, to prevent memory issues, the user may only auto-scroll 100 posts. After that, the user will have to manually click to load the next set (100-200) of posts.

✨ **Snap Navigation:** The idea is to use arrow keys or in-app buttons to snap the tip of the column to the next/previous post. Example below, I use kyeboard to scroll through posts.

The **Snap Navigation** feature is a unique selling point of this app, that I want to explore further.

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/desktop-showcase/Snap-Navigation.gif" alt="Snap Navigation">
</p>

### Key Learnings

After banging my head against a brick wall for hours, I now fully understand why useRef hook exists.

State updates don't always work as expected, especially when a bunch of providers are wrapped around a component. The useEffect hooks may get triggered from modifications, but when you read the stole, you may get stale values.

useRef is the best way to deal with these:

```ts
// this is a store/context provider (based on https://www.youtube.com/watch?v=5LrDIWkK_Bc)
const { store: inViewStore, dispatch: inViewDispatch } = useInViewHook();
// workaround to "copy" the store value to a ref
const inViwStoreRef = useRef<any>();
inViwStoreRef.current = inViewStore;

const keyPressHandler = (e: any) => {
	// ❌ stale data
	console.log(inViewStore);
	// ✅ fresh data
	console.log(inViewStoreRef.current);
};
```

</details>

### New in v0.5.0

<details>
 <summary>Support for Mastodon is here !!! 🐘 🚀</summary>

### Summary

I am hard at work to figure out what would be the best way of browsing Mastadon from an universal fediverse client.

The old school column based Mastadon clients really clicked with me and I am excited to share more about the navigation framework I will be using.

- ✨ Stack based navigation with breadcrumbs
- ✨ Fully keyboard based navigation for important modules
- ✨ Scroll-To-Top for every page !

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/client-showcase/Mastadon_Navigation_Design_01.png" alt="Search Screen">
</p>

I took design references from [IceCubes](https://github.com/Dimillian/IceCubesApp), because I believe it is the best compact client for Mastodon out there.

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/client-showcase/Mastadon_Navigation_Design_02.png" alt="Search Screen">
</p>

A stack based navigation workflow sets me up for an easy way forward and code reuse, when I build a mobile app for this project. 📱

### Key Learnings

Did you know that Mastadon returns the full HTML for the post content? Of which, all links will initially point outside your app.

It is quite an regular expression headache to

- separate external links
- identify tags and usernames
- and redirect them to internal resources of your app

</details>

### New in v0.4.0

<details> 
 <summary>Profile Indexing for Threads (Needs Auth) + In-App Task Manager</summary>

### Summary

Threads makes it very difficult to browse posts and discver new users from the desktop. This update adds a task system to index all posts from a specific user in the background.

UPDATE: This section has been redacted, because I temporarily disabled auth support in v0.5.0 -- Third party instagram clients are a gray area and I do not have enough testing accounts to make this auth module robust for end users. Once I have more testing support, I will re-enable this feature.

</details>

### New in v0.3.0 (First Public Release)

<details>
 <summary>Gallery View + User Favourites + Local Archival --> for Meta's Threads</summary>

Alright. The new social media platform is in the town, and we are here to experience it from our desktops. But, threads does not have a desktop client. How can we fix that?

Well, I am glad you asked. I have been working on a desktop client for threads for a while now. And I am happy to announce that the first public release is here.

It allows searching, browsing and indexing posts and profiles, without the need for an account. And it is completely free and open source.

### Search Feature for Meta's Threads

- ✨ Browse posts from your favourite creators !
- ✨ Keyboard based navigation !
- ✨ Gallery with strip for content peek !

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/client-showcase/Search_Showcase.png" alt="Search Screen">
</p>

### User Discovery (Integrated Module)

- ✨ Discover your interests and add users on the fly !
- ✨ Immediate mode lookup for related users !

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/client-showcase/Immediate_Mode_Lookup_Availability.png" alt="Immediate Mode Lookup">
</p>

^ For e.g. - I was able to discover this talented artist ([qtonagi](https://www.threads.net/@qtonagi), reposted by [risumi_illust](https://www.threads.net/@risumi_illust)) I never knew about. And I could immediately add them to my favourites and browse their timeline. 🤗

### User Discovery (Dedicated Module)

- ✨ Important parts of the cache for each social media platform will be available via an in-app dashboard.
- ✨ Follow without showing that you follow 😉
- ✨ Your copy of the client. Your login credentials.
- ✨ That means you own all data generated by this client.

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/client-showcase/Showcase_Dashboard_User_Discovery.png" alt="Database Showcase">
</p>

### User Discovery (Database Module)

- ✨ Full access and documentation for your sqlite store.
- ✨ I try my best to design the app to be OSINT friendly for non-techie research scholars, who I am sure can make much better use of the data than me.
- ✨ All features are opt-in. You can choose to not use the features that you don't want to use.

<p align="center">
  <img width = "720px" height="auto" src="/apps/web/public/assets/client-showcase/Showcase_Sqlite.png" alt="Sqlite Showcase">
</p>

</details>

<br/>

## FAQ

Q. Looks good to me ! Where can I ping you for more features?

A. You can join my [discord](https://discord.gg/k8Wzxea7) to help with development and suggest features.

Q. Will you be supporting authenticated workflows?

A. Well, writing and maintaining wrappers for multiple social media APIs is extremely time-consuming.
However, thanks to the incredible work done by the open source community ([threads-api](https://github.com/junhoyeo/threads-api) by [@junhoyeo](https://github.com/junhoyeo) and co, [masto.js](https://github.com/neet/masto.js) by [@neet](https://github.com/neet) and co), I can solely focus on building the experience 💪.

<br/>

## Feature Roadmap

Tentative to my availability. I try to ship one major feature per version.

Some features in immediate consideration are (sorted by priority):

- ✨ [favourites page] fovuriting posts and showing liked posts in
- ✨ [search page] rendering support for shorts in gallery
- ✨ [search page] [database] rendering support for multi-image posts
- ✨ [frontend] add threads-api support, to extend the posts that can be fetched
- ✨ [worker] one click sync support, to populate all favourited feeds and delta patch the cache
- ✨ ... or join [discord](https://discord.gg/k8Wzxea7) to suggest additional features 😇

<br/>

## Final Words

`Dhaaga (धागा)` is a common word for `thread` `yarn` and `string` in Hindi.

In popular culture, strings are used to depict the basis of human interaction self, with nature and each other.

~~Also, I liked Kimi no na Wa and the name was mostly free in GitHub search results. Hence the name. 🤣~~

![Kimi no na Wa](/apps/web/public/assets/client-showcase/Your_Name_Threads.jpg)

If you find this project interesting, please consider starring it (⭐).

I am a hardcore night owl bringing you interesting projects and stars in the sky 🌃 make burning the midnight oil feel worth it. 🙏

<br/>

## License

[![License: AGPL v3](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Debashish Patra @ 2023
