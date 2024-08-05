---
sidebar_position: 2
title: Using Expo
---

This guide helps you develop your copy of Dhaaga *(using Expo)*.

### What you'll need

- Latest DevClient from
  GitHub [Releases](https://github.com/suvam0451/dhaaga/releases)
- Node.js (>20)
- Your own Mastodon app tokens
    - Using your instance UI
      \([example](https://mastodon.social/settings/applications/)\)
    - Or, Using API as
      shown [here](https://docs.joinmastodon.org/methods/apps/#create)
- *(Optional)* Your own OpenAI token

No app token is required while working with Misskey and it's forks.

No expo account is required, unless modifying native code (more info below).

### Setting up the DevClient

Download and install the latest DevClient apk on your phone.

:::tip

If you plan on tweaking native code/packages, you will need
to [build your own DevClient](using-custom-expo-devclient)

:::

### Setting up Secrets

There is a file called `.env.example` in the apps/mobile folder.

Copy it as `.env` and fill your tokens. **This is used by the DevClient only.**

```shell
EXPO_PUBLIC_MASTODON_CLIENT_ID=
EXPO_PUBLIC_MASTODON_CLIENT_SECRET=
EXPO_PUBLIC_OPENAI_API_KEY=
```

There is a file called `eas.example.json` in the apps/mobile folder.

Copy it as `eas.json`. Fill your tokens there. **This is used when building
final apks.**

^ Remove the unused lines (expo won't accept empty string).

### Building Packages

The projects in /packages/* and peer dependencies that need to be
built first:

- `yarn build` from root directory to build everything *(for first time use)*
- `yarn build` from directory of modified package *(during development)*

### Starting Development Server

Run `yarn dev` from apps/mobile folder. A QR code will pop-up. Open your
DevClient and scan it, on enter it manually.

Edit some Javascript and see your changes live. You are all set 🥳.

## FAQ

**Q. Can I use an emulator?**

A. Sure. Same steps. I personally would not recommend it, as it is extra
stress on your ram. Also, gestures won't behave as expected.

**Q. My fast refresh is not working?**

A. Shake your phone. A menu should pop up. See if "Fast Refresh" is enabled.

**Q. My screen is white and manual refresh does not work?**

A. Happens sometimes. Close and relaunch the DevClient apk and then press manual
refresh from your server terminal.

**Q. What about Profiling and other tools?**

A. Still new to RN/Expo. I will add more stuff as I figure them out ✌️