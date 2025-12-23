import { SplashScreen, Tabs } from 'expo-router';
import {
	NavbarButtonDefault,
	NavbarButtonDisabledOnSignOut,
	ProfileTabNavbarIcon,
	ProfileTabNavbarIconButton,
} from '#/components/lib/Icon';
import {
	useActiveUserSession,
	useAppActiveSession,
	useAppTheme,
} from '#/states/global/hooks';
import DhaagaSkinnedIcon, {
	APP_ICON_IDENTIFIER,
} from '#/features/skins/components/ThemedAppIcons';
import { migrateDbIfNeeded } from '@dhaaga/db';
import WithAppAssetsContext from '#/hooks/app/useAssets';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SQLiteProvider } from 'expo-sqlite';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import polyfills from '#/utils/polyfills';
import useAppSession from '#/states/useAppSession';
import { useNativeKeyboardOffset } from '#/ui/hooks/useNativeKeyboardOffset';
import WithBackgroundSkin from '#/components/containers/WithBackgroundSkin';
import ImageInspectModal from '#/components/modals/ImageInspectModal';
import AppBottomSheet from '#/components/dhaaga-bottom-sheet/components/Core';
import { AppDialog } from '#/components/lib/AppDialog';
import { LogBox, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { enableMapSet } from 'immer';
import React, { Fragment, useEffect, useState } from 'react';
import Animated, {
	configureReanimatedLogger,
	ReanimatedLogLevel,
	useAnimatedStyle,
} from 'react-native-reanimated';
import { usePathname } from 'expo-router';

import '../../i18n/_loader';
import 'fast-text-encoding';

enableMapSet();
polyfills();

/**
 * Suppress these warnings...
 */
const IGNORED_LOGS = [
	'Found screens with the same name nested inside one another',
	'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
	'Text strings must be rendered within a <Text> component.',
	"[Error: Call to function 'ExpoImage.loadAsync' has been rejected.\n" +
		'→ Caused by: Failed to load the image: com.bumptech.glide.load.engine.GlideException: Received null model]',
];
LogBox.ignoreLogs(IGNORED_LOGS);
LogBox.ignoreAllLogs(true);

// This is the default configuration
configureReanimatedLogger({
	level: ReanimatedLogLevel.warn,
	strict: false, // Reanimated runs in strict mode by default
});

function App() {
	const { theme } = useAppTheme();
	const pathname = usePathname();
	const appReady = useAppSession();
	const [IsRendered, setIsRendered] = useState(false);

	/**
	 * Wait for fonts and database to load
	 */
	useEffect(() => {
		if (appReady && IsRendered) SplashScreen.hide();
	}, [appReady, IsRendered]);

	function onLayout() {
		setIsRendered(true);
	}

	const { height } = useNativeKeyboardOffset(0, 0);
	const fakeView = useAnimatedStyle(() => {
		return {
			height: height.value,
			marginBottom: height.value > 0 ? 0 : 0,
		};
	}, []);

	const HAS_NO_STICKY_MENU = ['/index', '/explore', '/inbox', '/profile'];
	return (
		<Fragment>
			<SafeAreaView
				edges={['top']}
				style={{
					flex: 0,
					backgroundColor: HAS_NO_STICKY_MENU.includes(pathname)
						? theme.background.a10
						: theme.background.a10,
				}}
			/>
			<SafeAreaView
				edges={['left', 'right', 'bottom']}
				style={{ flex: 1, backgroundColor: theme.background.a10 }}
				onLayout={onLayout}
			>
				<StatusBar
					barStyle={theme.barStyle}
					backgroundColor={theme.background.a0}
					translucent={true}
				/>
				<WithBackgroundSkin>
					<View style={{ flex: 1, backgroundColor: theme.background.a0 }}>
						<TabLayout />
						{/* Globally shared components */}
						<ImageInspectModal />
						<AppBottomSheet />
						<AppDialog />
					</View>
					<Animated.View style={fakeView} />
				</WithBackgroundSkin>
			</SafeAreaView>
		</Fragment>
	);
}

const BOTTOM_NAVBAR_HEIGHT = 50; // Range: 42 to 52
const BOTTOM_NAVBAR_ICON_STYLE = {
	height: 52,
};

const ICON_A_SIZE_OFFSET = 4;
const ICON_B_SIZE_OFFSET = 4;
const ICON_C_SIZE_OFFSET = 8;
const ICON_D_SIZE_OFFSET = 6;
const ICON_E_SIZE_OFFSET = 8;

function TabLayout() {
	const { theme } = useAppTheme();
	const { acct } = useActiveUserSession();
	const { session } = useAppActiveSession();

	return (
		<Tabs
			initialRouteName={'(hub)'}
			detachInactiveScreens={true}
			screenOptions={() => {
				return {
					tabBarHideOnKeyboard: true,
					tabBarStyle: {
						backgroundColor: theme.background.a10,
						borderTopWidth: 0,
						height: BOTTOM_NAVBAR_HEIGHT,
					},
					tabBarIconStyle: BOTTOM_NAVBAR_ICON_STYLE,
					tabBarActiveTintColor: theme.primary,
					tabBarInactiveTintColor: theme.secondary.a50,
					tabBarShowLabel: false,
					headerShown: false,
				};
			}}
		>
			<Tabs.Screen
				name="(hub)"
				options={{
					tabBarButton: NavbarButtonDefault,
					tabBarIcon: ({ focused, color, size }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_HUB_ACTIVE}
								size={size + ICON_A_SIZE_OFFSET}
								color={color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_HUB_INACTIVE}
								size={size + ICON_A_SIZE_OFFSET}
								color={color}
							/>
						),
				}}
			/>
			<Tabs.Screen
				name={'(feed)'}
				options={{
					tabBarButton: NavbarButtonDisabledOnSignOut,
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_FEED_ACTIVE}
								size={size + ICON_B_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_FEED_INACTIVE}
								size={size + ICON_B_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						),
				}}
			/>
			<Tabs.Screen
				name={'(explore)'}
				options={{
					tabBarButton: NavbarButtonDisabledOnSignOut,
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_EXPLORE_ACTIVE}
								size={size + ICON_C_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_EXPLORE_INACTIVE}
								size={size + ICON_C_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						),
				}}
			/>

			<Tabs.Screen
				name={'(inbox)'}
				options={{
					tabBarButton: NavbarButtonDisabledOnSignOut,
					tabBarIcon: ({ color, size, focused }) =>
						focused ? (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_INBOX_ACTIVE}
								size={size + ICON_D_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						) : (
							<DhaagaSkinnedIcon
								id={APP_ICON_IDENTIFIER.BOTTOM_NAVBAR_INBOX_INACTIVE}
								size={size + ICON_D_SIZE_OFFSET}
								color={!acct ? theme.background.a50 : color}
							/>
						),
				}}
			/>
			<Tabs.Screen
				name={'(profile)'}
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

function Wrapper() {
	const queryClient = new QueryClient();
	return (
		<SQLiteProvider databaseName="app.db" onInit={migrateDbIfNeeded}>
			{/* API Caching -- Tanstack */}
			<QueryClientProvider client={queryClient}>
				<GestureHandlerRootView>
					<KeyboardProvider>
						{/* Asset Loader */}
						<WithAppAssetsContext>
							<App />
						</WithAppAssetsContext>
					</KeyboardProvider>
				</GestureHandlerRootView>
			</QueryClientProvider>
		</SQLiteProvider>
	);
}

export default Wrapper;
