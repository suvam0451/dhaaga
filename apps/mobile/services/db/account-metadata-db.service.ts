import {
	Account,
	ACCOUNT_METADATA_KEY,
	AccountMetadataService,
	DataSource,
} from '@dhaaga/db';
import { AtpSessionData } from '@atproto/api';

class AccountMetadataDbService {
	static getAtProtoSession(
		db: DataSource,
		acct: Account,
	): AtpSessionData | null {
		const value = AccountMetadataService.getKeyValueForAccountSync(
			db,
			acct,
			ACCOUNT_METADATA_KEY.ATPROTO_SESSION,
		);
		if (!value) return null;
		return JSON.parse(value);
	}

	static getAtProtoLoginCredentials(db: DataSource, acct: Account) {
		const username = AccountMetadataService.getKeyValueForAccountSync(
			db,
			acct,
			ACCOUNT_METADATA_KEY.USER_IDENTIFIER,
		);
		const password = AccountMetadataService.getKeyValueForAccountSync(
			db,
			acct,
			ACCOUNT_METADATA_KEY.ATPROTO_APP_PASSWORD,
		);

		return { username, password };
	}

	static setAtProtoSession(
		db: DataSource,
		acct: Account,
		session: AtpSessionData,
	) {
		AccountMetadataService.upsert(db, acct, {
			key: ACCOUNT_METADATA_KEY.ATPROTO_SESSION,
			value: JSON.stringify(session),
			type: 'json',
		});
	}
}

export default AccountMetadataDbService;
