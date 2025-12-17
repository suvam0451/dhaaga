import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';

function ComposeButton() {
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet();

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.STATUS_COMPOSER, true);
	}

	return (
		<Pressable
			style={{
				position: 'absolute',
				bottom: 64,
				right: 24,
				width: 50,
				height: 50,
				backgroundColor: theme.primary,
				borderRadius: 16,
				// padding: 16,
				alignItems: 'center',
				justifyContent: 'center',
			}}
			onPress={onPress}
		>
			<Ionicons name="create-outline" size={24} color="black" />
		</Pressable>
	);
}

export default ComposeButton;
