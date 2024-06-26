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
import { StatusBar } from 'expo-status-bar';
import { APP_THEME } from '../styles/AppTheme';
import { useFonts } from 'expo-font';
import appFonts from '../styles/AppFonts';
import { useCallback, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// to get rid of realm warnings
import 'react-native-get-random-values';
import AppSettingsService from '../services/app-settings.service';

function WithGorhomBottomSheetWrapper() {
	const { top, bottom } = useSafeAreaInsets();

	const db = useRealm();
	/**
	 * DB Seed
	 */
	useEffect(() => {
		AppSettingsService.populateSeedData(db);
	}, []);

	const [fontsLoaded, fontError] = useFonts(appFonts);
	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded || fontError) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded, fontError]);

	return (
		<WithActivityPubRestClient>
			<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />
			<View style={{ paddingTop: top, marginBottom: bottom, height: '100%' }}>
				<Stack
					initialRouteName={'(tabs)'}
					screenOptions={{ headerShown: false }}
				>
					<Stack.Screen
						name="(tabs)"
						options={{
							headerShown: false,
						}}
					/>
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
					<RealmProvider schema={schemas} schemaVersion={11}>
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
