import { Stack } from 'expo-router/stack';
import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';

function HomeScreen() {
	return (
		<WithGorhomBottomSheetContext>
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
