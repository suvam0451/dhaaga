import {
	Account,
	AccountMetadata,
	Profile,
	KnownServer,
	KnownServerMetadata,
} from './_schema';
import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Implementation inspired from TypeORM ^v0.3
 */
export class DataSource {
	db: SQLiteDatabase;
	account: Account;
	accountMetadata: AccountMetadata;
	accountProfile: Profile;
	knownServer: KnownServer;
	profileKnownServerMetadata: KnownServerMetadata;

	constructor(db: SQLiteDatabase) {
		this.db = db;
		this.account = new Account(db);
		this.accountMetadata = new AccountMetadata(db);
		this.accountProfile = new Profile(db);
		this.knownServer = new KnownServer(db);
		this.profileKnownServerMetadata = new KnownServerMetadata(db);
	}
}
