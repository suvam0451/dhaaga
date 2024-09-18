import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';
import { useAppTheme } from '../../../../../hooks/app/useAppThemePack';
import { AppIcon } from '../../../../lib/Icon';

const PreviewedPostEdit = memo(({}: { State: string }) => {
	const { PostRef } = useAppBottomSheet();
	const { colorScheme } = useAppTheme();

	function onEditPress() {}

	if (PostRef.current === null) return <View />;
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
					color: colorScheme.textColor.high,
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
					fontSize: 14,
				}}
			>
				Edit
			</Text>
			<AppIcon
				id={'edit'}
				emphasis={'high'}
				size={18}
				containerStyle={{ marginLeft: 8 }}
			/>
		</TouchableOpacity>
	);
});

export default PreviewedPostEdit;
