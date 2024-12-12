import { Tabs } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { useAppNotificationBadge } from '../../hooks/app/useAppNotificationBadge';
import WithAppAssetsContext from '../../hooks/app/useAssets';
import AntDesign from '@expo/vector-icons/AntDesign';
import AppSelectedProfileIndicator from '../../components/screens/profile/fragments/AppSelectedProfileIndicator';
import { useAppTheme } from '../../hooks/app/useAppThemePack';

export default function TabLayout() {
	const { notificationCount } = useAppNotificationBadge();
	const { colorScheme } = useAppTheme();
	return (
		<View style={{ height: '100%' }}>
			<WithAppAssetsContext>
				<Tabs
					initialRouteName={'index'}
					detachInactiveScreens={false}
					screenOptions={({ route }) => {
						let badgeCount = undefined;
						if (route.name === 'notifications') {
							badgeCount =
								notificationCount === 0 ? undefined : notificationCount;
						}
						return {
							tabBarItemStyle: { flex: 1 },
							tabBarHideOnKeyboard: true,
							tabBarIcon: ({ focused, color, size }) => {
								let iconName;
								let renderer = 'ionicons';
								console.log(route.name);
								switch (route.name) {
									case 'Home': {
										iconName = focused ? 'index' : 'index';
										break;
									}
									case 'SearchTab': {
										iconName = focused ? 'compass' : 'compass';
										renderer = 'fa6';
										break;
									}
									case 'Favourites': {
										iconName = focused ? 'appstore1' : 'appstore1';
										renderer = 'antdesign';
										break;
									}
									case 'Notifications': {
										iconName = focused ? 'notifications' : 'notifications';
										break;
									}
									case 'Accounts': {
										iconName = focused ? 'person' : 'person';
									}
								}
								switch (renderer) {
									case 'antdesign':
										return (
											<AntDesign name={iconName} size={size} color={color} />
										);
									case 'fa6':
										return (
											<FontAwesome6.default
												name={iconName}
												size={size}
												color={color}
											/>
										);
									default:
										return <View />;
								}
							},
							// tabBarBadge: badgeCount,
							tabBarBadgeStyle: {
								// backgroundColor: 'black',
								color: 'yellow',
							},
							tabBarStyle: {
								backgroundColor: colorScheme.palette.bg,
								borderTopWidth: 0,
								height: 52,
							},
							tabBarIconStyle: {
								height: 42,
								width: 64,
							},
							// tabBarIconStyle: {
							// 	color: colorScheme.textColor.medium,
							// },
							tabBarActiveTintColor: colorScheme.textColor.medium,
							tabBarInactiveTintColor: colorScheme.textColor.low,
							tabBarShowLabel: false,
							headerShown: false,
						};
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							tabBarIcon: ({ color, size, focused }) =>
								focused ? (
									<Ionicons size={size + 2} name="home" color={color} />
								) : (
									<Ionicons size={size + 2} name="home-outline" color={color} />
								),
						}}
					/>
					<Tabs.Screen
						name={'discover'}
						options={{
							tabBarIcon: ({ color, size, focused }) =>
								focused ? (
									<Ionicons
										name="compass-sharp"
										size={size + 8}
										color={color}
									/>
								) : (
									<Ionicons
										name="compass-outline"
										size={size + 8}
										color={color}
									/>
								),
						}}
					/>
					<Tabs.Screen
						name={'apps'}
						options={{
							tabBarIcon: ({ color, size, focused }) =>
								focused ? (
									<AntDesign name={'appstore1'} size={size + 4} color={color} />
								) : (
									<AntDesign name="appstore-o" size={size + 4} color={color} />
								),
						}}
					/>

					<Tabs.Screen
						name={'notifications'}
						options={{
							tabBarIcon: ({ color, size, focused }) =>
								focused ? (
									<Ionicons
										name="notifications-sharp"
										size={size + 4}
										color={color}
									/>
								) : (
									<Ionicons
										size={size + 4}
										name="notifications-outline"
										color={color}
									/>
								),
						}}
					/>
					<Tabs.Screen
						name={'profile'}
						options={{
							tabBarIcon: ({ color, size, focused }) => (
								<AppSelectedProfileIndicator />
							),
							tabBarIconStyle: {
								opacity: 1,
							},
						}}
					/>
				</Tabs>
			</WithAppAssetsContext>
		</View>
	);
}
