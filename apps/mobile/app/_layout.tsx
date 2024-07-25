import { Stack } from 'expo-router/stack';
import { schemas } from '../entities/_index';
import RneuiTheme from '../styles/RneuiTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WithGlobalMmkvContext from '../states/useGlobalMMkvCache';
import { RealmProvider, useRealm } from '@realm/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@rneui/themed';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import WithActivityPubRestClient from '../states/useActivityPubRestClient';
import { View } from 'react-native';
import appFonts from '../styles/AppFonts';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { LogBox } from 'react-native';
import { useFonts } from '@expo-google-fonts/montserrat';

// to get rid of realm warnings
import AppSettingsService from '../services/app-settings.service';
import { AppProfileRepository } from '../repositories/app-profile.repo';

/**
 * Suppress these warnings...
 */
const IGNORED_LOGS = [
	'BSON: For React Native please polyfill crypto.getRandomValues',
	// this would need to be fixed later
	'Found screens with the same name nested inside one another',
	'Require cycle',
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

	const db = useRealm();
	/**
	 * DB Seed
	 */
	useEffect(() => {
		AppSettingsService.populateSeedData(db);
	}, []);

	useEffect(() => {
		AppProfileRepository(db).upsert({ name: 'Default' });
		AppProfileRepository(db).ensureDefaultProfileIsActive();
		AppProfileRepository(db).seedAppSettings({ name: 'Default' });
	}, []);

	const [fontsLoaded, fontError] = useFonts(appFonts);

	const onLayoutRootView = useCallback(async () => {
		if (!fontsLoaded || fontError) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	return (
		<WithActivityPubRestClient>
			<View
				style={{ paddingTop: top, marginBottom: bottom, height: '100%' }}
				onLayout={onLayoutRootView}
			>
				<Stack
					initialRouteName={'(tabs)'}
					screenOptions={{ headerShown: false }}
				>
					<Stack.Screen name="(tabs)" />
				</Stack>
			</View>
		</WithActivityPubRestClient>
	);
}

export default function Page() {
	const queryClient = new QueryClient();
	return (
		<>
			{/* IDK */}
			<GestureHandlerRootView>
				{/* In-Memory Store -- MMKV */}
				<WithGlobalMmkvContext>
					{/* Main Database -- Realm */}
					<RealmProvider schema={schemas} schemaVersion={16}>
						{/* API Caching -- Tanstack */}
						<QueryClientProvider client={queryClient}>
							{/* Rneui Custom Themes */}
							<ThemeProvider theme={RneuiTheme}>
								<SafeAreaProvider>
									<WithGorhomBottomSheetWrapper />
								</SafeAreaProvider>
							</ThemeProvider>
						</QueryClientProvider>
					</RealmProvider>
				</WithGlobalMmkvContext>
			</GestureHandlerRootView>
		</>
	);
}
