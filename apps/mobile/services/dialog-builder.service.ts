import {
	AppDialogButtonAction,
	AppDialogInstanceState,
} from '../states/_global';
import { APP_POST_VISIBILITY } from '../hooks/app/useVisibility';
import { TFunction } from 'i18next';
import { LOCALIZATION_NAMESPACE } from '../types/app.types';

type ActionType = {
	label: string;
	onPress: () => void;
};

/**
 * This service function helps generate
 * dialog options
 *
 * NOTE: don't use async when passing callbacks
 * to any of these functions. it disables the
 * loader animation
 */
export class DialogBuilderService {
	/**
	 * Indicate to the user that their focused profile
	 * is a protected one
	 */
	static defaultProfileIndication(): AppDialogInstanceState {
		return {
			title: 'Default Profiles',
			description: [
				'This is a default profile for one of your accounts',
				'You may only hide or rename this profile.',
			],
			actions: [],
		};
	}

	static confirmProfileDeletion(
		onConfirm: () => Promise<void>,
	): AppDialogInstanceState {
		return {
			title: 'Confirm Deletion',
			description: [
				'This profile will be deleted',
				'You will lose all your pins created under this profile!',
			],
			actions: [
				{
					label: 'Confirm and Delete',
					onPress: onConfirm,
					variant: 'destructive',
				},
			],
		};
	}

	static profileActions(
		index: number,
		totalCount: number,
		hidden: boolean,
		actions: {
			onMoveUp: () => Promise<void>;
			onHide: () => Promise<void>;
			onUnhide: () => Promise<void>;
			onMoveDown: () => Promise<void>;
			onRemove: () => Promise<void>;
		},
	): AppDialogInstanceState {
		const _actions: AppDialogButtonAction[] = [];

		// if (index !== 0) {
		// 	_actions.push({
		// 		label: 'Move Up',
		// 		onPress: actions.onMoveUp,
		// 	});
		// }
		// if (index !== totalCount - 1) {
		// 	_actions.push({
		// 		label: 'Move Down',
		// 		onPress: actions.onMoveDown,
		// 	});
		// }
		if (hidden) {
			_actions.push({
				label: 'Unhide',
				onPress: actions.onUnhide,
			});
		} else {
			_actions.push({
				label: 'Hide',
				onPress: actions.onHide,
			});
		}

		return {
			title: 'Organise Profile',
			description: ['You can move, hide or remove this profile.'],
			actions: [
				..._actions,
				{
					label: 'Delete',
					onPress: actions.onRemove,
					variant: 'destructive',
				},
			],
		};
	}

	/**
	 * Currently unrelated
	 */
	static currentlyUnrelatedMoreActions(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		follow: any,
	): AppDialogInstanceState {
		return {
			title: t(`relationship.notRelated.title`),
			description: t(`relationship.notRelated.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`relationship.notRelated.followOption`),
					onPress: follow,
				},
			],
		};
	}

	static currentlySentRequestMoreActions(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		refreshStatus: any,
		cancelRequest: any,
	): AppDialogInstanceState {
		return {
			title: t(`relationship.requestPending.title`),
			description: t(`relationship.requestPending.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`relationship.requestPending.refreshOption`),
					onPress: refreshStatus,
				},
				{
					label: t(`relationship.requestPending.cancelOption`),
					onPress: cancelRequest,
					variant: 'destructive',
				},
			],
		};
	}

	/**
	 * Perform more actions when currently
	 * following, but not followed by a user
	 */
	static currentlyFollowingMoreActions(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		onUnfollow: any,
	): AppDialogInstanceState {
		return {
			title: t(`relationship.following.title`),
			description: t(`relationship.following.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`relationship.following.unfollowOption`),
					onPress: onUnfollow,
					variant: 'destructive',
				},
			],
		};
	}

	/**
	 * Perform more actions when currently
	 * following, but not followed by a user
	 */
	static currentlyFollowedMoreActions(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		onFollow: any,
	): AppDialogInstanceState {
		return {
			title: t(`relationship.follower.title`),
			description: t(`relationship.follower.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`relationship.follower.followBackOption`),
					onPress: onFollow,
					variant: 'default',
				},
			],
		};
	}

	/**
	 * Perform more actions when currently
	 * following each other
	 */
	static currentlyFriendsMoreActions(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		onUnfollow: any,
	): AppDialogInstanceState {
		return {
			title: t(`relationship.friends.title`),
			description: t(`relationship.friends.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`relationship.friends.unfollowOption`),
					onPress: onUnfollow,
					variant: 'destructive',
				},
			],
		};
	}

	/**
	 * ----- Social Hub -----
	 */
	static toSwitchActiveAccount(onPress: any): AppDialogInstanceState {
		return {
			title: 'Switch to Continue',
			description: [
				'This account is not active.',
				'Switch your currently selected account to proceed?',
			],
			actions: [
				{
					label: 'Switch & Continue',
					onPress: onPress,
				},
			],
		};
	}

	static remoteTimelinesNotAvailable(
		options: ActionType[],
	): AppDialogInstanceState {
		return {
			title: 'Not Supported',
			description: [
				'Accessing remote timelines as a guest is not supported yet.',
			],
			actions: [],
		};
	}

	static appAccountMoreActions(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		onSync: () => Promise<void>,
		onDeleteAttempt: () => Promise<void>,
	): AppDialogInstanceState {
		return {
			title: t(`account.moreActions.title`),
			description: t(`account.moreActions.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`account.moreActions.syncOption`),
					onPress: onSync,
				},
				{
					label: t(`account.moreActions.removeOption`),
					onPress: onDeleteAttempt,
					variant: 'destructive',
				},
			],
		};
	}

	/**
	 * Relevant to ActivityPub only
	 */
	static chooseWhomToPingInReply(numUsers: number) {
		return {
			title: 'Reply Control',
			description: [
				'Avoid pinging everyone.',
				'Select who should be notified of this reply.',
			],
			actions: [
				{
					label: 'Nobody',
					onPress: () => {},
					variant: 'default',
				},
				{
					label: `Everyone (${numUsers})`,
					onPress: () => {},
					variant: 'default',
				},
				{
					label: 'This User Only',
					onPress: () => {},
					variant: 'default',
				},
				{
					label: `Custom`,
					onPress: () => {},
					variant: 'default',
				},
			],
		};
	}

	static deleteAccountConfirm(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		onConfirmDelete: () => Promise<void>,
	): AppDialogInstanceState {
		return {
			title: t(`account.confirmDelete.title`),
			description: t(`account.confirmDelete.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`account.confirmDelete.confirmOption`),
					onPress: onConfirmDelete,
					variant: 'destructive',
				},
			],
		};
	}

	static changePostVisibility_ActivityPub(
		t: TFunction<LOCALIZATION_NAMESPACE.DIALOGS[], undefined>,
		fn: (visibility: APP_POST_VISIBILITY) => Promise<void>,
	) {
		return {
			title: t(`composer.setVisibility.title`),
			description: t(`composer.setVisibility.description`, {
				returnObjects: true,
			}) as string[],
			actions: [
				{
					label: t(`composer.setVisibility.publicLabel`),
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.PUBLIC);
					},
				},
				{
					label: t(`composer.setVisibility.unlistedLabel`),
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.UNLISTED);
					},
				},
				{
					label: t(`composer.setVisibility.followersOnlyLabel`),
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.PRIVATE);
					},
				},
				{
					label: t(`composer.setVisibility.directLabel`),
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.DIRECT);
					},
				},
			],
		};
	}
}
