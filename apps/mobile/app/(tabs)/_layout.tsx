import { Tabs } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

export default function TabLayout() {
	return (
		<View style={{ backgroundColor: 'red', height: '100%' }}>
			<Tabs
				initialRouteName={'home'}
				detachInactiveScreens={false}
				screenOptions={({ route }) => ({
					tabBarIcon: ({ focused, color, size }) => {
						let iconName;
						let renderer = 'ionicons';
						switch (route.name) {
							case 'Home': {
								iconName = focused ? 'home' : 'home';
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
								iconName = focused ? 'bookmark-outline' : 'bookmark-outline';
								break;
							}
							case 'Notifications': {
								iconName = focused
									? 'notifications-outline'
									: 'notifications-outline';
								break;
							}
							case 'Accounts': {
								iconName = focused ? 'person-outline' : 'person-outline';
							}
						}
						switch (renderer) {
							case 'fa6':
								return (
									<FontAwesome6 name={iconName} size={size} color={color} />
								);
							default:
								return <Ionicons name={iconName} size={size} color={color} />;
						}
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
				})}
			>
				<Tabs.Screen
					name="index"
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Ionicons size={size} name="home" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name={'search'}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<FontAwesome6 size={size} name="compass" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name={'favourites'}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Ionicons size={size} name="bookmark-outline" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name={'notifications'}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Ionicons
								size={size}
								name="notifications-outline"
								color={color}
							/>
						),
					}}
				/>
				<Tabs.Screen
					name={'accounts'}
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<Ionicons size={size} name="person-outline" color={color} />
						),
					}}
				/>
				<Tabs.Screen
					name="settings"
					options={{
						tabBarIcon: ({ focused, color, size }) => (
							<FontAwesome size={size} name="cog" color={color} />
						),
					}}
				/>
			</Tabs>
		</View>
	);
}
