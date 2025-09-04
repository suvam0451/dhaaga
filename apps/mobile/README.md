## Welcome 👋

This is the mobile app codebase for the Dhaaga project. It is written using
[React Native](https://reactnative.dev/) and [Expo](https://expo.dev). Zero 
native code here 😎

### Lite Edition Disclaimer

The lite edition is offered as a
[Libreware](https://en.wikipedia.org/wiki/Free_software) alternative,
geared for privacy enthusiasts, people who don't like google or meta 
services, or want to avoid freemium services in the app.

Some extra configuration will be required on your part for developing/building, 
while building purely for the lite edition.

## Development

### Base Edition

Working with expo projects requires you to generate 
[development clients](https://docs.expo.dev/develop/development-builds/introduction/)
in order to run and debug the app.

I already *(infrequently)* include the development clients in the Github 
releases. Just grab the most recent ***-DevClient.apk** file and install it 
on your phone/emulator.

From them on, going into the `apps/mobile` folder and running `bun dev` will 
start the development server.

Either scan the qr code or input it manually, and you will be all set with the
application.

Any edits you make will be reflected into the app.

You don't even need to install Android Studio on your computer. How cool is 
that!

### Lite Edition

I have never actually tried developing the app without expo. From previous 
experience, it involves *ejecting* out of expo and using react native cli to 
debug the app. PRs related to documenting this are welcome!

## Building from Source

### Base Edition (Using Expo)

Dhaaga uses expo EAS to build and ship builds on th cloud. Refer to their docs
on how to build and ship apps on the expo platform.

Once successfully bootstrapped to an expo account, you can generate 
builds as following:

```shell
# generate apk on EAS. 30 free credits per month.
eas build --profile=production
# generate apk locally.
eas build --local --profile=lite --non-interactive --platform=android --output=./output/dhaaga.apk # build app
```

What gets generated (aab/apk) depends on "profiles" set in your `eas.json` file.

### Base Edition

The following script should build the apk without expo. Do note that the 
generated build (apk) will be *unsigned*.

```shell
npx expo prebuild
bun add @react-native-community/cli
yarn lite:manual
```

### Lite Edition

The lite edition needs extra steps to compile. In particular, we want to remove
all optionalDependencies before compiling the app.

```shell
bun add @react-native-community/cli
bun remove react-native-purchases # optionalDependencies
```

The lite edition shipped to IzzyOnDroid needs further adjustments, as follows:
- Renaming app name from "Dhaaga" to "Dhaaga (Lite)"
- disables dependency metadata
- use useLegacyPackaging to save space
- generate only arm64-v8a builds

```shell
# All this is covered by the following script

node lite.js
```