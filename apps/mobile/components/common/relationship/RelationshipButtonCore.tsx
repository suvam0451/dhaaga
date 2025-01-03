import { memo, useMemo } from 'react';
import useRelationshipWith from '../../../states/useRelationshipWith';
import FollowRequestPendingState from './fragments/FollowRequestPendingState';
import { View } from 'react-native';
import RelationStrangers from './fragments/RelationStrangers';
import RelationFollowing from './fragments/RelationFollowing';
import RelationFollowedBy from './fragments/RelationFollowedBy';
import RelationFriends from './fragments/RelationFriends';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { useAppDialog } from '../../../hooks/utility/global-state-extractors';

type RelationshipButtonCoreProps = {
	userId: string;
};

/**
 * Indicates the current relationship
 * with a user and allows and
 * shows prompts when changing them
 */
const RelationshipButtonCore = memo(
	({ userId }: RelationshipButtonCoreProps) => {
		const { show, hide } = useAppDialog();

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
							show(
								DialogBuilderService.currentlySentRequestMoreActions(
									() => {
										refetchRelation().finally(() => {
											hide();
										});
									},
									() => {
										hide();
									},
								),
							);
						}}
					/>
				);
			}
			if (!relation.following && !relation.followedBy) {
				return (
					<RelationStrangers
						loading={relationLoading}
						onPress={() => {
							show(
								DialogBuilderService.currentlyUnrelatedMoreActions(() => {
									follow().finally(() => {
										hide();
									});
								}),
							);
						}}
					/>
				);
			}
			if (relation.following && !relation.followedBy) {
				return (
					<RelationFollowing
						loading={relationLoading}
						onPress={() => {
							show(
								DialogBuilderService.currentlyFollowingMoreActions(() => {
									unfollow().finally(() => {
										hide();
									});
								}),
							);
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
			// TODO: implement these relationship states
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

		return <View>{FollowLabel}</View>;
	},
);

export default RelationshipButtonCore;
