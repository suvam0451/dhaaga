import { Pressable, View } from 'react-native';
import useAppNavigator from '../../../../../states/useAppNavigator';
import { AppPostObject } from '../../../../../types/app-post.types';
import NotificationMediaThumbs from '../../../../common/media/NotificationMediaThumbs';
import { AppUserObject } from '../../../../../types/app-user.types';
import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { TextContentView } from '../../../../common/status/TextContentView';

type Props = {
	acct: AppUserObject;
	post: AppPostObject;
};

/**
 * Shows a preview of the status being liked/boosted,
 *
 * - upto 3 lines for text-only posts
 */
export function NotificationPostPeek({ post }: Props) {
	const { driver } = useAppApiClient();
	const { toPost } = useAppNavigator();

	if (!post) return <View />;

	function onPress() {
		toPost(post.id);
	}
	return (
		<Pressable onPress={onPress}>
			<NotificationMediaThumbs
				post={post}
				items={post?.content?.media}
				server={driver}
			/>
			<Pressable onPress={onPress}>
				<TextContentView
					tree={post.content.parsed}
					variant={'bodyContent'}
					mentions={post.calculated.mentions as any}
					emojiMap={post.calculated.emojis}
				/>
			</Pressable>
		</Pressable>
	);
}
