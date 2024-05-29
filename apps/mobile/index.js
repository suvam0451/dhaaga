import {registerRootComponent} from 'expo';
import {polyfillWebCrypto} from "expo-standard-web-crypto";
import {setupURLPolyfill} from 'react-native-url-polyfill';

// polyfills
setupURLPolyfill();
polyfillWebCrypto();

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
