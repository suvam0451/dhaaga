import { Stack } from 'expo-router/stack';
import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';

function FavouritesScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack initialRouteName={'index'} screenOptions={{ headerShown: false }}>
				<Stack.Screen name={'index'} />
			</Stack>
		</WithGorhomBottomSheetContext>
	);
}

export default FavouritesScreen;
