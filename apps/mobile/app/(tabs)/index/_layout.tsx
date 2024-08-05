import { Stack } from 'expo-router/stack';
import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';
import { StatusBar } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';

function HomeScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<StatusBar backgroundColor={APP_THEME.DARK_THEME_MENUBAR} />
			<Stack
				initialRouteName={'home-home'}
				screenOptions={{ headerShown: false }}
			>
				<Stack.Screen name={'index'} />
				<Stack.Screen name={'home-home'} />
				<Stack.Screen name={'new-to-app'} />
				<Stack.Screen name={'new-to-fedi'} />
			</Stack>
		</WithGorhomBottomSheetContext>
	);
}

export default HomeScreen;
