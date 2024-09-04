import { Stack } from 'expo-router/stack';
import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';

function FavouritesScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack initialRouteName={'index'} screenOptions={{ headerShown: false }}>
				<Stack.Screen name={'index'} />
				<Stack.Screen name={'bookmark-portal'} />
				<Stack.Screen name={'bookmark-gallery'} />
				<Stack.Screen name={'bookmark-classic'} />
			</Stack>
		</WithGorhomBottomSheetContext>
	);
}

export default FavouritesScreen;
