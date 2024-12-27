import { AppDialogInstanceState } from '../states/_global';

/**
 * This service function helps generate
 * dialog options
 */
export class DialogBuilderService {
	/**
	 * ----- Social Hub -----
	 */
	static toSwitchActiveAccount(): AppDialogInstanceState {
		return null;
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
