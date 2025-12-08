import { View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import PostCreatedBy from '#/components/common/status/fragments/PostCreatedBy';
import { appDimensions } from '#/styles/dimensions';
import { TextContentView } from '#/components/common/status/TextContentView';
import { QuoteOrnament } from '#/features/post-view/components/Ornaments';
import { PostObjectType } from '@dhaaga/bridge';

const SECTION_MARGIN_BOTTOM = appDimensions.timelines.sectionBottomMargin;

type Props = {
	post: PostObjectType;
};

function StatusQuoted({ post }: Props) {
	// TODO: media interaction not implemented
	function onPressMediaItem() {}

	if (!post) {
		console.log('[WARN]: expected post object in quoted status slot', post);
		return <View />;
	}
	return (
		<QuoteOrnament>
			<PostCreatedBy style={{ marginBottom: SECTION_MARGIN_BOTTOM }} />
			<MediaItem
				attachments={post.content.media}
				calculatedHeight={post.calculated.mediaContainerHeight}
				onPress={onPressMediaItem}
			/>
			<TextContentView
				tree={post.content.parsed}
				variant={'bodyContent'}
				mentions={[]}
				emojiMap={post.calculated.emojis}
			/>
		</QuoteOrnament>
	);
}

export default StatusQuoted;
