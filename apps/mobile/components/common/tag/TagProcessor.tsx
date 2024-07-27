import { Text } from 'react-native';
import {
	BOTTOM_SHEET_ENUM,
	useGorhomActionSheetContext,
} from '../../../states/useGorhomBottomSheet';
import GlobalMmkvCacheService from '../../../services/globalMmkvCache.services';
import { useGlobalMmkvContext } from '../../../states/useGlobalMMkvCache';
import { useQuery } from '@realm/react';
import { ActivityPubTag } from '../../../entities/activitypub-tag.entity';
import { memo, useMemo } from 'react';
import { APP_THEME } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';

const HashtagProcessor = memo(function Foo({
	content,
	forwardedKey,
}: {
	content: string;
	forwardedKey: string | number;
}) {
	const { setVisible, setBottomSheetType, updateRequestId } =
		useGorhomActionSheetContext();
	const { globalDb } = useGlobalMmkvContext();
	const item = useQuery(ActivityPubTag).find(
		(o: ActivityPubTag) => o.name.toLowerCase() === content.toLowerCase(),
	);

	const { isFollowed, isPrivatelyFollowed } = useMemo(() => {
		return {
			isFollowed: item && item.following,
			isPrivatelyFollowed: item && item.privatelyFollowing,
		};
	}, [item?.following, item?.privatelyFollowing]);

	const onPress = () => {
		GlobalMmkvCacheService.setBottomSheetProp_Hashtag(globalDb, {
			name: content,
			remoteInstance: 'N/A',
		});
		setBottomSheetType(BOTTOM_SHEET_ENUM.HASHTAG);
		updateRequestId();

		setTimeout(() => {
			setVisible(true);
		}, 200);
	};

	return (
		<Text
			onPress={onPress}
			key={forwardedKey}
			style={{
				color: isFollowed
					? APP_THEME.COLOR_SCHEME_D_EMPHASIS
					: APP_THEME.COLOR_SCHEME_D_NORMAL,
				opacity: 1,
				fontFamily: isFollowed
					? APP_FONTS.MONTSERRAT_700_BOLD
					: APP_FONTS.MONTSERRAT_400_REGULAR,
				backgroundColor: isPrivatelyFollowed
					? 'rgba(240,185,56,0.16)'
					: undefined,
			}}
		>
			#{content}
		</Text>
	);
});

export default HashtagProcessor;
