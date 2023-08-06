import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreen from "./screens/SettingsScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import AccountsStack from "./screens/accounts";
import { Animated } from "react-native";
import { useEffect, useRef } from "react";
import { getCloser } from "./utils";
import {
	runActivityPubMigrations,
	runCacheMigrations,
	runCoreMigrations,
} from "./libs/sqlite/migrations/_migrations";
import { store } from "./libs/redux/store";
import { Provider } from "react-redux";
import HomeStack from "./screens/timelines";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const { diffClamp } = Animated;
const HIDDEN_SECTION_HEIGHT = 100;
const SHOWN_SECTION_HEIGHT = 50;

const Tab = createBottomTabNavigator();

export default function App() {
	const ref = useRef(null);

	const scrollY = useRef(new Animated.Value(0));
	const scrollYClamped = diffClamp(
		scrollY.current,
		0,
		HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT
	);

	const translateY = scrollYClamped.interpolate({
		inputRange: [0, HIDDEN_SECTION_HEIGHT + SHOWN_SECTION_HEIGHT],
		outputRange: [0, -HIDDEN_SECTION_HEIGHT],
	});

	const translateYNumber = useRef();

	translateY.addListener(({ value }) => {
		translateYNumber.current = value;
	});

	const handleScroll = Animated.event(
		[
			{
				nativeEvent: {
					contentOffset: { y: scrollY.current },
				},
			},
		],
		{
			useNativeDriver: true,
		}
	);

	/**
	 * When scroll view has stopped moving,
	 * snap to the nearest section
	 * @param param0
	 */
	const handleSnap = ({ nativeEvent }) => {
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
					 * ScrollView --> scrollo ???
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

	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<Provider store={store}>
				<ActionSheetProvider>
					<NavigationContainer>
						<Tab.Navigator
							screenOptions={({ route }) => ({
								tabBarIcon: ({ focused, color, size }) => {
									let iconName;

									if (route.name === "Home") {
										iconName = focused ? "home" : "home";
									} else if (route.name === "Settings") {
										iconName = focused ? "menu-outline" : "menu-outline";
									} else if (route.name === "Search") {
										iconName = focused ? "search-sharp" : "search-sharp";
									} else if (route.name === "Favourites") {
										iconName = focused
											? "bookmark-outline"
											: "bookmark-outline";
									} else if (route.name === "Notifications") {
										iconName = focused
											? "notifications-outline"
											: "notifications-outline";
									} else if (route.name === "Accounts") {
										iconName = focused ? "person-outline" : "person-outline";
									}

									return <Ionicons name={iconName} size={size} color={color} />;
								},
								tabBarStyle: {
									paddingTop: 0,
									borderTopWidth: 0,
									backgroundColor: "rgba(34,36,40,1)",
								},
								tabBarActiveTintColor: "white",
								tabBarInactiveTintColor: "gray",
								tabBarShowLabel: false,
								headerShown: false,
							})}
						>
							<Tab.Screen name="Home" component={HomeStack} />
							<Tab.Screen name="Search" component={SearchScreen} />
							<Tab.Screen name="Favourites" component={FavouritesScreen} />
							<Tab.Screen
								name="Notifications"
								component={NotificationsScreen}
							/>
							<Tab.Screen name="Accounts" component={AccountsStack} />
							<Tab.Screen name="Settings" component={SettingsScreen} />
						</Tab.Navigator>
					</NavigationContainer>
				</ActionSheetProvider>
			</Provider>
		</QueryClientProvider>
	);
}

const styles = StyleSheet.create({
	header: {
		position: "absolute",
		backgroundColor: "#1c1c1c",
		left: 0,
		right: 0,
		width: "100%",
		zIndex: 1,
	},
	subHeader: {
		height: SHOWN_SECTION_HEIGHT,
		width: "100%",
		paddingHorizontal: 10,
	},
	container: {
		flex: 1,
		backgroundColor: "#000",
	},
});
