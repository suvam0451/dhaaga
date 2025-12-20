import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogBox, StatusBar, View } from 'react-native';
import { Fragment, useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { enableMapSet } from 'immer';
import { SQLiteProvider } from 'expo-sqlite';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { usePathname } from 'expo-router';
import { migrateDbIfNeeded } from '@dhaaga/db';
import AppBottomSheet from '../components/dhaaga-bottom-sheet/components/Core';
import useAppSession from '../states/useAppSession';
import ImageInspectModal from '../components/modals/ImageInspectModal';
import { AppDialog } from '../components/lib/AppDialog';
import { useAppTheme } from '#/states/global/hooks';
import WithAppAssetsContext from '../hooks/app/useAssets';
import polyfills from '#/utils/polyfills';

import '../i18n/_loader';
import 'fast-text-encoding';
import { useNativeKeyboardOffset } from '#/ui/hooks/useNativeKeyboardOffset'; // needed by atproto
import Animated, {
	configureReanimatedLogger,
	ReanimatedLogLevel,
	useAnimatedStyle,
} from 'react-native-reanimated';
import WithBackgroundSkin from '#/components/containers/WithBackgroundSkin';

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
						<Stack
							initialRouteName={'(tabs)'}
							screenOptions={{
								headerShown: false,
							}}
						>
							<Stack.Screen
								name="(tabs)"
								options={{
									presentation: 'modal',
								}}
							/>
						</Stack>
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

export default function Page() {
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
