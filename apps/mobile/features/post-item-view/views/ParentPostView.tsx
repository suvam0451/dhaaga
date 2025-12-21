import { Pressable, View } from 'react-native';
import MediaItem from '#/ui/media/MediaItem';
import PostInteractionStatsRow from '#/features/post-item-view/views/PostInteractionStatsRow';
import StatusQuoted from '#/features/post-item-view/views/StatusQuoted';
import PostCreatedByIconOnly from '#/components/common/status/fragments/PostCreatedByIconOnly';
import { useAppApiClient } from '#/states/global/hooks';
import {
	PostedByTextOneLine,
	timelineStyles,
} from '#/components/common/status/Fragments';
import useAppNavigator from '#/states/useAppNavigator';
import { appDimensions } from '#/styles/dimensions';
import TextAstRendererView from '#/ui/TextAstRendererView';
import {
	ReplyContextLine,
	ReplyIndicatorOrnament,
} from '#/features/post-item-view/components/Ornaments';
import WithAppStatusItemContext, {
	withPostItemContext,
} from '#/components/containers/WithPostItemContext';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';
import { PostObjectType } from '@dhaaga/bridge';

type Props = {
	showReplyIndicator: boolean;
};

function Generator({ showReplyIndicator }: Props) {
	const { dto: post } = withPostItemContext();
	const { driver } = useAppApiClient();
	const { toPost } = useAppNavigator();

	const IS_QUOTE_BOOST = post.meta.isBoost && post.content.raw;

	function onPressBody() {
		toPost(post.id);
	}

	function onPressImage() {}

	if (!post) return <View />;
	return (
		<View>
			{showReplyIndicator ? <ReplyIndicatorOrnament /> : <View />}
			<View style={timelineStyles.parentPostRootView}>
				<PostCreatedByIconOnly dto={post} />
				<View style={timelineStyles.parentPostContentView}>
					<PostedByTextOneLine
						parsedText={post.postedBy.parsedDisplayName}
						altText={post.postedBy.handle}
						driver={driver}
						createdAt={post.createdAt}
					/>
					<MediaItem
						attachments={post.content.media}
						calculatedHeight={post.calculated.mediaContainerHeight}
						style={{
							marginTop: appDimensions.timelines.sectionBottomMargin,
						}}
						onPress={onPressImage}
					/>
					<Pressable onPress={onPressBody}>
						<TextAstRendererView
							tree={post.content.parsed}
							variant={'bodyContent'}
							mentions={post.calculated.mentions as any}
							emojiMap={post.calculated.emojis}
						/>
					</Pressable>
					{IS_QUOTE_BOOST && !!post.boostedFrom && (
						<StatusQuoted post={post.boostedFrom} />
					)}
					<PostInteractionStatsRow dto={post} />
				</View>
				<ReplyContextLine />
			</View>
		</View>
	);
}

function ParentPostView({
	post,
	showReplyIndicator,
}: Props & { post: PostObjectType }) {
	const { post: _post } = usePostEventBusStore(post);
	return (
		<WithAppStatusItemContext dto={_post}>
			<Generator showReplyIndicator={showReplyIndicator} />
		</WithAppStatusItemContext>
	);
}

export default ParentPostView;
