import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import WithAppAssetsContext from '../../hooks/app/useAssets';
import {
	HomeNavigationIcon,
	ProfileTabNavbarIcon,
} from '../../components/lib/Icon';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';

export default function TabLayout() {
	const { theme } = useAppTheme();

	return (
		<View style={{ height: '100%' }}>
			<WithAppAssetsContext>
				<Tabs
					initialRouteName={'index'}
					detachInactiveScreens={false}
					screenOptions={() => {
						return {
							tabBarHideOnKeyboard: true,
							tabBarStyle: {
								backgroundColor: theme.background.a0,
								borderTopWidth: 0,
								height: 42,
							},
							tabBarIconStyle: {
								height: 32,
								width: 64,
							},
							tabBarActiveTintColor: theme.primary.a0,
							tabBarInactiveTintColor: theme.secondary.a50,
							tabBarShowLabel: false,
							headerShown: false,
						};
					}}
				>
					<Tabs.Screen
						name="index"
						options={{
							tabBarIcon: HomeNavigationIcon,
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
									<Ionicons name="add-circle" size={size + 6} color={color} />
								) : (
									<Ionicons
										name="add-circle-outline"
										size={size + 6}
										color={color}
									/>
								),
						}}
					/>

					<Tabs.Screen
						name={'notifications'}
						options={{
							tabBarIcon: ({ color, size, focused }) =>
								focused ? (
									<Ionicons name="file-tray" size={size + 4} color={color} />
								) : (
									<Ionicons
										name="file-tray-outline"
										size={size + 4}
										color={color}
									/>
								),
						}}
					/>
					<Tabs.Screen
						name={'profile'}
						options={{
							tabBarIcon: ({ color, size, focused }) => (
								<ProfileTabNavbarIcon
									color={color}
									size={size}
									focused={focused}
								/>
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
