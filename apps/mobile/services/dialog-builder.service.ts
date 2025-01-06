import { AppDialogInstanceState } from '../states/_global';
import { APP_POST_VISIBILITY } from '../hooks/app/useVisibility';

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
	static profileActions(
		index: number,
		totalCount: number,
		hidden: boolean,
		actions: {
			onMoveUp: () => void;
			onHide: () => void;
			onUnhide: () => void;
			onMoveDown: () => void;
			onRemove: () => void;
		},
	): AppDialogInstanceState {
		const _actions = [];

		if (index !== 0) {
			_actions.push({
				label: 'Move Up',
				onPress: actions.onMoveUp,
			});
		}
		if (index !== totalCount - 1) {
			_actions.push({
				label: 'Move Down',
				onPress: actions.onMoveDown,
			});
		}
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
	static currentlyUnrelatedMoreActions(follow: any): AppDialogInstanceState {
		return {
			title: 'Following',
			description: ['You are currently unrelated to this user.'],
			actions: [
				{
					label: 'Follow',
					onPress: follow,
				},
			],
		};
	}

	static currentlySentRequestMoreActions(
		refreshStatus: any,
		cancelRequest: any,
	): AppDialogInstanceState {
		return {
			title: 'Request Pending',
			description: [
				'You have sent this user a follow request.',
				'But, it seems to not have been accepted yet.',
				'You can try to refresh the status or wait.',
			],
			actions: [
				{
					label: 'Refresh',
					onPress: refreshStatus,
				},
				{
					label: 'Cancel',
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
		onUnfollow: any,
	): AppDialogInstanceState {
		return {
			title: 'Following',
			description: ['You currently follow this user.'],
			actions: [
				{
					label: 'Unfollow',
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
		onSync: () => Promise<void>,
		onDeleteAttempt: () => Promise<void>,
	): AppDialogInstanceState {
		return {
			title: 'Account Actions',
			description: [
				'Sync your profile data (pfp, name etc.) or remove your account.',
			],
			actions: [
				{
					label: 'Sync (🚧)',
					onPress: onSync,
				},
				{
					label: 'Remove Account',
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
			title: 'Ping Controls',
			description: [
				'Select who is relevant to this reply. Avoid pinging everyone.',
				'Choosing \"Nobody\" will remove mention texts, but still' +
					' ping the user you are replying to.',
			],
			actions: [
				{
					label: 'This User Only',
					onPress: () => {},
					variant: 'default',
				},
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
			],
		};
	}

	static deleteAccountConfirm(
		onConfirmDelete: () => Promise<void>,
	): AppDialogInstanceState {
		return {
			title: 'Confirm Deletion',
			description: [
				'Deleting your account removes all hub profiles, collections and browsing data',
				'Confirm and Continue?',
			],
			actions: [
				{
					label: 'Confirm & Delete',
					onPress: onConfirmDelete,
					variant: 'destructive',
				},
			],
		};
	}

	static changePostVisibility_ActivityPub(
		fn: (visibility: APP_POST_VISIBILITY) => Promise<void>,
	) {
		return {
			title: 'Set Visibility',
			description: [
				'Your \"Unlisted\" posts will be hidden from feeds and search.',
				'Your \"Direct\" messages are not encrypted.',
			],
			actions: [
				{
					label: 'Public',
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.PUBLIC);
					},
				},
				{
					label: 'Unlisted',
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.UNLISTED);
					},
				},
				{
					label: 'Followers',
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.PRIVATE);
					},
				},
				{
					label: 'Direct',
					onPress: async () => {
						fn.call(null, APP_POST_VISIBILITY.DIRECT);
					},
				},
			],
		};
	}
}
