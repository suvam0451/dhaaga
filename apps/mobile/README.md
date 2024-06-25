### About

This is the mobile app for this project. It uses React Native and Expo.

It has no native code components. So, you don't need Android Studio and/or
XCode installed to get started with the project.

### Configuring

To ensure that the app build by you does not conflict with
the app distributed by the developer, you would need to change the following,
in `app.config.ts`:

- `config.android.package`
- `config.ios.bundleIdentifier`
- `config.name`
- `config.slug` (this is what you want to name the project in Expo/EAS)
- `config.extra.easprojectId` (this is the uuid of the project in Expo/EAS)
    - After running `eas build:configure` from following sections, it may
      generate an `app.json` file
    - Just copy over the projectId from within it and **delete the file**.

### Dependencies

Please only use [yarn classic (i.e. v1)](https://classic.yarnpkg.com) as your
package manager while installing/upgrading dependencies. This is the only
package manager officially supported for Expo monorepos and you will
save yourself a lot of trouble.

As for the internal package dependencies (@dhaaga/*), they should work out
of the box, and you don't need to build them.

### Building from Source

This project uses and recommends [EAS](https://expo.dev/eas) to build app
binaries.

EAS is a paid service (the first 30 credits per month are free, which
can be used to generate 10 sets of android/iOS builds)

The benefit of using EAS is that you don't even need to have Android SDK/NDK,
CocoaPod (iOS), fastlane (iOS) etc. setup locally.

To get started, run the following commands *(you will need an EAS account)*:

```shell
yarn global add eas-cli #anywhere
eas login # anywhere
eas build:configure # from this folder, and follow instructions
```

#### Building Dev Client

A [Dev Client](https://docs.expo.dev/develop/development-builds/introduction/)
is a installable apk that will contain
all native portions of this project
pre-built into the binary.

By running `expo start --dev-client` from this folder and connecting your
installed dev client apk to the corresponding server,
you can get started with extending/debugging code from this project.

A dev client can be generated via EAS using `eas build -p android --profile
dev` from this folder.

##### Known issues

- [Flash List](https://github.com/Shopify/flash-list) is known to have very
  poor apparent performance and stuttering in development builds. Don't
  worry, as a prod build will be snappy, as expected.

#### Building Prod Client

A production build is expected to produce the final apk/aab file,
that is minified and ready for installation/distribution.

To generate a production apk, run `eas build -p android --profile apk`

#### Building Without EAS

It is possible to generate the builds locally.
However, the tool setup for such is outside the scope of this README.
Please refer [this page](https://docs.expo.dev/build-reference/local-builds/)
for instructions.

### Environment Variables

Here is the `.env` template. Copy this to `.env` file and populate your own
tokens

```shell
# This is your Mastodon client app token
EXPO_PUBLIC_MASTODON_CLIENT_ID=
EXPO_PUBLIC_MASTODON_CLIENT_SECRET=
# This is used by translation service
EXPO_PUBLIC_OPENAI_API_KEY=
```