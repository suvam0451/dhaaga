import { Fragment } from 'react';
import ShareIndicator from '../../components/common/status/fragments/ShareIndicator';
import { withPostItemContext } from '#/components/containers/contexts/WithPostItemContext';
import SingleStatusView from '../post-view/SingleStatusView';
import { ReplyIndicator } from '../../components/common/status/ListView/_shared';
import ParentPost from '../../components/common/status/fragments/ParentPost';
import { PostContainer } from '../../components/common/status/_shared';
import { View } from 'react-native';

/**
 * ActivityPub post-objects sometimes
 * offer parent post information (Misskey)
 *
 * AT protocol is also providers root status
 * information (Bluesky)
 */
function AncestorFragment() {
	const { dto } = withPostItemContext();

	if (!dto.replyTo) return <ReplyIndicator />;

	const IS_PARENT_ALSO_ROOT = dto.rootPost?.id === dto.replyTo?.id;
	return (
		<Fragment>
			{dto.rootPost && !IS_PARENT_ALSO_ROOT && (
				<ParentPost dto={dto.rootPost} showReplyIndicator={false} />
			)}
			<ParentPost dto={dto.replyTo} showReplyIndicator={!dto.rootPost} />
		</Fragment>
	);
}

type StatusItemProps = {
	// disables all interactions
	isPreview?: boolean;
	isPin?: boolean;
	// for post-details page
	showFullDetails?: boolean;
};

/**
 * Renders a status/note
 * @constructor
 */
function PostTimelineEntryView({
	isPreview,
	isPin,
	showFullDetails,
}: StatusItemProps) {
	const { dto } = withPostItemContext();
	if (!dto) return <View />;
	if (dto.meta.isBoost) {
		// Quote Boost
		if (!!dto.content.raw || dto.content.media.length > 0) {
			return (
				<PostContainer>
					<SingleStatusView
						hasBoost={true}
						isPreview={isPreview}
						isPin={isPin}
						showFullDetails={showFullDetails}
					/>
				</PostContainer>
			);
		} else {
			// Normal Boost + Has Reply
			if (dto.meta.isReply) {
				return (
					<PostContainer>
						<ShareIndicator
							avatarUrl={dto.postedBy?.avatarUrl}
							parsedDisplayName={dto.postedBy?.parsedDisplayName}
							createdAt={dto.createdAt}
						/>
						<AncestorFragment />
						<SingleStatusView
							hasBoost={true}
							hasParent={true}
							isPreview={isPreview}
							isPin={isPin}
							showFullDetails={showFullDetails}
						/>
					</PostContainer>
				);
			} else {
				return (
					<PostContainer>
						<ShareIndicator
							avatarUrl={dto.postedBy?.avatarUrl}
							parsedDisplayName={dto.postedBy?.parsedDisplayName}
							createdAt={dto.createdAt}
						/>
						<SingleStatusView
							hasBoost={true}
							isPreview={isPreview}
							isPin={isPin}
							showFullDetails={showFullDetails}
						/>
					</PostContainer>
				);
			}
		}
	} else if (dto.meta.isReply) {
		return (
			<PostContainer>
				<AncestorFragment />
				<SingleStatusView
					hasParent={true}
					isPreview={isPreview}
					isPin={isPin}
					showFullDetails={showFullDetails}
				/>
			</PostContainer>
		);
	} else {
		return (
			<PostContainer>
				<SingleStatusView
					isPreview={isPreview}
					isPin={isPin}
					showFullDetails={showFullDetails}
				/>
			</PostContainer>
		);
	}
}

export default PostTimelineEntryView;
