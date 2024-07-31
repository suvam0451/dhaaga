import { memo, useMemo, Fragment, useState } from 'react';
import AppButtonFollowIndicator from '../../../lib/Buttons';
import useRelationshipWith from '../../../../states/useRelationshipWith';
import { AppRelationship } from '../../../../types/ap.types';
import ConfirmRelationshipChangeDialog from '../../../screens/shared/fragments/ConfirmRelationshipChange';
import { useActivityPubRestClientContext } from '../../../../states/useActivityPubRestClient';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';
import { MastoRelationship } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';

/**
 * A label to indicate your current
 * relationship with a user and options
 * to change it
 */
const FollowIndicator = memo(function Foo({ userId }: { userId: string }) {
	const { client, domain } = useActivityPubRestClientContext();

	const [
		IsUnfollowConfirmationDialogVisible,
		setIsUnfollowConfirmationDialogVisible,
	] = useState(false);

	const {
		relationState,
		refetchRelation,
		relation,
		setRelation,
		relationLoading,
		setRelationLoading,
	} = useRelationshipWith(userId);

	const FollowLabel = useMemo(() => {
		if (!relation.following && !relation.followedBy) {
			return AppRelationship.UNRELATED;
		}
		if (relation.following && !relation.followedBy) {
			return AppRelationship.FOLLOWING;
		}
		if (relation.following && relation.followedBy) {
			return AppRelationship.FRIENDS;
		}
		if (!relation.following && relation.followedBy) {
			return AppRelationship.FOLLOWED_BY;
		}
		if (relation.blocking) {
			return AppRelationship.BLOCKED;
		}
		if (relation.blockedBy) {
			return AppRelationship.BLOCKED_BY;
		}
		return AppRelationship.UNKNOWN;
	}, [relation, relationState]);

	function onFollowButtonClick() {
		if (!relation.following) {
			setRelationLoading(true);
			client.accounts
				.follow(userId, { reblogs: true, notify: false })
				.then(({ data, error }) => {
					if (domain === KNOWN_SOFTWARE.MASTODON) {
						setRelation(data as MastoRelationship);
					} else {
						refetchRelation();
					}
				});
		} else {
			setIsUnfollowConfirmationDialogVisible(true);
		}
	}

	function onUnfollow() {
		setRelationLoading(true);
		setIsUnfollowConfirmationDialogVisible(false);
		client.accounts.unfollow(userId).then(({ data, error }) => {
			if (domain === KNOWN_SOFTWARE.MASTODON) {
				setRelation(data as MastoRelationship);
			} else {
				refetchRelation();
			}
		});
	}

	return (
		<Fragment>
			<AppButtonFollowIndicator
				label={FollowLabel}
				onClick={onFollowButtonClick}
				loading={relationLoading}
			/>
			<ConfirmRelationshipChangeDialog
				visible={IsUnfollowConfirmationDialogVisible}
				setVisible={setIsUnfollowConfirmationDialogVisible}
				onUnfollow={onUnfollow}
			/>
		</Fragment>
	);
});

export default FollowIndicator;
