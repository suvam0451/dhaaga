import { memo } from 'react';
import { Text } from 'react-native';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { RandomUtil } from '../../../utils/random.utils';
import { AppText } from '../../lib/Text';

type Props = {
	value: string;
	fontFamily: string;
};

const HashtagSegment = memo(function Foo({ value }: Props) {
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
			<AppText.Normal
				style={{
					color: theme.secondary.a40,
					fontSize: 12,
				}}
			>
				#
			</AppText.Normal>
			<AppText.Medium
				onPress={onPress}
				style={{
					color: theme.secondary.a0,
					// fontFamily: 'SourceSansPro_600SemiBold', // APP_FONTS.INTER_500_MEDIUM,
					// fontSize: 15,
					// fontSize: 13.5,
				}}
			>
				{_value}
			</AppText.Medium>
		</Text>
	);
});

export default HashtagSegment;
