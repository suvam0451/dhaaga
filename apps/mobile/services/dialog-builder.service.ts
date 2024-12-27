import { AppDialogInstanceState } from '../states/_global';

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
}
