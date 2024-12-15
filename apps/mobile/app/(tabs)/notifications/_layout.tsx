import WithGorhomBottomSheetContext from '../../../states/useGorhomBottomSheet';
import { Stack } from 'expo-router/stack';

function NotificationsScreen() {
	return (
		<WithGorhomBottomSheetContext>
			<Stack
				initialRouteName={'index'}
				screenOptions={{ headerShown: false }}
			/>
		</WithGorhomBottomSheetContext>
	);
}

export default NotificationsScreen;
