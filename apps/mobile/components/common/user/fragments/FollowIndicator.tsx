import { memo, useMemo, useState } from 'react';
import AppButtonFollowIndicator from '../../../lib/Buttons';
import useRelationInteractor from '../../../../features/user-profiles/interactors/useRelationInteractor';
import { AppRelationship } from '../../../../types/ap.types';
import ConfirmRelationshipChangeDialog from '../../../screens/shared/fragments/ConfirmRelationshipChange';
import { StyleProp, View, ViewStyle } from 'react-native';

/**
 * A label to indicate your current
 * relationship with a user and options
 * to change it
 */
const FollowIndicator = memo(function Foo({
	userId,
	style,
}: {
	userId: string;
	style?: StyleProp<ViewStyle>;
}) {
	const [
		IsUnfollowConfirmationDialogVisible,
		setIsUnfollowConfirmationDialogVisible,
	] = useState(false);

	const { relationState, data, relationLoading, follow, unfollow } =
		useRelationInteractor(userId);

	const FollowLabel = useMemo(() => {
		if (data.requested) {
			return AppRelationship.FOLLOW_REQUEST_PENDING;
		}
		if (!data.following && !data.followedBy) {
			return AppRelationship.UNRELATED;
		}
		if (data.following && !data.followedBy) {
			return AppRelationship.FOLLOWING;
		}
		if (data.following && data.followedBy) {
			return AppRelationship.FRIENDS;
		}
		if (!data.following && data.followedBy) {
			return AppRelationship.FOLLOWED_BY;
		}
		if (data.blocking) {
			return AppRelationship.BLOCKED;
		}
		if (data.blockedBy) {
			return AppRelationship.BLOCKED_BY;
		}
		return AppRelationship.UNKNOWN;
	}, [data, relationState]);

	return (
		<View style={style}>
			<AppButtonFollowIndicator
				label={FollowLabel}
				onClick={follow}
				loading={relationLoading}
			/>
			<ConfirmRelationshipChangeDialog
				visible={IsUnfollowConfirmationDialogVisible}
				setVisible={setIsUnfollowConfirmationDialogVisible}
				onUnfollow={unfollow}
			/>
		</View>
	);
});

export default FollowIndicator;
