import { memo, useMemo } from 'react';
import { Text } from 'react-native';
import { randomUUID } from 'expo-crypto';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';
import { useShallow } from 'zustand/react/shallow';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';

type Props = {
	value: string;
	fontFamily: string;
};
const HashtagSegment = memo(function Foo({ value, fontFamily }: Props) {
	const { colorScheme } = useAppTheme();
	const { acceptTouch } = useAppMfmContext();
	const _value = decodeURI(value);

	const { show, mmkv, setTextValue, setType } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			mmkv: o.mmkv,
			setTextValue: o.bottomSheet.setTextValue,
			setType: o.bottomSheet.setType,
		})),
	);
	const item = null;

	const { isFollowed, isPrivatelyFollowed } = useMemo(() => {
		return {
			isFollowed: item && item.following,
			isPrivatelyFollowed: item && item.privatelyFollowing,
		};
	}, [item?.following, item?.privatelyFollowing]);

	const onPress = () => {
		if (!acceptTouch) return;

		setTextValue(_value);
		setType(APP_BOTTOM_SHEET_ENUM.HASHTAG);
		setTimeout(() => {
			show();
		}, 200);
	};

	const k = randomUUID();

	return (
		<Text
			onPress={onPress}
			key={k}
			style={{
				color: isFollowed
					? colorScheme.palette.hashtagHigh
					: colorScheme.palette.hashtagLow,
				fontFamily: fontFamily,
				// fontFamily: isFollowed
				// 	? APP_FONTS.MONTSERRAT_700_BOLD
				// 	: APP_FONTS.MONTSERRAT_400_REGULAR,
				backgroundColor: isPrivatelyFollowed
					? 'rgba(240,185,56,0.16)'
					: undefined,
			}}
		>
			#{_value}
		</Text>
	);
});

export default HashtagSegment;
