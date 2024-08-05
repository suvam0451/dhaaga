---
sidebar_position: 2
displayed_sidebar: discoverSidebar
title: Interacting With Posts
---

It is no secret that this UI is heavily inspired by Facebook.

I grew up with it and have fond memories from the glory days of facebook.

Also, not a big fan of how every app is a twitter clone 🫠, so here's my
humble hat in the ring int he design department.

## The Core Interactions Sheet

It is available for every post. And the actions and indicators have been
standardised, regardless of software.

:::info

Some of the important actions (like Boost) do not have a confirmation
dialogue, as of yet.

:::

### How it Looks

<img
src={"https://github.com/suvam0451/dhaaga-assets/blob/main/assets/usage-guide" +
"/posts/basic.png?raw=true"}
alt={"basic"}
width={480}
/>

### What it Does

✅ Implemented | 🚧 Coming Soon | ⏱️ Planned

- **Reply**:
    - 🚧 **Short Press:** Opens Reply Sheet
    - 🚧 **Long Press:** Opens Reply Sheet with "quote post" template
    - 🚧 **Highlighted When:** You have either replied or quoted this post
- **Boost**
    - ✅ **Short Press:** Boosts the post
    - ⏱ **Long Press:** Shows more boost/share options
    - ✅ **Highlighted When**: Boosted this post
- **Save**
    - ✅ **Short Press:** Bookmark the post
    - ⏱ **Long Press:** Add to Clip (Misskey feature)
    - ✅ **Highlighted When:** Bookmarked
- **Translation**
    - 🚧 **Short Tap:** Translate using instance DeepL or LibreTranslate
    - ✅ **Long Press:** Explain using OpenAI *(Not available in Lite edition)*
    - ✅ **Highlighted When:** Translated/Explained
- **More Options**
    - ⏱ **Short/Long Tap:** Shows the "More Options" bottom sheet with tons of
      extra options

## The Stat Interactions Sheet

It is shown when there is at least one from any of

- Replies
- Boosts
- Favourites

<img
src={"https://github.com/suvam0451/dhaaga-assets/blob/main/assets/usage-guide/posts/stats.png?raw=true"}
alt={"basic"}
width={480}
/>

The current interaction is pretty basic.

- You press star to favourite the post (N/A for Misskey forks)

- **Star Icon**
    - ✅ Short Press: Add/Remove Favourite (Mastodon only)
    - ✅ Highlighted When: Favourited (Mastodon only)

:::info

In a future update, these metrics will be clickable, opening a bottom sheet
right on top of your timeline.

You will be able to see who boosted/liked or even replies without going to
another screen !!!

:::

## The User/Hashtag/Link sheets

Normally, clicking on a hashtag takes you to the corresponding timeline.

Clicking on a user takes you to th profile page

~~^ Don't quote me on that. I know Phanpy opens a bottom sheet for some of
these.~~

The bottom sheets in Dhaaga are implemented, but in very early phase of
development.

<details>
<summary>Here are a few screenshots, if you are interested</summary>

<img
src={"https://github.com/suvam0451/dhaaga-assets/blob/main/assets/usage-guide/posts/bottom_sheet_hashtag.jpg?raw=true"}
alt={"basic"}
width={320}
/>

<img
src={"https://github.com/suvam0451/dhaaga-assets/blob/main/assets/usage-guide/posts/bottom_sheet_link.jpg?raw=true"}
alt={"basic"}
width={320}
/>

<img
src={"https://github.com/suvam0451/dhaaga-assets/blob/main/assets/usage-guide/posts/bottom_sheet_link.jpg?raw=true"}
alt={"basic"}
width={320}
/>

</details>

## The Uncertain

Aaaaand, of course there are sections that I have not planned anything yet.

<img
src={"https://github.com/suvam0451/dhaaga-assets/blob/main/assets/usage-guide/posts/pending_design.jpg?raw=true"}
alt={"basic"}
width={320}
/>

^ Image credit in Screenshot btw, go check them out.

