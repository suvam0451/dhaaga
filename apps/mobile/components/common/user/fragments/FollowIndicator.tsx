import { memo, useMemo, useState } from 'react';
import AppButtonFollowIndicator from '../../../lib/Buttons';
import useRelationshipWith from '../../../../states/useRelationshipWith';
import { AppRelationship } from '../../../../types/ap.types';
import ConfirmRelationshipChangeDialog from '../../../screens/shared/fragments/ConfirmRelationshipChange';
import { StyleProp, View, ViewStyle } from 'react-native';
import useGlobalState from '../../../../states/_global';
import { useShallow } from 'zustand/react/shallow';

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
	const { client, driver } = useGlobalState(
		useShallow((o) => ({
			client: o.router,
			driver: o.driver,
		})),
	);

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
		follow,
		unfollow,
	} = useRelationshipWith(userId);

	const FollowLabel = useMemo(() => {
		if (relation.requested) {
			return AppRelationship.FOLLOW_REQUEST_PENDING;
		}
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
