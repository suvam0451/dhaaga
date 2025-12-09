import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
	useAppBottomSheet,
	useAppTheme,
} from '#/hooks/utility/global-state-extractors';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/_global';

function ComposeButton() {
	const { theme } = useAppTheme();
	const { show, setCtx } = useAppBottomSheet();

	function onPress() {
		setCtx({ uuid: null });
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
				backgroundColor: theme.primary.a0,
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
