import { Text } from 'react-native';
import { memo } from 'react';
import { APP_THEME } from '../../../styles/AppTheme';
import { APP_FONTS } from '../../../styles/AppFonts';
import useGlobalState, { APP_BOTTOM_SHEET_ENUM } from '../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

const HashtagProcessor = memo(function Foo({
	content,
	forwardedKey,
}: {
	content: string;
	forwardedKey: string | number;
}) {
	const { show, appSession } = useGlobalState(
		useShallow((o) => ({
			show: o.bottomSheet.show,
			appSession: o.appSession,
		})),
	);

	function onPress() {
		appSession.cache.setTagTarget(content);
		show(APP_BOTTOM_SHEET_ENUM.HASHTAG, true);
	}

	let isFollowed = false;
	let isPrivatelyFollowed = false;

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
