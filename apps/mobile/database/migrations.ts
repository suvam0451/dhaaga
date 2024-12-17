import {
	DB_COLUMN_CREATED_AT,
	DB_COLUMN_ID,
	DB_COLUMN_UPDATED_AT,
} from './repositories/_var';
import { SQLiteDatabase } from 'expo-sqlite';
import { createTable, dropTable, migrator as orm } from './_migrator';
import { DataSource } from './dataSource';

const APP_DB_TARGET_VERSION = 1;

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

export function trySchemaGenerator(db: DataSource) {
	const accts = db.account.find();
	console.log(accts);
}

const migrations: MigrationEntry[] = [
	{
		version: 1,
		versionCode: 'v0.11.0',
		name: 'add account support',
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
			}),
		],
		down: [dropTable('account'), dropTable('migrations')],
	},
	{
		version: 2,
		versionCode: 'v0.11.0',
		name: `add account metadata table`,
		up: [
			`
			create table if not exists accountMetadata (
				${DB_COLUMN_ID},	
				key text not null,
				value text not null,
				type text not null,
				accountId integer,
				${DB_COLUMN_CREATED_AT},
				${DB_COLUMN_UPDATED_AT},
				FOREIGN KEY (accountId) REFERENCES accounts (id) ON DELETE cascade,
				UNIQUE(accountId, key)
			) strict;
		`,
		],
		down: [dropTable('accountMetadata')],
	},
	{
		version: 3,
		versionCode: 'v0.11.0',
		name: 'add account hashtags',
		up: [
			`
			create table if not exists hashtag (
				${DB_COLUMN_ID},	
				name text not null unique
			) strict;
			create table if not exists accountHashtag (
				${DB_COLUMN_ID},	
				followed text not null,
				private integer not null,
				accountId integer,
				hashtagId integer,
				${DB_COLUMN_CREATED_AT},
				${DB_COLUMN_UPDATED_AT},
				FOREIGN KEY (accountId) REFERENCES accounts (id) ON DELETE cascade,
				FOREIGN KEY (hashtagId) REFERENCES hashtag (id) ON DELETE cascade
			) strict;
		`,
		],
		down: [dropTable('accountHashtag'), dropTable('hashtag')],
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
