import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONT } from '../../../../../styles/AppTheme';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import Feather from '@expo/vector-icons/Feather';
import { useAppBottomSheet } from '../../_api/useAppBottomSheet';

const PreviewedPostEdit = memo(({}: { State: string }) => {
	const { PostRef } = useAppBottomSheet();

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
			}}
			onPress={onEditPress}
		>
			<Text
				style={{
					color: APP_FONT.MONTSERRAT_BODY,
					fontFamily: APP_FONTS.MONTSERRAT_700_BOLD,
				}}
			>
				Edit
			</Text>
			<Feather
				name="edit"
				size={20}
				style={{ marginLeft: 8 }}
				color={APP_FONT.MONTSERRAT_BODY}
			/>
		</TouchableOpacity>
	);
});

export default PreviewedPostEdit;
