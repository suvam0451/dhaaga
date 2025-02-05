import { Fragment, useMemo } from 'react';
import ShareIndicator from './fragments/ShareIndicator';
import { useAppStatusItem } from '../../../hooks/ap-proto/useAppStatusItem';
import StatusCore from './fragments/StatusCore';
import { useAppAcct } from '../../../hooks/utility/global-state-extractors';
import { ReplyIndicator } from './ListView/_shared';
import ParentPost from './fragments/ParentPost';
import { PostContainer } from './_shared';

/**
 * ActivityPub post objects sometimes
 * offer parent post information (Misskey)
 *
 * AT protocol also providers root status
 * information (Bluesy)
 */
function AncestorFragment() {
	const { dto } = useAppStatusItem();

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
	// for post details page
	showFullDetails?: boolean;
};

/**
 * Renders a status/note
 * @constructor
 */
function StatusItem({ isPreview, isPin, showFullDetails }: StatusItemProps) {
	const { acct } = useAppAcct();
	const { dto } = useAppStatusItem();

	return useMemo(() => {
		if (dto.meta.isBoost) {
			// Quote Boost
			if (!!dto.content.raw || dto.content.media.length > 0) {
				return (
					<PostContainer>
						<StatusCore
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
							<StatusCore
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
							<StatusCore
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
					<StatusCore
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
					<StatusCore
						isPreview={isPreview}
						isPin={isPin}
						showFullDetails={showFullDetails}
					/>
				</PostContainer>
			);
		}
	}, [dto, acct]);
}

export default StatusItem;
