---
sidebar_position: 3
title: Build Locally (Core)
---

## Compiling Locally

This guide covers compiling the core edition apk locally.

#### What you'll need

- Node.js (20 or later)
- Android SDK/NDK
- OpenJDK 17 (not tested with other versions)

### Pre-Requisites

An expo account is not required.

However, optionally modify your app identifiers to avoid conflict.

```typescript
// app.config.ts
const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: IS_DEV ? 'Dhaaga (Dev)' : 'Dhaaga', // -> your app name
	slug: 'dhaaga', // -> your slug
	ios: {
		bundleIdentifier: 'io.suvam.dhaaga.dev', // <- change this
		supportsTablet: false,
	},
	android: {
		package: 'io.suvam.dhaaga.dev', // <- change this
		versionCode: 7,
	},
})
```

### Steps