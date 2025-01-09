import { memo } from 'react';
import useMfm from '../../../../hooks/useMfm';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Pressable, View } from 'react-native';
import useAppNavigator from '../../../../../states/useAppNavigator';
import { AppPostObject } from '../../../../../types/app-post.types';
import NotificationMediaThumbs from '../../../../common/media/NotificationMediaThumbs';
import { appDimensions } from '../../../../../styles/dimensions';
import { APP_COLOR_PALETTE_EMPHASIS } from '../../../../../utils/theming.util';
import { AppUserObject } from '../../../../../types/app-user.types';
import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';

type Props = {
	acct: AppUserObject;
	post: AppPostObject;
};

/**
 * Shows a preview of the status being liked/boosted,
 *
 * - upto 3 lines for text-only posts
 */
export const NotificationPostPeek = memo(({ acct, post }: Props) => {
	const { driver } = useAppApiClient();
	let _post = post;
	if (post.boostedFrom) {
		_post = post.boostedFrom;
	}

	const { content } = useMfm({
		content: _post.content.raw,
		emojiMap: _post.calculated.emojis,
		expectedHeight: 20,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
		emphasis: APP_COLOR_PALETTE_EMPHASIS.A10,
	});

	const { toPost } = useAppNavigator();
	function onPress() {
		toPost(post.id);
	}

	return (
		<View>
			<NotificationMediaThumbs
				post={_post}
				items={_post?.content?.media}
				server={driver}
			/>
			<View
				style={{ marginBottom: appDimensions.timelines.sectionBottomMargin }}
			>
				<Pressable onPress={onPress}>{content}</Pressable>
			</View>
		</View>
	);
});
