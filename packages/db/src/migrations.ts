import { SQLiteDatabase } from 'expo-sqlite';
import {
	addColumn,
	createTable,
	dropTable,
	migrator as orm,
	removeColumn,
} from '@dhaaga/orm';

// ^0.16.0 --> >7
const APP_DB_TARGET_VERSION = 7;

/**
 * Version control for migrations
 *
 * A javascript can be used to generate the
 * raw migrations, which can then be run on
 * sites like "sqliteonline.com"
 *
 * NOTE: uses 1 based indexing
 */
const migrations: MigrationEntry[] = [
	{
		version: 1,
		versionCode: 'v0.11.0',
		name: 'account login support',
		up: [
			// performance for sqlite >3.7.0
			'PRAGMA journal_mode = WAL',
			'PRAGMA foreign_keys = ON',
			createTable('migrations', {
				id: orm.int().pk(),
				userVersion: orm.int().notNull(),
				versionCode: orm.text().notNull(),
				name: orm.text().notNull(),
			}),
			createTable('account', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				identifier: orm.text().notNull(),
				driver: orm.text().notNull(),
				server: orm.text().notNull(),
				username: orm.text().notNull(),
				avatarUrl: orm.text(),
				displayName: orm.text(),
				selected: orm.int().default(0),
				active: orm.int().default(1),
			}),
			createTable('accountMetadata', {
				id: orm.int().pk(),
				key: orm.text().notNull(),
				value: orm.text().notNull(),
				type: orm.text().notNull(),
				active: orm.int().default(1),
				accountId: orm.int().fk('account'),
			}),
		],
		down: [
			dropTable('accountMetadata'),
			dropTable('account'),
			dropTable('migrations'),
		],
	},
	{
		version: 2,
		versionCode: 'v0.11.0',
		name: 'account profile and server caching support',
		up: [
			createTable('profile', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				name: orm.text().notNull(),
				selected: orm.int().default(0),
				active: orm.int().default(1),
				accountId: orm.int().fk('account'),
			}),
			createTable('knownServer', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				server: orm.text().notNull(),
				driver: orm.text().notNull(),
				profileId: orm.int().fk('profile'),
			}),
			createTable('knownServerMetadata', {
				id: orm.int().pk(),
				key: orm.text().notNull(),
				value: orm.text().notNull(),
				type: orm.text().notNull(),
				active: orm.int().default(1),
				knownServerId: orm.int().fk('knownServer'),
			}),
		],
		down: [
			dropTable('knownServerMetadata'),
			dropTable('knownServer'),
			dropTable('profile'),
		],
	},
	{
		version: 3,
		versionCode: 'v0.11.0',
		name: 'homepage pinning for profiles',
		up: [
			createTable('profilePinnedTimeline', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				server: orm.text().notNull(),
				category: orm.text().notNull(),
				driver: orm.text().notNull(), // pin meta
				required: orm.int().default(0),
				show: orm.int().default(1),
				itemOrder: orm.int().default(1),
				page: orm.int().default(1),

				alias: orm.text(),

				minId: orm.text(),
				maxId: orm.text(),

				minIdNext: orm.text(),
				maxIdNext: orm.text(),

				minIdDraft: orm.text(),
				maxIdDraft: orm.text(),

				unseenCount: orm.int(),
				lastCommitMaxId: orm.text(),
				profileId: orm.int().fk('profile'),
				active: orm.int().default(1),
			}),
			createTable('profilePinnedUser', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				server: orm.text().notNull(),
				category: orm.text().notNull(),
				driver: orm.text().notNull(), // pin meta
				required: orm.int().default(0),
				show: orm.int().default(1),
				itemOrder: orm.int().default(1),
				page: orm.int().default(1),

				alias: orm.text(),

				minId: orm.text(),
				maxId: orm.text(),

				minIdNext: orm.text(),
				maxIdNext: orm.text(),

				minIdDraft: orm.text(),
				maxIdDraft: orm.text(),

				unseenCount: orm.int(),
				lastCommitMaxId: orm.text(),
				profileId: orm.int().fk('profile'),

				// extras
				identifier: orm.text().notNull(),
				username: orm.text().notNull(),
				avatarUrl: orm.text(),
				displayName: orm.text(),
				active: orm.int().default(1),
			}),
			createTable('profilePinnedTag', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				server: orm.text().notNull(),
				category: orm.text().notNull(),
				driver: orm.text().notNull(), // pin meta
				required: orm.int().default(0),
				show: orm.int().default(1),
				itemOrder: orm.int().default(1),
				page: orm.int().default(1),

				alias: orm.text(),

				minId: orm.text(),
				maxId: orm.text(),

				minIdNext: orm.text(),
				maxIdNext: orm.text(),

				minIdDraft: orm.text(),
				maxIdDraft: orm.text(),

				unseenCount: orm.int(),
				lastCommitMaxId: orm.text(),
				profileId: orm.int().fk('profile'),

				// extras
				identifier: orm.text().notNull(),
				name: orm.text().notNull(),
				active: orm.int().default(1),
			}),
		],
		down: [
			dropTable('profilePinnedTag'),
			dropTable('profilePinnedUser'),
			dropTable('profilePinnedTimeline'),
		],
	},
	{
		version: 4,
		versionCode: 'v0.12.0',
		name: 'settings and collections',
		up: [
			createTable('accountSavedUser', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				identifier: orm.text().notNull(),
				isRemote: orm.int().default(0),
				remoteServer: orm.text(),
				username: orm.text().notNull(),
				avatarUrl: orm.text(),
				displayName: orm.text(),
				active: orm.int().default(1), //fk
				accountId: orm.int().fk('account'),
			}),
			createTable('accountCollection', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				identifier: orm.text().notNull(),
				alias: orm.text(),
				itemOrder: orm.int().default(1),
				active: orm.int().default(1), //fk
				accountId: orm.int().fk('account'),
			}),
			createTable('accountSavedPost', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				identifier: orm.text().notNull(),
				textContent: orm.text(),
				authoredAt: orm.text().notNull(),
				spoilerText: orm.text(),
				remoteUrl: orm.text(),
				sensitive: orm.int().default(0),
				active: orm.int().default(1), //fk
				accountId: orm.int().fk('account'),
				savedUserId: orm.int().fk('accountSavedUser'),
			}),
			createTable('savedPostMediaAttachment', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				previewUrl: orm.text(),
				url: orm.text().notNull(),
				alt: orm.text(),
				height: orm.int(),
				width: orm.int(),
				mimeType: orm.text().notNull(),
				active: orm.int().default(1),
				savedPostId: orm.int().fk('accountSavedPost'),
			}),
			createTable('collectionSavedPost', {
				id: orm.int().pk(),
				savedPostId: orm.int().fk('accountSavedPost'),
				collectionId: orm.int().fk('accountCollection'),
				active: orm.int().default(1),
			}),
			createTable('appSetting', {
				id: orm.int().pk(),
				key: orm.text().notNull(),
				value: orm.text().notNull(),
				type: orm.text().notNull(),
			}),
			createTable('accountSetting', {
				id: orm.int().pk(),
				key: orm.text().notNull(),
				value: orm.text().notNull(),
				type: orm.text().notNull(),
			}),
			createTable('profileSetting', {
				id: orm.int().pk(),
				key: orm.text().notNull(),
				value: orm.text().notNull(),
				type: orm.text().notNull(),
			}),
		],
		down: [
			dropTable('profileSetting'),
			dropTable('accountSetting'),
			dropTable('appSetting'),
			dropTable('collectionSavedPost'),
			dropTable('savedPostMediaAttachment'),
			dropTable('accountSavedPost'),
			dropTable('accountCollection'),
			dropTable('accountSavedUser'),
		],
	},
	{
		version: 5,
		versionCode: 'v0.12.2',
		name: 'profile organisation',
		up: [
			addColumn('profile', 'visible', 'int', true, 1),
			addColumn('profile', 'itemOrder', 'int', true, 1),
		],
		down: [
			removeColumn('profile', 'itemOrder'),
			removeColumn('profile', 'visible'),
		],
	},
	{
		version: 6,
		versionCode: 'v0.15.0',
		name: 'tweak collections',
		up: [addColumn('accountCollection', 'desc', 'text')],
		down: [removeColumn('accountCollection', 'desc')],
	},
	{
		version: 7,
		versionCode: 'v0.16.0',
		name: 'bluesky feed support',
		up: [
			addColumn('profilePinnedTimeline', 'uri', 'text'),
			addColumn('profilePinnedTimeline', 'displayName', 'text'),
			addColumn('profilePinnedTimeline', 'avatarUrl', 'text'),
		],
		down: [
			removeColumn('profilePinnedTimeline', 'avatarUrl'),
			removeColumn('profilePinnedTimeline', 'displayName'),
			removeColumn('profilePinnedTimeline', 'uri'),
		],
	},
];

function getDbVersion(db: SQLiteDatabase): number | undefined {
	return db.getFirstSync<{ user_version: number }>(`
			PRAGMA user_version;
	`)?.user_version;
}

function bumpDbVersion(db: SQLiteDatabase, delta: number) {
	const dbVersion = getDbVersion(db);
	if (!dbVersion) return;

	db.runSync(`PRAGMA user_version = ${(dbVersion + delta).toString()};`);
	// for roll-forward migrations, write to the migrations table
	if (delta > 0) {
		const migration = migrations[dbVersion];
		if (!migration) return;

		db.runSync(
			`
			INSERT INTO migrations (userVersion, versionCode, name)
			VALUES (?, ?, ?);
		`,
			migration.version.toString(),
			migration.versionCode,
			migration.name,
		);
	}
	return dbVersion + delta;
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
	// --- 0
	// db.execSync(migrations[0].up);

	let dbVersion = getDbVersion(db) || -1;
	if (dbVersion === -1) return;

	console.log('db version', dbVersion, APP_DB_TARGET_VERSION);
	if (dbVersion === APP_DB_TARGET_VERSION) return;

	if (dbVersion > APP_DB_TARGET_VERSION) {
		// down migrations
		while (dbVersion > APP_DB_TARGET_VERSION) {
			for (const clause of migrations![dbVersion - 1]!.down) {
				db.execSync(clause);
			}
			dbVersion = bumpDbVersion(db, -1)!;
		}
	} else {
		// up migrations
		while (dbVersion < APP_DB_TARGET_VERSION) {
			if (migrations.length > dbVersion) {
				for (const clause of migrations[dbVersion]!.up) {
					db.execSync(clause);
				}
				dbVersion = bumpDbVersion(db, 1)!;
			}
		}
	}

	console.log('db migrations applied');
}

type MigrationEntry = {
	version: number;
	versionCode: string;
	name: string;
	up: string[];
	down: string[];
};
