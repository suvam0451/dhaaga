import type { AtpSessionData } from '@atproto/api';
import {
	Account,
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
	AccountService,
	DataSource,
	ProfileService,
} from '@dhaaga/db';
import {
	ApiTargetInterface,
	DriverService,
	KNOWN_SOFTWARE,
	UserParser,
} from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge/typings';
import { AtProtoAuthService } from '@dhaaga/bridge/auth';
import AccountMetadataDbService from '#/services/db/account-metadata-db.service';

export class AppSessionService {
	/**
	 * load the app session for a given account
	 * record on the database
	 * @param db
	 */
	static async restoreAppSession(db: DataSource): Promise<{
		acct: Account;
		router: ApiTargetInterface;
		me: UserObjectType;
	}> {
		const acct = AccountService.getSelected(db);
		ProfileService.getActiveProfile(db, acct);

		let payload:
			| { instance: string; token: string }
			| (AtpSessionData & { subdomain: string; pdsUrl: string })
			| null = null;

		// Bluesky is built different
		if (acct.driver === KNOWN_SOFTWARE.BLUESKY) {
			let session = AccountMetadataDbService.getAtProtoSession(db, acct);
			if (!session) {
				console.log('[WARN]: no session found for account', acct);
				throw new Error(
					`no session found for account ${acct.username}@${acct.server}`,
				);
			}

			const resumeResult = await AtProtoAuthService.resumeSession(session);
			if (resumeResult === null)
				throw new Error('failed to resume atproto session!');

			const _sess: AtpSessionData = resumeResult.nextSession;
			const _pdsUrl = resumeResult.pdsUrl;

			// save the updated session object
			AccountMetadataDbService.setAtProtoSession(db, acct, _sess);

			payload = {
				..._sess,
				subdomain: acct.server,
				pdsUrl: _pdsUrl,
			};
		} else {
			const token = AccountMetadataService.getKeyValueForAccountSync(
				db,
				acct,
				ACCOUNT_METADATA_KEY.ACCESS_TOKEN,
			);

			payload = {
				instance: acct.server,
				token: token!,
			};
		}
		const client = DriverService.generateApiClient(acct.driver, acct.server, {
			...payload,
			clientId: acct.id,
		});
		const { data } = await client.me.getMe();
		const obj: UserObjectType = UserParser.parse(
			data,
			acct.driver,
			acct.server,
		);
		return { acct: acct, router: client, me: obj };
	}
}
