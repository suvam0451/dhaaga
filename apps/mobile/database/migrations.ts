import { SQLiteDatabase } from 'expo-sqlite';
import { createTable, dropTable, migrator as orm } from '@dhaaga/orm';

const APP_DB_TARGET_VERSION = 3;

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
];

function getDbVersion(db: SQLiteDatabase): number {
	return db.getFirstSync<{ user_version: number }>(`
			PRAGMA user_version;
	`).user_version;
}

function bumpDbVersion(db: SQLiteDatabase, delta: number) {
	const dbVersion = getDbVersion(db);
	db.runSync(`PRAGMA user_version = ${(dbVersion + delta).toString()};`);
	// for roll-forward migrations, write to the migrations table
	if (delta > 0) {
		const migration = migrations[dbVersion];
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

	let dbVersion = getDbVersion(db);
	console.log('db version', dbVersion, APP_DB_TARGET_VERSION);
	if (dbVersion === APP_DB_TARGET_VERSION) return;

	if (dbVersion > APP_DB_TARGET_VERSION) {
		// down migrations
		while (dbVersion > APP_DB_TARGET_VERSION) {
			for (const clause of migrations[dbVersion - 1].down) {
				db.execSync(clause);
			}
			dbVersion = bumpDbVersion(db, -1);
		}
	} else {
		// up migrations
		while (dbVersion < APP_DB_TARGET_VERSION) {
			if (migrations.length > dbVersion) {
				for (const clause of migrations[dbVersion].up) {
					db.execSync(clause);
				}
				dbVersion = bumpDbVersion(db, 1);
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
