import { Agent } from '@atproto/api';
import { DataSource } from '@dhaaga/db';
import { AtProtoAuthService } from '@dhaaga/bridge';
import AccountDbService from '../db/account-db.service';

/**
 * Helps manage session
 * for an atproto based account
 */
class AtprotoSessionService {
	/**
	 * Attempt to log in using
	 * submitted credentials
	 * @param db
	 * @param username
	 * @param appPassword
	 * @param service
	 */
	static async login(
		db: DataSource,
		username: string,
		appPassword: string,
		service: string = 'https://bsky.social',
	) {
		if (!username || !appPassword)
			return { success: false, reason: 'E_Empty_Username_Or_Password' };

		const result = await AtProtoAuthService.loginWithPassword(
			username,
			appPassword,
			service,
		);
		if (!result) return;
		const { sessionData, session } = result;

		try {
			const agent = new Agent(session);
			const res = await agent.getProfile({ actor: sessionData.did });

			AccountDbService.upsertAccountCredentials_AtProto(
				db,
				appPassword,
				sessionData,
				res,
			);

			return { success: true };
		} catch (e) {
			console.log(e);
			return { success: false };
		}
	}
}

export default AtprotoSessionService;
