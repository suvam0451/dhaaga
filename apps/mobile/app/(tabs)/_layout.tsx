import { Tabs } from 'expo-router';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { APP_THEME } from '../../styles/AppTheme';
import { StatusBar } from 'expo-status-bar';
import { useAppNotificationBadge } from '../../hooks/app/useAppNotificationBadge';
import WithAppAssetsContext from '../../hooks/app/useAssets';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function TabLayout() {
	const { notificationCount } = useAppNotificationBadge();
	return (
		<View style={{ backgroundColor: 'red', height: '100%' }}>
			<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />
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
							tabBarIcon: ({ focused, color, size }) => {
								let iconName;
								let renderer = 'ionicons';
								switch (route.name) {
									case 'Home': {
										iconName = focused ? 'index' : 'index';
										break;
									}
									case 'Settings': {
										iconName = focused ? 'menu-outline' : 'menu-outline';
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
										return (
											<Ionicons name={iconName} size={size} color={color} />
										);
								}
							},
							tabBarBadge: badgeCount,
							tabBarBadgeStyle: {
								// backgroundColor: 'black',
								color: 'yellow',
							},
							tabBarStyle: {
								backgroundColor: '#252525',
								borderTopWidth: 0,
							},
							tabBarIconStyle: {
								opacity: 0.6,
							},
							tabBarActiveTintColor: 'white',
							tabBarInactiveTintColor: 'gray',
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
									<Ionicons size={size} name="home" color={color} />
								) : (
									<Ionicons size={size} name="home-outline" color={color} />
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
										size={size + 4}
										color={color}
									/>
								) : (
									<Ionicons
										name="compass-outline"
										size={size + 4}
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
									<AntDesign name={'appstore1'} size={size} color={color} />
								) : (
									<AntDesign name="appstore-o" size={size} color={color} />
								),
						}}
					/>

					<Tabs.Screen
						name={'accounts'}
						options={{
							tabBarIcon: ({ color, size, focused }) =>
								focused ? (
									<Ionicons size={size} name="person" color={color} />
								) : (
									<Ionicons size={size} name="person-outline" color={color} />
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
										size={size}
										color={color}
									/>
								) : (
									<Ionicons
										size={size}
										name="notifications-outline"
										color={color}
									/>
								),
						}}
					/>
					<Tabs.Screen
						name="settings"
						options={{
							tabBarIcon: ({ color, size, focused }) =>
								focused ? (
									<Ionicons name="settings-sharp" size={size} color={color} />
								) : (
									<Ionicons name="settings-outline" size={24} color={color} />
								),
						}}
					/>
				</Tabs>
			</WithAppAssetsContext>
		</View>
	);
}
