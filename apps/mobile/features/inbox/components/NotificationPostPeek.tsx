import { View } from 'react-native';
import useAppNavigator from '#/states/useAppNavigator';
import type { PostObjectType } from '@dhaaga/bridge';
import MediaThumbListPresenter from '#/features/inbox/presenters/MediaThumbListPresenter';
import { useAppApiClient } from '#/states/global/hooks';
import { PressableDisabledOnSwipe } from '#/ui/Touchable';
import TextAstRendererView from '#/ui/TextAstRendererView';

type Props = {
	post: PostObjectType;
};

/**
 * Shows a preview of the status being liked/boosted.
 *
 * - up to 3 lines for text-only posts
 */
export function NotificationPostPeek({ post }: Props) {
	const { driver } = useAppApiClient();
	const { toPost } = useAppNavigator();

	if (!post) return <View />;

	function onPress() {
		toPost(post.id);
	}

	return (
		<>
			<MediaThumbListPresenter
				post={post}
				items={post?.content?.media}
				server={driver}
			/>
			<PressableDisabledOnSwipe onPress={onPress}>
				<TextAstRendererView
					tree={post.content.parsed}
					variant={'bodyContent'}
					mentions={post.meta.mentions}
					emojiMap={post.calculated.emojis}
				/>
			</PressableDisabledOnSwipe>
		</>
	);
}
