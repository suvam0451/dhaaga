import { memo, useMemo } from 'react';
import {
	BOTTOM_SHEET_ENUM,
	useGorhomActionSheetContext,
} from '../../../states/useGorhomBottomSheet';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import GlobalMmkvCacheService from '../../../services/globalMmkvCache.services';
import { Text } from 'react-native';
import { randomUUID } from 'expo-crypto';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';
import { useAppTheme } from '../../../hooks/app/useAppThemePack';

type Props = {
	value: string;
	fontFamily: string;
};
const HashtagSegment = memo(function Foo({ value, fontFamily }: Props) {
	const { colorScheme } = useAppTheme();
	const { acceptTouch } = useAppMfmContext();
	const _value = decodeURI(value);

	const { setVisible, setBottomSheetType, updateRequestId } =
		useGorhomActionSheetContext();
	const { globalDb } = useGlobalMmkvContext();
	const item = null;
	// useQuery(ActivityPubTag).find(
	// 	(o: ActivityPubTag) => o.name.toLowerCase() === _value.toLowerCase(),
	// );

	const { isFollowed, isPrivatelyFollowed } = useMemo(() => {
		return {
			isFollowed: item && item.following,
			isPrivatelyFollowed: item && item.privatelyFollowing,
		};
	}, [item?.following, item?.privatelyFollowing]);

	const onPress = () => {
		if (!acceptTouch) return;

		GlobalMmkvCacheService.setBottomSheetProp_Hashtag(globalDb, {
			name: _value,
			remoteInstance: 'N/A',
		});
		setBottomSheetType(BOTTOM_SHEET_ENUM.HASHTAG);
		updateRequestId();

		setTimeout(() => {
			setVisible(true);
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
