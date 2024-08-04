---
sidebar_position: 3
title: Using Custom Expo Client
---

A custom development client would be required, if you intend on
adding/modifying packages having native dependencies or to add native code
into your fork.

Even without the above, building your own dev clients will help you build
your own expo projects from scratch in the future.

### Linking your Expo Project

- *(if not already)* Create an expo account and `expo login` from terminal
- Follow guide to [create a project](https://expo.dev/eas)
- Come back to apps/mobile and run `eas init --id <project uuid>`

Among other things, this would usually update the `extra.eas.projectId` key in
`app.config.ts`. But, with our configuration, we need to do it manually.

```typescript
const expo = ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	owner: "suvam0451", // --> your expo account
	extra: {
		eas: {
			projectId: '6a318c01-ca78-440f-840f-64c54ddc94fe', // -> your uuid
		},
	},
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

### Building the Dev Client

Just run `yarn client` and wait for it to complete.

:::warning

Expo EAS is not free. You get 30 free credits per month.
Each android build counts as 1, iOS as 2.
:::

The following configuration is sent to the built server.
Everything else is already handled.

```json
{
  "build": {
    "node": "22.5.1",
    "dev": {
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "APP_VARIANT": "dev"
      }
    }
  }
}
```

:::info

Notice that env tokens are not added here. Those are directly picked up from
your .env file and not baked into the DevClient *(unlike a final apk build)*.
:::

### Next Steps

Congrats on building your very own DevClient 🥳

Continue following the [rest of the guide](using-expo#setting-up-secrets)
regarding development.