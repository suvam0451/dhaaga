import { Fragment, memo, useMemo } from 'react';
import ShareIndicator from '#/components/common/status/fragments/ShareIndicator';
import WithAppStatusItemContext, {
	withPostItemContext,
} from '#/components/containers/WithPostItemContext';
import RootStatusView from './views/RootStatusView';
import ParentPostView from '#/features/post-item-view/views/ParentPostView';
import { PostContainer } from '#/components/common/status/_shared';
import { View } from 'react-native';
import { PostObjectType } from '@dhaaga/bridge';
import { usePostEventBusStore } from '#/hooks/pubsub/usePostEventBus';
import { TimelineFilter_EmojiCrash } from '#/features/timelines/components/TimelineFilter_EmojiCrash';
import { ReplyIndicatorOrnament } from '#/features/post-item-view/components/Ornaments';

/**
 * ActivityPub post-objects sometimes
 * offer parent post information (Misskey)
 *
 * AT protocol also providers root status
 * information (Bluesky)
 */
function AncestorFragment() {
	const { dto } = withPostItemContext();

	if (!dto.replyTo) return <ReplyIndicatorOrnament />;

	/**
	 * the parent post may be a reply itself
	 * */
	const IS_PARENT_ALSO_ROOT = dto.rootPost?.id === dto.replyTo?.id;
	return (
		<Fragment>
			{dto.rootPost && !IS_PARENT_ALSO_ROOT && (
				<ParentPostView post={dto.rootPost} showReplyIndicator={false} />
			)}
			<ParentPostView post={dto.replyTo} showReplyIndicator={!dto.rootPost} />
		</Fragment>
	);
}

type StatusItemProps = {
	// disables all interactions
	isPreview?: boolean;
	isPin?: boolean;
	// for post-details page
	showFullDetails?: boolean;
	post: PostObjectType;
};

/**
 * Renders a status/note
 * @constructor
 */
const Generator = memo(
	({ isPreview, isPin, showFullDetails }: StatusItemProps) => {
		const { dto: _post } = withPostItemContext();

		const Component = useMemo(() => {
			if (!_post) return <View />;

			if (_post.meta.isBoost) {
				// Quote Boost
				if (!!_post.content.raw || _post.content.media.length > 0) {
					return (
						<RootStatusView
							hasBoost={true}
							isPreview={isPreview}
							isPin={isPin}
							showFullDetails={showFullDetails}
						/>
					);
				} else {
					// Normal Boost + Has Reply
					if (_post.meta.isReply) {
						return (
							<>
								<ShareIndicator
									avatarUrl={_post.postedBy?.avatarUrl}
									parsedDisplayName={_post.postedBy?.parsedDisplayName}
									createdAt={_post.createdAt}
								/>
								<AncestorFragment />
								<RootStatusView
									hasBoost={true}
									hasParent={true}
									isPreview={isPreview}
									isPin={isPin}
									showFullDetails={showFullDetails}
								/>
							</>
						);
					} else {
						return (
							<>
								<ShareIndicator
									avatarUrl={_post.postedBy?.avatarUrl}
									parsedDisplayName={_post.postedBy?.parsedDisplayName}
									createdAt={_post.createdAt}
								/>
								<RootStatusView
									hasBoost={true}
									isPreview={isPreview}
									isPin={isPin}
									showFullDetails={showFullDetails}
								/>
							</>
						);
					}
				}
			} else if (_post.meta.isReply) {
				return (
					<>
						<AncestorFragment />
						<RootStatusView
							hasParent={true}
							isPreview={isPreview}
							isPin={isPin}
							showFullDetails={showFullDetails}
						/>
					</>
				);
			} else {
				console.log('[WARN]: could not resolve layout for the _post entry');
				return (
					<RootStatusView
						isPreview={isPreview}
						isPin={isPin}
						showFullDetails={showFullDetails}
					/>
				);
			}
		}, [_post]);

		return (
			<PostContainer>
				<TimelineFilter_EmojiCrash>{Component}</TimelineFilter_EmojiCrash>
			</PostContainer>
		);
	},
);

function TimelinePostItemView(props: StatusItemProps) {
	const { post: _post } = usePostEventBusStore(props.post);

	return (
		<WithAppStatusItemContext dto={_post}>
			<Generator {...props} />
		</WithAppStatusItemContext>
	);
}

export default TimelinePostItemView;
