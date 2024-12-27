import { memo } from 'react';
import { Text } from 'react-native';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState from '../../../states/_global';
import { RandomUtil } from '../../../utils/random.utils';
import { APP_BOTTOM_SHEET_ENUM } from '../../dhaaga-bottom-sheet/Core';
import { APP_FONTS } from '../../../styles/AppFonts';

type Props = {
	value: string;
	fontFamily: string;
};

const HashtagSegment = memo(function Foo({ value, fontFamily }: Props) {
	const { theme, show, appSession } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			theme: o.colorScheme,
			appSession: o.appSession,
		})),
	);

	const { acceptTouch } = useAppMfmContext();
	const _value = decodeURI(value);

	const onPress = () => {
		if (!acceptTouch) return;
		appSession.storage.setTagTarget(_value);
		show(APP_BOTTOM_SHEET_ENUM.HASHTAG, true);
	};
	const k = RandomUtil.nanoId();

	return (
		<Text key={k}>
			<Text
				style={{
					color: theme.secondary.a40,
					fontFamily: APP_FONTS.INTER_400_REGULAR,
					fontSize: 12,
				}}
			>
				#
			</Text>
			<Text
				onPress={onPress}
				style={{
					color: theme.complementary.a0,
					fontFamily: APP_FONTS.INTER_500_MEDIUM,
				}}
			>
				{_value}
			</Text>
		</Text>
	);
});

export default HashtagSegment;
