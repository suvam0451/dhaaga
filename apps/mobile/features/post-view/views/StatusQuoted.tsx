import { Pressable, View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import PostCreatedBy from '#/components/common/status/fragments/PostCreatedBy';
import { appDimensions } from '#/styles/dimensions';
import { PostObjectType } from '@dhaaga/bridge';
import { QuotedPostBorderDecorations } from '#/skins/BorderDecorations';
import useAppNavigator from '#/states/useAppNavigator';
import TextAstRendererView from '#/ui/TextAstRendererView';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

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
			<QuotedPostBorderDecorations>
				<PostCreatedBy
					style={{ marginBottom: SECTION_MARGIN_BOTTOM }}
					post={post}
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
			</QuotedPostBorderDecorations>
		</Pressable>
	);
}

export default StatusQuoted;
