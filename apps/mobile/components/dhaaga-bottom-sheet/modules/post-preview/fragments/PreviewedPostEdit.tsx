import { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { AppIcon } from '../../../../lib/Icon';
import useGlobalState from '../../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const PreviewedPostEdit = memo(({}: { State: string }) => {
	const { postValue, theme } = useGlobalState(
		useShallow((o) => ({
			postValue: o.bottomSheet.postValue,
			theme: o.colorScheme,
		})),
	);

	function onEditPress() {}

	if (postValue === null) return <View />;
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
