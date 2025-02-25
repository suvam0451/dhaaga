import { ApiTargetInterface, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { UserTimelineDispatchType } from '@dhaaga/core';

/**
 * User timeline wrapper to let you
 * view user details and show/manage
 * relationships easily
 */
export class UserTimelineSessionService {
	isValid: boolean;
	driver: KNOWN_SOFTWARE;
	client: ApiTargetInterface;
	dispatch: UserTimelineDispatchType;

	constructor(
		driver: KNOWN_SOFTWARE,
		client: ApiTargetInterface,
		dispatch: UserTimelineDispatchType,
	) {
		this.isValid = !!driver && !!client && !!dispatch;
		this.driver = driver;
		this.client = client;
		this.dispatch = dispatch;
	}
}
