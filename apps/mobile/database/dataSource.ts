import {
	Account,
	AccountMetadata,
	Profile,
	KnownServer,
	KnownServerMetadata,
	ProfilePinnedTimeline,
	ProfilePinnedTag,
	ProfilePinnedUser,
} from './_schema';
import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Implementation inspired from TypeORM ^v0.3
 */
export class DataSource {
	db: SQLiteDatabase;
	account: Account;
	accountMetadata: AccountMetadata;
	profile: Profile;
	profilePinnedTimeline: ProfilePinnedTimeline;
	profilePinnedUser: ProfilePinnedUser;
	profilePinnedTag: ProfilePinnedTag;
	knownServer: KnownServer;
	knownServerMetadata: KnownServerMetadata;

	constructor(db: SQLiteDatabase) {
		this.db = db;
		this.account = new Account(db);
		this.accountMetadata = new AccountMetadata(db);

		this.profile = new Profile(db);
		this.profilePinnedTimeline = new ProfilePinnedTimeline(db);
		this.profilePinnedUser = new ProfilePinnedUser(db);
		this.profilePinnedTag = new ProfilePinnedTag(db);

		this.knownServer = new KnownServer(db);
		this.knownServerMetadata = new KnownServerMetadata(db);
	}
}
