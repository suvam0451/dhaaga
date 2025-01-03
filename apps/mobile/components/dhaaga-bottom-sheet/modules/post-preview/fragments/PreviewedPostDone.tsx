import { Text, TouchableOpacity } from 'react-native';
import { APP_THEME } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { memo } from 'react';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { AppIcon } from '../../../../lib/Icon';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_BOTTOM_SHEET_ENUM } from '../../../Core';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';

const PreviewedPostDone = memo(() => {
	const { setType, setVisible } = useAppBottomSheet();
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

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
				flex: 1,
			}}
			onPress={onDonePress}
		>
			<Text
				style={{
					color: theme.textColor.high,
					fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
				}}
			>
				Done
			</Text>

			<AppIcon
				id={'done'}
				size={20}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A10}
				containerStyle={{
					marginLeft: 8,
				}}
			/>
		</TouchableOpacity>
	);
});

export default PreviewedPostDone;
