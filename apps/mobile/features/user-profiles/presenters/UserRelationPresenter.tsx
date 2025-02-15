import useRelationInteractor from '../interactors/useRelationInteractor';
import FollowRequestPendingState from '../../../components/common/relationship/fragments/FollowRequestPendingState';
import { View } from 'react-native';
import { DialogBuilderService } from '../../../services/dialog-builder.service';
import { useAppDialog } from '../../../hooks/utility/global-state-extractors';
import { LOCALIZATION_NAMESPACE } from '../../../types/app.types';
import { useTranslation } from 'react-i18next';
import { CurrentRelationView } from '../../../components/lib/Buttons';

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
	const { t } = useTranslation([
		LOCALIZATION_NAMESPACE.DIALOGS,
		LOCALIZATION_NAMESPACE.GLOSSARY,
	]);

	if (data.requested) {
		return (
			<FollowRequestPendingState
				loading={relationLoading}
				onPress={() => {
					show(
						DialogBuilderService.currentlySentRequestMoreActions(
							t,
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
						DialogBuilderService.currentlyUnrelatedMoreActions(t, () => {
							follow().finally(() => {
								hide();
							});
						}),
					);
				}}
				label={t(`relationshipCta.follow`, {
					ns: LOCALIZATION_NAMESPACE.GLOSSARY,
				})}
				variant={'cta'}
			/>
		);
	} else if (data.following && !data.followedBy) {
		return (
			<CurrentRelationView
				loading={relationLoading}
				onPress={() => {
					show(
						DialogBuilderService.currentlyFollowingMoreActions(t, () => {
							unfollow().finally(() => {
								hide();
							});
						}),
					);
				}}
				label={t(`relationship.following`, {
					ns: LOCALIZATION_NAMESPACE.GLOSSARY,
				})}
				variant={'info'}
			/>
		);
	} else if (data.followedBy && !data.following) {
		return (
			<CurrentRelationView
				loading={relationLoading}
				onPress={() => {
					show(
						DialogBuilderService.currentlyFollowedMoreActions(t, () => {
							follow().finally(() => {
								hide();
							});
						}),
					);
				}}
				label={t(`relationshipCta.followBack`, {
					ns: LOCALIZATION_NAMESPACE.GLOSSARY,
				})}
				variant={'info'}
			/>
		);
	} else if (data.following && data.followedBy) {
		return (
			<CurrentRelationView
				loading={relationLoading}
				onPress={() => {
					show(
						DialogBuilderService.currentlyFriendsMoreActions(t, () => {
							unfollow().finally(() => {
								hide();
							});
						}),
					);
				}}
				label={t(`relationship.friends`, {
					ns: LOCALIZATION_NAMESPACE.GLOSSARY,
				})}
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
