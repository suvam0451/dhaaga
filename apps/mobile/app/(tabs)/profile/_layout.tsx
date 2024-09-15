import { Stack } from 'expo-router/stack';
import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';

function AccountsScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name={'landing'} />
			</Stack>
		</WithGorhomBottomSheetContext>
	);
}

export default AccountsScreen;
