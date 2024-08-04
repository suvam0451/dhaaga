---
sidebar_position: 3
title: Build Using Expo
---

This guide covers compiling the apk using Expo EAS.

:::info

It is not possible to build the lite edition using this.
Please see steps to build it locally
[here](using-local-lite)
:::

### What you'll need

- An expo account
- Node.js (>20)
- Your own Mastodon app tokens
    - Using your instance UI
      \([example](https://mastodon.social/settings/applications/)\)
    - Or, Using API as
      shown [here](https://docs.joinmastodon.org/methods/apps/#create)
- *(Optional)* Your own OpenAI token

### Pre-Requisites

Please link your own expo account and modify your project settings
[as shown here](/guides/development/using-custom-expo-devclient#linking-your-expo-project)

### Send Compilation request

`yarn apk` to request an apk. `yarn aab` to request an aab.

Remember to update your app versions from `app.config.ts`

That's it. You now have your own apk 🥳

:::warning

Expo EAS is not free. You get 30 free credits per month.
Each android build counts as 1, iOS as 2.
:::