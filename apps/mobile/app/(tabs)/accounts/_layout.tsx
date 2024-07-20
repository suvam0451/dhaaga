import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';
import { Stack } from 'expo-router/stack';

function AccountsScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name={'selection'} />
			</Stack>
		</WithGorhomBottomSheetContext>
	);
}

export default AccountsScreen;
