import { memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { AppIcon } from '../../../../lib/Icon';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';

const PreviewedPostEdit = memo(({}: { State: string }) => {
	const { theme } = useGlobalState(
		useShallow((o) => ({
			theme: o.colorScheme,
		})),
	);

	function onEditPress() {}

	return (
		<TouchableOpacity
			style={{
				backgroundColor: '#307491',
				flexDirection: 'row',
				alignItems: 'center',
				paddingHorizontal: 12,
				borderRadius: 8,
				paddingVertical: 6,
				flex: 1,
				marginHorizontal: 16,
				justifyContent: 'center',
			}}
			onPress={onEditPress}
		>
			<Text
				style={{
					color: theme.textColor.high,
					fontFamily: APP_FONTS.MONTSERRAT_600_SEMIBOLD,
					fontSize: 14,
				}}
			>
				Edit
			</Text>
			<AppIcon
				id={'edit'}
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A20}
				size={18}
				containerStyle={{ marginLeft: 8 }}
			/>
		</TouchableOpacity>
	);
});

export default PreviewedPostEdit;
