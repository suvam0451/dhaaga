import { SQLiteDatabase } from 'expo-sqlite';
import { createTable, dropTable, migrator as orm } from '@dhaaga/orm';
import { DataSource } from './dataSource';

const APP_DB_TARGET_VERSION = 2;

type MigrationEntry = {
	version: number;
	versionCode: string;
	name: string;
	up: string[];
	down: string[];
};

/**
 * Version control for migrations
 *
 * A javascript can be used to generate the
 * raw migrations, which can then be run on
 * sites like "sqliteonline.com"
 *
 * NOTE: uses 1 based indexing
 */

export function trySchemaGenerator(db: DataSource) {}

const migrations: MigrationEntry[] = [
	{
		version: 1,
		versionCode: 'v0.11.0',
		name: 'account login support',
		up: [
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
				accountId: orm.int().fk('accounts'),
			}),
		],
		down: [
			dropTable('account'),
			dropTable('migrations'),
			dropTable('accountMetadata'),
		],
	},
	{
		version: 2,
		versionCode: 'v0.11.0',
		name: 'account profile and server caching support',
		up: [
			createTable('accountProfile', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				name: orm.text().notNull(),
				selected: orm.int().default(0),
				active: orm.int().default(1),
				accountId: orm.int().fk('accounts'),
			}),
			createTable('profileKnownServer', {
				id: orm.int().pk(),
				uuid: orm.text().notNull(),
				url: orm.text().notNull(),
				driver: orm.text().notNull(),
				profileId: orm.int().fk('accountProfile'),
			}),
			createTable('profileKnownServerMetadata', {
				id: orm.int().pk(),
				key: orm.text().notNull(),
				value: orm.text().notNull(),
				type: orm.text().notNull(),
				active: orm.int().default(1),
				knownServerId: orm.int().fk('profileKnownServer'),
			}),
		],
		down: [
			dropTable('profileKnownServerMetadata'),
			dropTable('profileKnownServer'),
			dropTable('accountProfile'),
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
