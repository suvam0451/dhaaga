import { Stack } from 'expo-router/stack';
import RneuiTheme from '../styles/RneuiTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WithGlobalMmkvContext from '../states/useGlobalMMkvCache';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@rneui/themed';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import WithActivityPubRestClient from '../states/useActivityPubRestClient';
import { StatusBar, View, Appearance } from 'react-native';
import appFonts from '../styles/AppFonts';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';
import { useFonts } from '@expo-google-fonts/montserrat';
import { enableMapSet } from 'immer';
import { SQLiteProvider } from 'expo-sqlite';

enableMapSet();

import WithAppBottomSheetContext from '../components/dhaaga-bottom-sheet/modules/_api/useAppBottomSheet';
import WithAppNotificationBadge from '../hooks/app/useAppNotificationBadge';
import WithGorhomBottomSheetContext from '../states/useGorhomBottomSheet';

// polyfills
import WithAppThemePackContext, {
	useAppTheme,
} from '../hooks/app/useAppThemePack';
import { usePathname } from 'expo-router';
import { migrateDbIfNeeded } from '../database/migrations';

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

function WithGorhomBottomSheetWrapper() {
	const { top, bottom } = useSafeAreaInsets();

	// const db = useRealm();
	/**
	 * DB Seed
	 */
	// useEffect(() => {
	// 	AppSettingsService.populateSeedData(db);
	// }, [db]);

	// useEffect(() => {
	// 	AppProfileRepository(db).upsert({ name: 'Default' });
	// 	AppProfileRepository(db).ensureDefaultProfileIsActive();
	// 	AppProfileRepository(db).seedAppSettings({ name: 'Default' });
	// 	AppInit.create(db).applyDefaultSettings();
	// }, [db]);

	const [fontsLoaded, fontError] = useFonts(appFonts);

	const onLayoutRootView = useCallback(async () => {
		if (!fontsLoaded || fontError) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	const { colorScheme } = useAppTheme();

	const pathname = usePathname();

	useEffect(() => {
		setTimeout(() => {
			Appearance.setColorScheme('dark');
			StatusBar.setBarStyle('light-content');
			StatusBar.setBackgroundColor(colorScheme.palette.bg);
		}, 0);
	}, [pathname, colorScheme]);

	return (
		<SQLiteProvider databaseName="app.db" onInit={migrateDbIfNeeded}>
			<WithActivityPubRestClient>
				<WithGorhomBottomSheetContext>
					<WithAppBottomSheetContext>
						<View
							style={{ paddingTop: top, marginBottom: bottom, height: '100%' }}
							onLayout={onLayoutRootView}
						>
							<StatusBar backgroundColor={colorScheme.palette.bg} />
							<Stack
								initialRouteName={'(tabs)'}
								screenOptions={{ headerShown: false }}
							>
								<Stack.Screen name="(tabs)" />
							</Stack>
						</View>
					</WithAppBottomSheetContext>
				</WithGorhomBottomSheetContext>
			</WithActivityPubRestClient>
		</SQLiteProvider>
	);
}

export default function Page() {
	const queryClient = new QueryClient();
	return (
		<GestureHandlerRootView>
			{/* In-Memory Store -- MMKV */}
			<WithGlobalMmkvContext>
				{/* Main Database -- Realm */}
				{/* API Caching -- Tanstack */}
				<QueryClientProvider client={queryClient}>
					{/* Rneui Custom Themes */}
					<ThemeProvider theme={RneuiTheme}>
						<WithAppThemePackContext>
							<SafeAreaProvider>
								<WithAppNotificationBadge>
									<WithGorhomBottomSheetWrapper />
								</WithAppNotificationBadge>
							</SafeAreaProvider>
						</WithAppThemePackContext>
					</ThemeProvider>
				</QueryClientProvider>
			</WithGlobalMmkvContext>
		</GestureHandlerRootView>
	);
}
