import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import WithAppAssetsContext from '../../hooks/app/useAssets';
import {
	HomeNavigationIcon,
	ProfileTabNavbarIcon,
} from '../../components/lib/Icon';
import { useAppTheme } from '../../hooks/utility/global-state-extractors';

const BOTTOM_NAVBAR_HEIGHT = 50; // 42 - 52
const BOTTOM_NAVBAR_ICON_STYLE = {
	height: 46,
	width: 'auto',
};

const ICON_A_SIZE_OFFSET = 4;
const ICON_B_SIZE_OFFSET = 10;
const ICON_C_SIZE_OFFSET = 10;
const ICON_D_SIZE_OFFSET = 8;
const ICON_E_SIZE_OFFSET = 8;

export default function TabLayout() {
	const { theme } = useAppTheme();

	return (
		<View style={{ height: '100%' }}>
			<Tabs
				initialRouteName={'index'}
				detachInactiveScreens={false}
				screenOptions={() => {
					return {
						tabBarHideOnKeyboard: true,
						tabBarStyle: {
							backgroundColor: theme.background.a20,
							borderTopWidth: 0,
							height: BOTTOM_NAVBAR_HEIGHT,
						},
						tabBarIconStyle: BOTTOM_NAVBAR_ICON_STYLE,
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
						tabBarIcon: ({ focused, color, size }) => (
							<HomeNavigationIcon
								focused={focused}
								color={color}
								size={size}
								sizeOffset={ICON_A_SIZE_OFFSET}
							/>
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
									size={size + ICON_B_SIZE_OFFSET}
									color={color}
								/>
							) : (
								<Ionicons
									name="compass-outline"
									size={size + ICON_B_SIZE_OFFSET}
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
								<Ionicons
									name="add-circle"
									size={size + ICON_C_SIZE_OFFSET}
									color={color}
								/>
							) : (
								<Ionicons
									name="add-circle-outline"
									size={size + ICON_C_SIZE_OFFSET}
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
								<Ionicons
									name="file-tray"
									size={size + ICON_D_SIZE_OFFSET}
									color={color}
								/>
							) : (
								<Ionicons
									name="file-tray-outline"
									size={size + ICON_D_SIZE_OFFSET}
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
								sizeOffset={ICON_E_SIZE_OFFSET}
							/>
						),
					}}
				/>
			</Tabs>
		</View>
	);
}
