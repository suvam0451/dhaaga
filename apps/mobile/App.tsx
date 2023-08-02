import { StyleSheet, StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import SettingsScreen from "./screens/SettingsScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import AccountsScreen from "./screens/AccountsScreen";
import { Animated } from "react-native";
import { useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCloser } from "./utils";
import Header from "./components/Header";
// import ListItem from "./components/ListItem";

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

	return (
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
							iconName = focused ? "bookmark-outline" : "bookmark-outline";
						} else if (route.name === "Notifications") {
							iconName = focused
								? "notifications-outline"
								: "notifications-outline";
						} else if (route.name === "Accounts") {
							iconName = focused ? "person-outline" : "person-outline";
						}

						return <Ionicons name={iconName} size={size} color={color} />;
					},
					tabBarActiveTintColor: "tomato",
					tabBarInactiveTintColor: "gray",
					tabBarShowLabel: false,
					headerShown: false,
				})}
			>
				<Tab.Screen name="Home">
					{(props) => (
						<SafeAreaView style={styles.container}>
							<StatusBar backgroundColor="#1c1c1c" />
							<Animated.View
								style={[styles.header, { transform: [{ translateY }] }]}
							>
								<Header
									SHOWN_SECTION_HEIGHT={SHOWN_SECTION_HEIGHT}
									HIDDEN_SECTION_HEIGHT={HIDDEN_SECTION_HEIGHT}
								/>
							</Animated.View>
							<Animated.ScrollView
								contentContainerStyle={{
									paddingTop: SHOWN_SECTION_HEIGHT + HIDDEN_SECTION_HEIGHT,
								}}
								onScroll={handleScroll}
								ref={ref}
								onMomentumScrollEnd={handleSnap}
								scrollEventThrottle={16}
							>
								<View style={{ height: 2000 }}></View>
							</Animated.ScrollView>
						</SafeAreaView>
					)}
				</Tab.Screen>
				<Tab.Screen name="Search" component={SearchScreen} />
				<Tab.Screen name="Favourites" component={FavouritesScreen} />
				<Tab.Screen name="Notifications" component={NotificationsScreen} />
				<Tab.Screen name="Accounts" component={AccountsScreen} />
				<Tab.Screen name="Settings" component={SettingsScreen} />
			</Tab.Navigator>
		</NavigationContainer>
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
