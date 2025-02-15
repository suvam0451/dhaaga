import { Text } from 'react-native';
import { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { RandomUtil } from '../../../utils/random.utils';
import { AppText } from '../../lib/Text';
import {
	useAppBottomSheet,
	useAppTheme,
} from '../../../hooks/utility/global-state-extractors';

type Props = {
	value: string;
	fontFamily: string;
};

function HashtagSegment({ value }: Props) {
	const { theme } = useAppTheme();
	const { setCtx, show } = useAppBottomSheet();

	const _value = decodeURI(value.replace('#', '')); // atproto

	function onPress() {
		setCtx({ tag: _value });
		show(APP_BOTTOM_SHEET_ENUM.HASHTAG, true);
	}

	const k = RandomUtil.nanoId();

	return (
		<Text key={k} onPress={onPress}>
			<AppText.Normal
				style={{
					color: theme.secondary.a40,
					fontSize: 12,
				}}
			>
				#
			</AppText.Normal>
			<AppText.Normal
				onPress={onPress}
				style={{
					color: theme.complementary.a0,
				}}
			>
				{_value}
			</AppText.Normal>
		</Text>
	);
}

export default HashtagSegment;
