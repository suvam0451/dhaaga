import {
	Account,
	AccountMetadata,
	Profile,
	KnownServer,
	KnownServerMetadata,
	ProfilePinnedTimeline,
	ProfilePinnedTag,
	ProfilePinnedUser,
	AccountSavedUser,
	AccountCollection,
	AccountSavedPost,
	SavedPostMediaAttachment,
	CollectionSavedPost,
	AppSetting,
	AccountSetting,
	ProfileSetting,
} from './_schema.js';
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
	accountSavedUser: AccountSavedUser;
	accountCollection: AccountCollection;
	accountSavedPost: AccountSavedPost;
	savedPostMediaAttachment: SavedPostMediaAttachment;
	collectionSavedPost: CollectionSavedPost;
	appSetting: AppSetting;
	accountSetting: AccountSetting;
	profileSetting: ProfileSetting;

	constructor(db: SQLiteDatabase) {
		this.db = db;
		this.account = new Account(db);
		this.accountMetadata = new AccountMetadata(db);
		this.accountSavedUser = new AccountSavedUser(db);
		this.accountCollection = new AccountCollection(db);
		this.accountSavedPost = new AccountSavedPost(db);
		this.savedPostMediaAttachment = new SavedPostMediaAttachment(db);
		this.collectionSavedPost = new CollectionSavedPost(db);

		this.appSetting = new AppSetting(db);
		this.accountSetting = new AccountSetting(db);
		this.profileSetting = new ProfileSetting(db);

		this.profile = new Profile(db);
		this.profilePinnedTimeline = new ProfilePinnedTimeline(db);
		this.profilePinnedUser = new ProfilePinnedUser(db);
		this.profilePinnedTag = new ProfilePinnedTag(db);

		this.knownServer = new KnownServer(db);
		this.knownServerMetadata = new KnownServerMetadata(db);
	}
}
