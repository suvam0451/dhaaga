import { Pressable, View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import { PostObjectType } from '@dhaaga/bridge';
import useAppNavigator from '#/states/useAppNavigator';
import TextAstRendererView from '#/ui/TextAstRendererView';
import { QuotedPostOrnament } from '#/features/post-item-view/components/Ornaments';
import UserBadge from '#/ui/UserBadge';
import { appDimensions } from '#/styles/dimensions';

type Props = {
	post: PostObjectType;
};

function StatusQuoted({ post }: Props) {
	const { toPost } = useAppNavigator();

	// TODO: media interaction not implemented
	function onPressMediaItem() {}

	if (!post) {
		console.log('[WARN]: expected post object in quoted status slot', post);
		return <View />;
	}

	function onPressPost() {
		toPost(post.id);
	}

	return (
		<Pressable onPress={onPressPost}>
			<QuotedPostOrnament>
				<UserBadge
					userId={post.postedBy.id}
					avatarUrl={post.postedBy.avatarUrl}
					displayName={post.postedBy.displayName}
					handle={post.postedBy.handle}
					parsedDisplayName={post.postedBy.parsedDisplayName}
					style={{ marginBottom: appDimensions.timelines.sectionBottomMargin }}
				/>
				<MediaItem
					attachments={post.content.media}
					calculatedHeight={post.calculated.mediaContainerHeight}
					onPress={onPressMediaItem}
				/>
				<TextAstRendererView
					tree={post.content.parsed}
					variant={'bodyContent'}
					mentions={[]}
					emojiMap={post.calculated.emojis}
				/>
			</QuotedPostOrnament>
		</Pressable>
	);
}

export default StatusQuoted;
