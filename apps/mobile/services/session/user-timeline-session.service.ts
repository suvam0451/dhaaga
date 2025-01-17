import { ActivityPubClient, KNOWN_SOFTWARE } from '@dhaaga/bridge';
import { AppUserTimelineReducerDispatchType } from '../../states/interactors/user-timeline.reducer';

/**
 * User timeline wrapper to let you
 * view user details and show/manage
 * relationships easily
 */
export class UserTimelineSessionService {
	isValid: boolean;
	driver: KNOWN_SOFTWARE;
	client: ActivityPubClient;
	dispatch: AppUserTimelineReducerDispatchType;

	constructor(
		driver: KNOWN_SOFTWARE,
		client: ActivityPubClient,
		dispatch: AppUserTimelineReducerDispatchType,
	) {
		this.isValid = !!driver && !!client && !!dispatch;
		this.driver = driver;
		this.client = client;
		this.dispatch = dispatch;
	}
}
