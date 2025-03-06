import { View } from 'react-native';
import useAppNavigator from '../../../../../states/useAppNavigator';
import type { PostObjectType } from '@dhaaga/bridge';
import MediaThumbListPresenter from '../../../../../features/inbox/presenters/MediaThumbListPresenter';
import { useAppApiClient } from '../../../../../hooks/utility/global-state-extractors';
import { TextContentView } from '../../../../common/status/TextContentView';
import { PressableDisabledOnSwipe } from '../../../../../ui/Touchable';

type Props = {
	post: PostObjectType;
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
		<View>
			<MediaThumbListPresenter
				post={post}
				items={post?.content?.media}
				server={driver}
			/>
			<PressableDisabledOnSwipe onPress={onPress}>
				<TextContentView
					tree={post.content.parsed}
					variant={'bodyContent'}
					mentions={post.meta.mentions as any}
					emojiMap={post.calculated.emojis}
				/>
			</PressableDisabledOnSwipe>
		</View>
	);
}
