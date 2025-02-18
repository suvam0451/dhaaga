import { Pressable, View } from 'react-native';
import useAppNavigator from '../../../../../states/useAppNavigator';
import { AppPostObject } from '../../../../../types/app-post.types';
import MediaThumbListPresenter from '../../../../../features/inbox/presenters/MediaThumbListPresenter';
import { AppUserObject } from '../../../../../types/app-user.types';
import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { TextContentView } from '../../../../common/status/TextContentView';

type Props = {
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
			<MediaThumbListPresenter
				post={post}
				items={post?.content?.media}
				server={driver}
			/>
			<Pressable onPress={onPress}>
				<TextContentView
					tree={post.content.parsed}
					variant={'bodyContent'}
					mentions={post.meta.mentions as any}
					emojiMap={post.calculated.emojis}
				/>
			</Pressable>
		</Pressable>
	);
}
