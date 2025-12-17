import { Text } from 'react-native';
import { useAppBottomSheet, useAppTheme } from '#/states/global/hooks';
import { APP_BOTTOM_SHEET_ENUM } from '#/states/global/slices/createBottomSheetSlice';
import { NativeTextNormal } from '#/ui/NativeText';
import { APP_COLOR_PALETTE_EMPHASIS } from '#/utils/theming.util';

type Props = {
	value: string;
};

function HashtagSegment({ value }: Props) {
	const { theme } = useAppTheme();
	const { show } = useAppBottomSheet();

	const _value = decodeURI(value.replace('#', '')); // atproto

	function onPress() {
		show(APP_BOTTOM_SHEET_ENUM.HASHTAG, true, {
			$type: 'tag-preview',
			tagId: _value,
		});
	}

	return (
		<Text onPress={onPress}>
			<NativeTextNormal
				style={{
					color: theme.secondary.a50,
					fontSize: 12,
				}}
			>
				#
			</NativeTextNormal>
			<NativeTextNormal
				emphasis={APP_COLOR_PALETTE_EMPHASIS.A30}
				onPress={onPress}
			>
				{_value}
			</NativeTextNormal>
		</Text>
	);
}

export default HashtagSegment;
