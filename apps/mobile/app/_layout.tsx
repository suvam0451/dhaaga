import { Stack } from 'expo-router/stack';
import { schemas } from '../entities/_index';
import RneuiTheme from '../styles/RneuiTheme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import WithGlobalMmkvContext from '../states/useGlobalMMkvCache';
import { RealmProvider } from '@realm/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@rneui/themed';
import {
	SafeAreaProvider,
	useSafeAreaInsets,
} from 'react-native-safe-area-context';
import WithActivityPubRestClient from '../states/useActivityPubRestClient';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

function WithGorhomBottomSheetWrapper() {
	const { top, bottom } = useSafeAreaInsets();
	return (
		<WithActivityPubRestClient>
			<View style={{ paddingTop: top, marginBottom: bottom, height: '100%' }}>
				{/* IDK */}

				<StatusBar backgroundColor={'#121212'} />
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
					<RealmProvider schema={schemas} schemaVersion={10}>
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
