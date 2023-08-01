import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./screens/HomeScreen";
import SearchScreen from "./screens/SearchScreen";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FontAwesome } from "@expo/vector-icons";
import SettingsScreen from "./screens/SettingsScreen";
import FavouritesScreen from "./screens/FavouritesScreen";
import NotificationsScreen from "./screens/NotificationsScreen";
import AccountsScreen from "./screens/AccountsScreen";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components/native";

const Tab = createBottomTabNavigator();

const HeaderComponent = styled.View`
	background-color: black;
	color: #fff;
	height: 56px;
	position: absolute;
	right: 0;
	left: 0;
	align-items: center;
	justify-content: center;
`;

export default function App() {
	const SCROLL_Y = useRef(new Animated.Value(0)).current;
	const OFFSET_ANIM = useRef(new Animated.Value(0)).current;

	const CONTAINER_HEIGHT = 56;
	const clampedScroll = Animated.diffClamp(
		Animated.add(
			SCROLL_Y.interpolate({
				inputRange: [0, 1],
				outputRange: [0, 1],
				extrapolateLeft: "clamp",
			}),
			OFFSET_ANIM
		),
		0,
		CONTAINER_HEIGHT
	);

	var _clampedScrollValue = 0;
	var _offsetValue = 0;
	var _scrollValue = 0;

	useEffect(() => {
		SCROLL_Y.addListener(({ value }) => {
			const diff = value - _scrollValue;
			_scrollValue = value;
			_clampedScrollValue = Math.min(
				Math.max(_clampedScrollValue + diff, 0),
				CONTAINER_HEIGHT
			);
		});

		OFFSET_ANIM.addListener(({ value }) => {
			_offsetValue = value;
		});
	}, []);

	const headerTranslate = clampedScroll.interpolate({
		inputRange: [0, CONTAINER_HEIGHT],
		outputRange: [0, -CONTAINER_HEIGHT],
		extrapolate: "clamp",
	});

	let scrollEndTimer = null;
	const onMomentumScrollBegin = () => {
		clearTimeout(scrollEndTimer);
	};
	const onMomentumScrollEnd = () => {
		const toValue =
			_scrollValue > CONTAINER_HEIGHT &&
			_clampedScrollValue > CONTAINER_HEIGHT / 2
				? _offsetValue + CONTAINER_HEIGHT
				: _offsetValue - CONTAINER_HEIGHT;

		Animated.timing(OFFSET_ANIM, {
			toValue,
			duration: 500,
			useNativeDriver: true,
		}).start();
	};
	const onScrollEndDrag = () => {
		scrollEndTimer = setTimeout(onMomentumScrollEnd, 250);
	};

	const [ScrollY, setScrollY] = useState(0);

	// let AnimatedHeaderHeightValue = new Animated.Value(0);
	// const HEADER_MAX_HEIGHT = 150;
	// const HEADER_MIN_HEIGHT = 50;

	// const animatedHeaderHeight = AnimatedHeaderHeightValue.interpolate({
	// 	inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
	// 	outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
	// 	extrapolate: "clamp",
	// });
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

						// You can return any component that you like here!
						return <Ionicons name={iconName} size={size} color={color} />;
					},
					tabBarActiveTintColor: "tomato",
					tabBarInactiveTintColor: "gray",
					tabBarShowLabel: false,
					headerShown: false,
					// header: () => {
					// 	return <SafeAreaView></SafeAreaView>;
					// },
				})}
			>
				<Tab.Screen
					name="Home"
					component={() => {
						return (
							<SafeAreaView>
								<View style={{ position: "relative" }}>
									<Animated.View
										style={{
											position: "absolute",
											left: 0,
											right: 0,
											height: CONTAINER_HEIGHT,
											transform: [{ translateY: headerTranslate }],
											backgroundColor: "black",
										}}
									>
										<Text style={{ color: "white" }}>HEllo</Text>
									</Animated.View>
								</View>

								<ScrollView
									scrollEventThrottle={1}
									onScroll={Animated.event(
										[
											{
												nativeEvent: {
													contentOffset: { y: SCROLL_Y },
												},
											},
										],
										{ useNativeDriver: false }
									)}
									onMomentumScrollBegin={onMomentumScrollBegin}
									onMomentumScrollEnd={onMomentumScrollEnd}
									onScrollEndDrag={onScrollEndDrag}
									style={{ paddingTop: CONTAINER_HEIGHT }}
								>
									<HomeScreen ScrollY={ScrollY} setScrollYValue={setScrollY} />
								</ScrollView>
							</SafeAreaView>
						);
					}}
				/>
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
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
