import {
	DataSource,
	Account,
	Profile,
	AccountService,
	ProfileService,
	ProfilePinnedUserService,
} from '@dhaaga/db';
import { ApiTargetInterface } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge';

/**
 *	Class to manage Non-Reactive state
 *
 * e.g. - fetching and storing remote data
 * e.g. - caching emojis
 */
class ProfileSessionManager {
	acct: Account;
	profile: Profile;
	// databases
	db: DataSource;
	// api clients
	client: ApiTargetInterface;

	constructor(db: DataSource) {
		this.db = db;

		this.acct = AccountService.getSelected(this.db);
		this.profile = ProfileService.getActiveProfile(this.db, this.acct);
	}

	/**
	 * Pins a user to the social hub
	 * @param server the server to resolve against. this
	 * should be the user's home server for the foreseeable future
	 * @param userObj copy of the deserialized user object
	 */
	async pinUser(server: string, userObj: UserObjectType) {
		ProfilePinnedUserService.addForProfile(
			this.db,
			this.profile,
			this.acct,
			userObj,
		);
	}
}

export default ProfileSessionManager;
