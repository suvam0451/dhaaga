import { Tabs } from 'expo-router';
import {
	NavbarButtonDefault,
	NavbarButtonDisabledOnSignOut,
	ProfileTabNavbarIcon,
	ProfileTabNavbarIconButton,
} from '#/components/lib/Icon';
import {
	useAppAcct,
	useAppActiveSession,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import DhaagaSkinnedIcon, { DHAAGA_SKINNED_ICON_ID } from '#/skins/_icons';

const BOTTOM_NAVBAR_HEIGHT = 50; // Range: 42 to 52
const BOTTOM_NAVBAR_ICON_STYLE = {
	height: 52,
};

const ICON_A_SIZE_OFFSET = 4;
const ICON_B_SIZE_OFFSET = 4;
const ICON_C_SIZE_OFFSET = 8;
const ICON_D_SIZE_OFFSET = 6;
const ICON_E_SIZE_OFFSET = 8;

export default function TabLayout() {
	const { theme } = useAppTheme();
	const { acct } = useAppAcct();
	const { session } = useAppActiveSession();

	return (
		<Tabs
			initialRouteName={'index'}
			detachInactiveScreens={false}
			screenOptions={() => {
				return {
					tabBarHideOnKeyboard: true,
					tabBarStyle: {
						backgroundColor: theme.background.a10,
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
					tabBarButton: NavbarButtonDefault,
					tabBarIcon: ({ focused, color, size }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_HUB_ACTIVE}
								size={size + ICON_A_SIZE_OFFSET}
								color={color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_HUB_INACTIVE}
								size={size + ICON_A_SIZE_OFFSET}
								color={color}
							/>
						),
				}}
			/>
			<Tabs.Screen
				name={'feed'}
				options={{
					tabBarButton: NavbarButtonDisabledOnSignOut,
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_FEED_ACTIVE}
								size={size + ICON_B_SIZE_OFFSET}
								color={color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_FEED_INACTIVE}
								size={size + ICON_B_SIZE_OFFSET}
								color={color}
							/>
						),
				}}
			/>
			<Tabs.Screen
				name={'explore'}
				options={{
					tabBarButton: NavbarButtonDisabledOnSignOut,
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_EXPLORE_ACTIVE}
								size={size + ICON_C_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_EXPLORE_INACTIVE}
								size={size + ICON_C_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						),
				}}
			/>

			<Tabs.Screen
				name={'inbox'}
				options={{
					tabBarButton: NavbarButtonDisabledOnSignOut,
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_INBOX_ACTIVE}
								size={size + ICON_D_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={DHAAGA_SKINNED_ICON_ID.BOTTOM_NAVBAR_INBOX_INACTIVE}
								size={size + ICON_D_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						),
				}}
			/>
			<Tabs.Screen
				name={'profile'}
				options={{
					tabBarBadge: session.state === 'invalid' ? 1 : undefined,
					tabBarButton: ({ onPress, onLongPress, children }) => (
						<ProfileTabNavbarIconButton
							onPress={onPress}
							onLongPress={onLongPress}
							children={children}
						/>
					),
					tabBarIcon: ({ color, size, focused }) => (
						<ProfileTabNavbarIcon
							color={color}
							size={size + 0}
							focused={focused}
							sizeOffset={ICON_E_SIZE_OFFSET}
						/>
					),
				}}
			/>
		</Tabs>
	);
}
