import { UserInterface } from '@dhaaga/shared-abstraction-activitypub';
import { memo } from 'react';
import useMfm from '../../../../hooks/useMfm';
import { APP_FONTS } from '../../../../../styles/AppFonts';
import { Pressable, View } from 'react-native';
import useAppNavigator from '../../../../../states/useAppNavigator';
import {
	ActivityPubStatusAppDtoType,
	AppActivityPubMediaType,
} from '../../../../../types/app-post.types';
import NotificationMediaThumbs from '../../../../common/media/NotificationMediaThumbs';

type Props = {
	acct: UserInterface;
	post: ActivityPubStatusAppDtoType;
};

type MediaGalleryProps = {
	items: AppActivityPubMediaType[];
};

function PostMediaGallery({ items }: MediaGalleryProps) {
	if (items.length === 0) return <View />;
}

/**
 * Shows a preview of the status being liked/boosted,
 *
 * - upto 3 lines for text-only posts
 */
export const NotificationPostPeek = memo(({ acct, post }: Props) => {
	let _post = post;
	if (post.boostedFrom) {
		_post = post.boostedFrom;
	}

	const { content } = useMfm({
		content: _post.content.raw,
		remoteSubdomain: acct.getInstanceUrl(),
		emojiMap: acct.getEmojiMap(),
		deps: [_post.content.raw],
		expectedHeight: 20,
		fontFamily: APP_FONTS.INTER_400_REGULAR,
	});

	const { toPost } = useAppNavigator();

	function onPress() {
		toPost(post.id);
	}

	return (
		<View>
			<Pressable onPress={onPress}>{content}</Pressable>
			<View>
				<NotificationMediaThumbs
					items={_post?.content?.media}
					maxH={_post?.calculated?.mediaContainerHeight}
				/>
			</View>
		</View>
	);
});
