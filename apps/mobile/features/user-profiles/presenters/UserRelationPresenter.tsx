import useRelationInteractor from '../interactors/useRelationInteractor';
import FollowRequestPendingState from '../../../components/common/relationship/fragments/FollowRequestPendingState';
import { View } from 'react-native';
import CurrentRelationView from '../view/CurrentRelationView';
import RelationFollowing from '../../../components/common/relationship/fragments/RelationFollowing';
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
function UserRelationPresenter({ userId }: RelationshipButtonCoreProps) {
	const { show, hide } = useAppDialog();

	const { refetch, data, relationLoading, follow, unfollow } =
		useRelationInteractor(userId);

	if (data.requested) {
		return (
			<FollowRequestPendingState
				loading={relationLoading}
				onPress={() => {
					show(
						DialogBuilderService.currentlySentRequestMoreActions(
							() => {
								refetch().finally(() => {
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
	} else if (!data.following && !data.followedBy) {
		return (
			<CurrentRelationView
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
				label={'Follow'}
				variant={'cta'}
			/>
		);
	} else if (data.following && !data.followedBy) {
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
	} else if (data.followedBy && !data.following) {
		return (
			<CurrentRelationView
				loading={relationLoading}
				onPress={() => {
					show(
						DialogBuilderService.currentlyFollowedMoreActions(() => {
							follow().finally(() => {
								hide();
							});
						}),
					);
				}}
				label={'Follow Back'}
				variant={'info'}
			/>
		);
	} else if (data.following && data.followedBy) {
		return (
			<CurrentRelationView
				loading={relationLoading}
				onPress={() => {
					show(
						DialogBuilderService.currentlyFriendsMoreActions(() => {
							unfollow().finally(() => {
								hide();
							});
						}),
					);
				}}
				label={'Friends'}
				variant={'warm'}
			/>
		);
	} else {
		return <View />;
	}

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
}

export default UserRelationPresenter;
