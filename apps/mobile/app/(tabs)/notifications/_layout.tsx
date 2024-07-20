import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';
import { Stack } from 'expo-router/stack';

function NotificationsScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack
				initialRouteName={'landing'}
				screenOptions={{ headerShown: false }}
			/>
		</WithGorhomBottomSheetContext>
	);
}

export default NotificationsScreen;
