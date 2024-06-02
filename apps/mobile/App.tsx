import {NavigationContainer} from "@react-navigation/native";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreen from "./screens/SettingsScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import {Animated, View} from "react-native";
import {useCallback, useEffect, useRef} from "react";
import {getCloser} from "./utils";
import {
  runActivityPubMigrations,
  runCacheMigrations,
  runCoreMigrations,
} from "./libs/sqlite/migrations/_migrations";
import {store} from "./libs/redux/store";
import {Provider} from "react-redux";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ActionSheetProvider} from "@expo/react-native-action-sheet";
import AccountsScreen from "./screens/AccountsScreen";
import HomeScreen from "./screens/HomeScreen";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {createTheme, ThemeProvider} from "@rneui/themed";
import {RealmProvider} from "@realm/react";
import {schemas} from "./entities/_index";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import NotificationsScreen from "./screens/NotificationsScreen";
import RneuiTheme from "./styles/RneuiTheme";
import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import WithGlobalMmkvContext from "./states/useGlobalMMkvCache";


const {diffClamp} = Animated;
const HIDDEN_SECTION_HEIGHT = 100;
const SHOWN_SECTION_HEIGHT = 50;

const Tab = createBottomTabNavigator();

function App() {
  const ref = useRef(null);

  const scrollY = useRef(new Animated.Value(0));
  const scrollYClamped = diffClamp(
      scrollY.current,
      0,
      HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT,
  );

  const translateY = scrollYClamped.interpolate({
    inputRange: [0, HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT],
    outputRange: [0, -HIDDEN_SECTION_HEIGHT],
  });

  const translateYNumber = useRef();

  translateY.addListener(({value}) => {
    translateYNumber.current = value;
  });

  const handleScroll = Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {y: scrollY.current},
          },
        },
      ],
      {
        useNativeDriver: true,
      },
  );

  /**
   * When scroll view has stopped moving,
   * snap to the nearest section
   * @param param0
   */
  const handleSnap = ({nativeEvent}) => {
    const offsetY = nativeEvent.contentOffset.y;
    if (
        !(
            translateYNumber.current === 0 ||
            translateYNumber.current === -HIDDEN_SECTION_HEIGHT
        )
    ) {
      if (ref.current) {
        try {
          /**
           * ScrollView --> scrollTo ???
           * FlatView --> scrollToOffset({offset: number}})
           */
          ref.current.scrollTo({
            // applies only for flat list
            offset:
                getCloser(translateYNumber.current, -HIDDEN_SECTION_HEIGHT, 0) ===
                -HIDDEN_SECTION_HEIGHT
                    ? offsetY + HIDDEN_SECTION_HEIGHT
                    : offsetY - HIDDEN_SECTION_HEIGHT,
          });
        } catch (e) {
          console.log("[WARN]: component is not a flat list");
        }
      }
    }
  };

  // run initial migrations
  useEffect(() => {
    runCoreMigrations();
    runActivityPubMigrations();
    runCacheMigrations();
  }, []);

  /**
   * Fonts
   */
  const [fontsLoaded, fontError] = useFonts({
    'Montserrat-Regular': require('../../packages/fonts/Montserrat/static/Montserrat-Regular.ttf'),
    'Montserrat-Bold': require('../../packages/fonts/Montserrat/static/Montserrat-Bold.ttf'),
    'Montserrat-ExtraBold': require('../../packages/fonts/Montserrat/static/Montserrat-ExtraBold.ttf'),
    'Montserrat-SemiBold': require('../../packages/fonts/Montserrat/static/Montserrat-SemiBold.ttf'),
    'Inter-Regular': require('../../packages/fonts/Inter/static/Inter-Regular.ttf'),
    'Inter-Bold': require('../../packages/fonts/Inter/static/Inter-Bold.ttf'),
    'Inter-SemiBold': require('../../packages/fonts/Inter/static/Inter-SemiBold.ttf'),
    "Source_Sans_3-Regular": require('../../packages/fonts/Source_Sans_3/static/SourceSans3-Regular.ttf'),
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  return (
      <NavigationContainer>
        <View onLayout={onLayoutRootView} style={{height: "100%"}}>
          <Tab.Navigator
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

function WithContexts() {
  const queryClient = new QueryClient();


  return <>
    {/* IDK */}
    <GestureHandlerRootView>
      {/* In-Memory Store -- MMKV */}
      <WithGlobalMmkvContext>
        {/* Main Database -- Realm */}
        <RealmProvider schema={schemas} schemaVersion={9}>
          {/* API Caching -- Tanstack */}
          <QueryClientProvider client={queryClient}>
            {/* Redux Store */}
            <Provider store={store}>
              {/* Rneui Custom Themes */}
              <ThemeProvider theme={RneuiTheme}>
                {/* IDK */}
                <SafeAreaProvider>
                  {/* Action Sheet -- Expo */}
                  <ActionSheetProvider>
                    <App/>
                  </ActionSheetProvider>
                </SafeAreaProvider>
              </ThemeProvider>
            </Provider>
          </QueryClientProvider>
        </RealmProvider>
      </WithGlobalMmkvContext>
    </GestureHandlerRootView>
  </>
}

export default WithContexts