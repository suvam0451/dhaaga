import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@rneui/themed';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { StatusBar, View } from 'react-native';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';
import { enableMapSet } from 'immer';
import { SQLiteProvider } from 'expo-sqlite';
import WithAppNotificationBadge from '../hooks/app/useAppNotificationBadge';
import { usePathname } from 'expo-router';
import { migrateDbIfNeeded } from '@dhaaga/db';
import AppBottomSheet from '../components/dhaaga-bottom-sheet/Core';
import useAppSession from '../states/useAppSession';
import ImageInspectModal from '../components/modals/ImageInspectModal';
import { AppDialog } from '../components/lib/AppDialog';
import { useAppTheme } from '../hooks/utility/global-state-extractors';
import '../i18n/_loader';

enableMapSet();

/**
 * Suppress these warnings...
 */
const IGNORED_LOGS = [
	'BSON: For React Native please polyfill crypto.getRandomValues', // this would need to be fixed later
	'Found screens with the same name nested inside one another',
	'Require cycle:',
	'VirtualizedLists',
	'Warning: Text strings must be rendered within a',
];
LogBox.ignoreLogs(IGNORED_LOGS);
LogBox.ignoreAllLogs(true);

// Workaround for Expo 45
if (__DEV__) {
	const withoutIgnored =
		(logger: any) =>
		(...args: any[]) => {
			const output = args.join(' ');

			if (!IGNORED_LOGS.some((log) => output.includes(log))) {
				logger(...args);
			}
		};

	console.log = withoutIgnored(console.log);
	console.info = withoutIgnored(console.info);
	console.warn = withoutIgnored(console.warn);
	console.error = withoutIgnored(console.error);
}

function App() {
	const { theme } = useAppTheme();

	const { top, bottom } = useSafeAreaInsets();

	const pathname = usePathname();

	const { appReady } = useAppSession();

	/**
	 * Wait for fonts and database to load
	 */
	const onLayoutRootView = useCallback(async () => {
		if (!appReady) {
			await SplashScreen.hideAsync();
		}
	}, [appReady]);

	useEffect(() => {
		setTimeout(() => {
			// Appearance.setColorScheme('dark');
			StatusBar.setBarStyle('light-content');
			StatusBar.setBackgroundColor(theme.background.a0);
		}, 0);
	}, [pathname, theme]);

	return (
		<View style={{ backgroundColor: theme.background.a10 }}>
			<StatusBar
				barStyle="light-content"
				backgroundColor={theme.background.a0}
			/>
			<View
				style={{ paddingTop: top, marginBottom: bottom, height: '100%' }}
				onLayout={onLayoutRootView}
			>
				<Stack
					initialRouteName={'(tabs)'}
					screenOptions={{
						headerShown: false,
						navigationBarColor: theme.background.a0,
					}}
				>
					<Stack.Screen
						name="(tabs)"
						options={{
							presentation: 'modal',
						}}
					/>
					<Stack.Screen
						name="modal"
						options={{
							presentation: 'modal',
						}}
					/>
					<Stack.Screen
						name="formSheet"
						options={{
							presentation: 'formSheet',
							headerShown: false,
							animation: 'flip',
						}}
					/>
				</Stack>
				{/* Globally shared components */}
				<ImageInspectModal />
				<AppBottomSheet />
				<AppDialog />
			</View>
		</View>
	);
}

export default function Page() {
	const queryClient = new QueryClient();
	return (
		<SQLiteProvider databaseName="app.db" onInit={migrateDbIfNeeded}>
			{/* API Caching -- Tanstack */}
			<QueryClientProvider client={queryClient}>
				{/* Rneui Custom Themes */}
				<ThemeProvider>
					<GestureHandlerRootView>
						<SafeAreaProvider>
							<WithAppNotificationBadge>
								<App />
							</WithAppNotificationBadge>
						</SafeAreaProvider>
					</GestureHandlerRootView>
				</ThemeProvider>
			</QueryClientProvider>
		</SQLiteProvider>
	);
}
