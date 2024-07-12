import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';
import { Stack } from 'expo-router/stack';

function DiscoverScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name={'index'} />
				<Stack.Screen name={'trending-tags'} />
			</Stack>
		</WithGorhomBottomSheetContext>
	);
}

export default DiscoverScreen;
