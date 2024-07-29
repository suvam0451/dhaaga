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

You are in the branch for `lite` edition of the app.
Therefore, steps will cover scripts to build apks
on your own infrastructure.

p.s. - not tested for ios

#### Preliminary Steps

To generate the native library folders, we will need to
setup expo and run `prebuild`

p.s. - An expo account might be needed. Not tested.

```shell
yarn global add eas-cli #anywhere
eas login # anywhere
eas build:configure # from this folder, and follow instructions
expo prebuild
```

#### Modify android/gradle.properties

```shell
set reactNativeArchitectures=arm64-v8a # your arch here
set useLegacyPackaging=true
```

### Modify android/app/build.gradle

```shell
# android.namespace
io.suvam.dhaaga -> "io.suvam.dhaaga" # keep it same as expo
# android.defaultConfig.applicationId
io.suvam.dhaaga -> "io.suvam.dhaaga.lite" # this can be whatever you need
```

### Modify app name

```shell
# android/app/src/main/res/values/strings.xml
# Update as follows (or name your own)
<string name="app_name">Dhaaga (Lite)</string>

```

### Signing

You need
to [generate your own keys]( https://reactnative.dev/docs/signed-apk-android)

If you don't, warnings will popup while installing the app.

```shell
# OUTPUT: <keyfile-name>.keystore

# Update android.signingConfigs.debug
# if you followed steps from site,
# keyPassword = storePassword
storeFile file('<keyfile-name>.keystore')
storePassword ''
keyAlias ''
keyPassword ''

# link the configs
set android.buildTypes.release.signingConfig -> signingConfigs.release
            
# add to android block
dependenciesInfo {
    // Disables dependency metadata when building APKs.
    includeInApk = false
    // Disables dependency metadata when building Android App Bundles.
    includeInBundle = false
}
```

### Building

```shell
# generate aab
npx react-native build-android --mode=release
# generate apk
cd android && ./gradlew assembleRelease
```

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