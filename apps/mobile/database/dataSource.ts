import {
	Account,
	AccountMetadata,
	AccountProfile,
	ProfileKnownServer,
	ProfileKnownServerMetadata,
} from './_schema';
import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Implementation inspired from TypeORM ^v0.3
 */
export class DataSource {
	db: SQLiteDatabase;
	account: Account;
	accountMetadata: AccountMetadata;
	accountProfile: AccountProfile;
	profileKnownServer: ProfileKnownServer;
	profileKnownServerMetadata: ProfileKnownServerMetadata;

	constructor(db: SQLiteDatabase) {
		this.db = db;
		this.account = new Account(db);
		this.accountMetadata = new AccountMetadata(db);
		this.accountProfile = new AccountProfile(db);
		this.profileKnownServer = new ProfileKnownServer(db);
		this.profileKnownServerMetadata = new ProfileKnownServerMetadata(db);
	}
}
