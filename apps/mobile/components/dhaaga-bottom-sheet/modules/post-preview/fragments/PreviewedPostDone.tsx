import { Text, TouchableOpacity } from 'react-native';
import { APP_FONT, APP_THEME } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import Ionicons from '@expo/vector-icons/Ionicons';
import { memo } from 'react';
import {
	APP_BOTTOM_SHEET_ENUM,
	useAppBottomSheet,
} from '../../_api/useAppBottomSheet';

const PreviewedPostDone = memo(() => {
	const { setType, setVisible } = useAppBottomSheet();

	function onDonePress() {
		setType(APP_BOTTOM_SHEET_ENUM.NA);
		setVisible(false);
	}

	return (
		<TouchableOpacity
			style={{
				backgroundColor: APP_THEME.REPLY_THREAD_COLOR_SWATCH[0],
				flexDirection: 'row',
				alignItems: 'center',
				paddingHorizontal: 12,
				borderRadius: 8,
				paddingVertical: 6,
				marginLeft: 8,
			}}
			onPress={onDonePress}
		>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
				}}
			>
				Done
			</Text>
			<Ionicons
				name="checkmark-done"
				size={20}
				style={{ marginLeft: 8 }}
				color={APP_FONT.MONTSERRAT_BODY}
			/>
		</TouchableOpacity>
	);
});

export default PreviewedPostDone;
