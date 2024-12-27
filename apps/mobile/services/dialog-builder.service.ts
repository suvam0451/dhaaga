import { AppDialogInstanceState } from '../states/_global';

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

	static remoteTimelinesNotAvailable(): AppDialogInstanceState {
		return {
			title: 'Not Supported',
			description: [
				'Accessing remote timelines as a guest is not supported yet.',
			],
			actions: [],
		};
	}
}
