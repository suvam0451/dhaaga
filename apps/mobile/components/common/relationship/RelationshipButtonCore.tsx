import { memo, useMemo, useState } from 'react';
import useRelationshipWith from '../../../states/useRelationshipWith';
import FollowRequestPendingState from './fragments/FollowRequestPendingState';
import { View } from 'react-native';
import RDPending from './dialogs/RDPending';
import RelationStrangers from './fragments/RelationStrangers';
import RDFollow from './dialogs/RDFollow';
import RelationFollowing from './fragments/RelationFollowing';
import RDFollowing from './dialogs/RDFollowing';
import RelationFollowedBy from './fragments/RelationFollowedBy';
import RelationFriends from './fragments/RelationFriends';

type RelationshipButtonCoreProps = {
	userId: string;
};

const RelationshipButtonCore = memo(
	({ userId }: RelationshipButtonCoreProps) => {
		const [DVFollow, setDVFollow] = useState(false);
		const [DVPending, setDVPending] = useState(false);
		const [DVFollowing, setDVFollowing] = useState(false);
		const [DVFollowBack, setDVFollowBack] = useState(false);

		const {
			relationState,
			refetchRelation,
			relation,
			relationLoading,
			follow,
			unfollow,
		} = useRelationshipWith(userId);

		const FollowLabel = useMemo(() => {
			if (relation.requested) {
				return (
					<FollowRequestPendingState
						loading={relationLoading}
						onPress={() => {
							setDVPending(true);
						}}
					/>
				);
			}
			if (!relation.following && !relation.followedBy) {
				return (
					<RelationStrangers
						loading={relationLoading}
						onPress={() => {
							setDVFollow(true);
						}}
					/>
				);
			}
			if (relation.following && !relation.followedBy) {
				return (
					<RelationFollowing
						loading={relationLoading}
						onPress={() => {
							setDVFollowing(true);
						}}
					/>
				);
			}
			if (relation.followedBy && !relation.following) {
				return (
					<RelationFollowedBy loading={relationLoading} onPress={() => {}} />
				);
			}
			if (relation.following && relation.followedBy) {
				return <RelationFriends loading={relationLoading} onPress={() => {}} />;
			}
			return <View />;
			// if (!relation.following && !relation.followedBy) {
			// 	return AppRelationship.UNRELATED;
			// }
			// if (relation.following && !relation.followedBy) {
			// 	return AppRelationship.FOLLOWING;
			// }
			// if (relation.following && relation.followedBy) {
			// 	return AppRelationship.FRIENDS;
			// }
			// if (!relation.following && relation.followedBy) {
			// 	return AppRelationship.FOLLOWED_BY;
			// }
			// if (relation.blocking) {
			// 	return AppRelationship.BLOCKED;
			// }
			// if (relation.blockedBy) {
			// 	return AppRelationship.BLOCKED_BY;
			// }
			// return AppRelationship.UNKNOWN;
		}, [relation, relationState]);

		return (
			<View>
				{FollowLabel}
				{/*Dialog Array*/}
				<RDFollow
					visible={DVFollow}
					setVisible={setDVFollow}
					loading={relationLoading}
					follow={follow}
					profileLocked={false}
				/>
				<RDPending
					visible={DVPending}
					setVisible={setDVPending}
					loading={relationLoading}
					cancelFollowRequest={() => {}}
					refresh={refetchRelation}
				/>
				<RDFollowing
					visible={DVFollowing}
					setVisible={setDVFollowing}
					loading={relationLoading}
					unfollow={unfollow}
				/>
			</View>
		);
	},
);

export default RelationshipButtonCore;
