import { memo, useMemo } from 'react';
import {
	BOTTOM_SHEET_ENUM,
	useGorhomActionSheetContext,
} from '../../../states/useGorhomBottomSheet';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import { useQuery } from '@realm/react';
import { ActivityPubTag } from '../../../entities/activitypub-tag.entity';
import GlobalMmkvCacheService from '../../../services/globalMmkvCache.services';
import { Text } from 'react-native';
import { APP_THEME } from '../../../styles/AppTheme';
import { randomUUID } from 'expo-crypto';
import { APP_FONTS } from '../../../styles/AppFonts';
import { useAppMfmContext } from '../../../hooks/app/useAppMfmContext';

type Props = {
	value: string;
	fontFamily: string;
};
const HashtagSegment = memo(function Foo({ value, fontFamily }: Props) {
	const { acceptTouch } = useAppMfmContext();
	const _value = decodeURI(value);

	const { setVisible, setBottomSheetType, updateRequestId } =
		useGorhomActionSheetContext();
	const { globalDb } = useGlobalMmkvContext();
	const item = useQuery(ActivityPubTag).find(
		(o: ActivityPubTag) => o.name.toLowerCase() === _value.toLowerCase(),
	);

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
					? APP_THEME.COLOR_SCHEME_D_EMPHASIS
					: APP_THEME.COLOR_SCHEME_D_NORMAL,
				opacity: 1,
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
