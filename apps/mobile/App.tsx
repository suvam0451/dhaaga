import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreen from "./screens/SettingsScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import {Animated, View, LogBox} from "react-native";
import {useCallback, useEffect, useRef} from "react";
import {getCloser} from "./utils";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import AccountsScreen from "./screens/AccountsScreen";
import HomeScreen from "./screens/HomeScreen";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {ThemeProvider} from "@rneui/themed";
import {RealmProvider, useRealm} from "@realm/react";
import {schemas} from "./entities/_index";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import NotificationsScreen from "./screens/NotificationsScreen";
import RneuiTheme from "./styles/RneuiTheme";
import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WithGlobalMmkvContext from "./states/useGlobalMMkvCache";
import appFonts from "./styles/AppFonts";
import WithActivityPubRestClient from "./states/useActivityPubRestClient";
import {getLocales} from 'expo-localization';
import {I18n} from 'i18n-js';
import AppSettingsService from "./services/app-settings.service";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const {diffClamp} = Animated;
const HIDDEN_SECTION_HEIGHT = 100;
const SHOWN_SECTION_HEIGHT = 50;

const Tab = createBottomTabNavigator();


// Set the key-value pairs for the different languages you want to support.
const translations = {
  en: {welcome: 'Hello'},
  ja: {welcome: 'こんにちは'},
};
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? 'en';

// When a value is missing from a language it'll fall back to another language with the key present.
// i18n.enableFallback = true;
// To see the fallback mechanism uncomment the line below to force the app to use the Japanese language.
// i18n.locale = 'ja';

export function App() {
  const db = useRealm()
  /**
   * DB Seed
   */
  useEffect(() => {
    AppSettingsService.populateSeedData(db)
  }, [])

  /**
   * Fonts
   */
  const [fontsLoaded, fontError] = useFonts(appFonts);
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
      <NavigationContainer>
        <View onLayout={onLayoutRootView} style={{height: "100%"}}>
          <Tab.Navigator
              detachInactiveScreens={false}
              screenOptions={({route}) => ({
                tabBarIcon: ({focused, color, size}) => {
                  let iconName;
                  let renderer = "ionicons";

                  switch (route.name) {
                    case "Home": {
                      iconName = focused ? "home" : "home";
                      break
                    }
                    case "Settings": {
                      iconName = focused ? "menu-outline" : "menu-outline";
                      break
                    }
                    case "SearchTab": {
                      iconName = focused ? "compass" : "compass";
                      renderer = "fa6";
                      break
                    }
                    case "Favourites": {
                      iconName = focused
                          ? "bookmark-outline"
                          : "bookmark-outline";
                      break
                    }
                    case "Notifications": {
                      iconName = focused
                          ? "notifications-outline"
                          : "notifications-outline";
                      break
                    }
                    case "Accounts": {
                      iconName = focused
                          ? "person-outline"
                          : "person-outline";
                    }
                  }
                  switch (renderer) {
                    case "fa6":
                      return (
                          <FontAwesome6
                              name={iconName}
                              size={size}
                              color={color}
                          />
                      );
                    default:
                      return <Ionicons
                          name={iconName} size={size}
                          color={color}
                      />
                  }
                },
                tabBarStyle: {
                  backgroundColor: "#252525",
                  borderTopWidth: 0,
                },
                tabBarIconStyle: {
                  opacity: 0.6
                },
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: "gray",
                tabBarShowLabel: false,
                headerShown: false,
              })}
          >
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="SearchTab" component={SearchScreen}/>
            <Tab.Screen
                name="Favourites"
                component={FavouritesScreen}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
            />
            <Tab.Screen name="Accounts" component={AccountsScreen}/>
            <Tab.Screen name="Settings" component={SettingsScreen}/>
          </Tab.Navigator>
        </View>
      </NavigationContainer>
  );
}

function WithGorhomBottomSheetWrapper() {
  return <WithActivityPubRestClient>
    <App/>
  </WithActivityPubRestClient>
}

function WithContexts() {
  const queryClient = new QueryClient();


  return <>
    {/* IDK */}
    <GestureHandlerRootView>
      {/* In-Memory Store -- MMKV */}
      <WithGlobalMmkvContext>
        {/* Main Database -- Realm */}
        <RealmProvider schema={schemas} schemaVersion={10}>
          {/* API Caching -- Tanstack */}
          <QueryClientProvider client={queryClient}>
            {/* Rneui Custom Themes */}
            <ThemeProvider theme={RneuiTheme}>
              {/* IDK */}
              <SafeAreaProvider>
                <WithGorhomBottomSheetWrapper/>
              </SafeAreaProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </RealmProvider>
      </WithGlobalMmkvContext>
    </GestureHandlerRootView>
  </>
}

export default WithContexts