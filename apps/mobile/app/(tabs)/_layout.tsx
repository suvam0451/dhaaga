import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { APP_THEME } from '../../styles/AppTheme';
import { StatusBar } from 'expo-status-bar';
import WithAppAssetsContext from '../../hooks/app/useAssets';
import { useAppNotificationBadge } from '../../hooks/app/useAppNotificationBadge';

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
										iconName = focused ? 'bookmark' : 'bookmark';
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
									case 'fa6':
										return (
											<FontAwesome6 name={iconName} size={size} color={color} />
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
							tabBarIcon: ({ color, size }) => (
								<Ionicons size={size} name="home" color={color} />
							),
						}}
						initialRouteName={'home-home'}
					/>
					<Tabs.Screen
						name={'discover'}
						options={{
							tabBarIcon: ({ color, size }) => (
								<FontAwesome6 size={size} name="compass" color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name={'favourites'}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Ionicons size={size} name="bookmark-outline" color={color} />
							),
						}}
					/>

					<Tabs.Screen
						name={'accounts'}
						options={{
							tabBarIcon: ({ color, size }) => (
								<Ionicons size={size} name="person-outline" color={color} />
							),
						}}
					/>
					<Tabs.Screen
						name={'notifications'}
						options={{
							tabBarIcon: ({ color, size }) => (
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
							tabBarIcon: ({ color, size }) => (
								<FontAwesome size={size} name="cog" color={color} />
							),
						}}
					/>
				</Tabs>
			</WithAppAssetsContext>
		</View>
	);
}
