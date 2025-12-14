import { Pressable, View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import PostInteractionStatsRow from '#/features/post-view/views/PostInteractionStatsRow';
import StatusQuoted from '#/features/post-view/views/StatusQuoted';
import PostCreatedByIconOnly from './PostCreatedByIconOnly';
import type { PostObjectType } from '@dhaaga/bridge';
import { useAppApiClient } from '#/states/global/hooks';
import { PostedByTextOneLine, timelineStyles } from '../Fragments';
import { ReplyIndicator } from '../ListView/_shared';
import useAppNavigator from '#/states/useAppNavigator';
import { appDimensions } from '#/styles/dimensions';
import ReplyIndicatorDecoration from '#/skins/ReplyIndicatorDecoration';
import TextAstRendererView from '#/ui/TextAstRendererView';

type Props = {
	dto: PostObjectType;
	showReplyIndicator: boolean;
};

function ParentPost({ dto, showReplyIndicator }: Props) {
	const { driver } = useAppApiClient();
	const { toPost } = useAppNavigator();

	const IS_QUOTE_BOOST = dto.meta.isBoost && dto.content.raw;

	function onPressBody() {
		toPost(dto.id);
	}

	function onPressImage() {}

	return (
		<View>
			{showReplyIndicator && dto.meta.isReply && <ReplyIndicator />}
			<View style={timelineStyles.parentPostRootView}>
				<PostCreatedByIconOnly dto={dto} />
				<View style={timelineStyles.parentPostContentView}>
					<PostedByTextOneLine
						parsedText={dto.postedBy.parsedDisplayName}
						altText={dto.postedBy.handle}
						driver={driver}
						createdAt={dto.createdAt}
					/>
					<MediaItem
						attachments={dto.content.media}
						calculatedHeight={dto.calculated.mediaContainerHeight}
						style={{
							marginTop: appDimensions.timelines.sectionBottomMargin,
						}}
						onPress={onPressImage}
					/>
					<Pressable onPress={onPressBody}>
						<TextAstRendererView
							tree={dto.content.parsed}
							variant={'bodyContent'}
							mentions={dto.calculated.mentions as any}
							emojiMap={dto.calculated.emojis}
						/>
					</Pressable>
					{IS_QUOTE_BOOST && !!dto.boostedFrom && (
						<StatusQuoted post={dto.boostedFrom} />
					)}
					<PostInteractionStatsRow dto={dto} />
				</View>
				<ReplyIndicatorDecoration />
			</View>
		</View>
	);
}

export default ParentPost;
