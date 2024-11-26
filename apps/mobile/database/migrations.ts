import {
	DB_COLUMN_CREATED_AT,
	DB_COLUMN_ID,
	DB_COLUMN_UPDATED_AT,
} from './repositories/_var';
import { SQLiteDatabase } from 'expo-sqlite';

const APP_DB_TARGET_VERSION = 2;

type MigrationEntry = {
	version: number;
	versionCode: string;
	name: string;
	up: string;
	down: string;
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
const migrations: MigrationEntry[] = [
	// {
	// 	version: 0,
	// 	name: 'store db version in settings table',
	// 	up: `
	// 	create table if not exists setting (
	// 		${DB_COLUMN_ID},
	// 		key text not null,
	// 		value text not null,
	// 		type text not null,
	// 		${DB_COLUMN_CREATED_AT},
	// 		${DB_COLUMN_UPDATED_AT}
	// 	) strict;
	// 	INSERT INTO setting (key, value, type)
	// 		VALUES ('dbVersion', "0", "integer")
	// 		ON CONFLICT(key) DO NOTHING;
	// `,
	// 	down: `
	// 	drop table if exists setting;
	// 	`,
	// },
	{
		version: 1,
		versionCode: 'v0.11.0',
		name: 'add account support',
		up: `
		create table if not exists migrations (
			${DB_COLUMN_ID},
			userVersion integer UNIQUE ON CONFLICT REPLACE,
			versionCode text not null,
			name text not null
		) strict;
		create table if not exists account (
			${DB_COLUMN_ID},
			identifier text not null,
			driver text not null,
			server text not null,
			username text not null,
			avatarUrl text,
			displayName text,
			selected INTEGER DEFAULT 0,
			${DB_COLUMN_CREATED_AT},
			${DB_COLUMN_UPDATED_AT}
		) strict;
		`,
		down: `
			drop table if exists account;
			drop table if exists migrations;
		`,
	},
	{
		version: 2,
		versionCode: 'v0.11.0',
		name: `add account metadata table`,
		up: `
			create table if not exists accountMetadata (
				${DB_COLUMN_ID},	
				key text not null,
				value text not null,
				type text not null,
				accountId integer not null,
				${DB_COLUMN_CREATED_AT},
				${DB_COLUMN_UPDATED_AT},
				FOREIGN KEY (accountId) REFERENCES accounts (id) ON DELETE cascade,
				UNIQUE(accountId, key)
			) strict;
		`,
		down: `
			drop table if exists accountMetadata;
		`,
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
			db.execSync(migrations[dbVersion - 1].down);
			dbVersion = bumpDbVersion(db, -1);
		}
	} else {
		// up migrations
		while (dbVersion < APP_DB_TARGET_VERSION) {
			if (migrations.length > dbVersion) {
				db.execSync(migrations[dbVersion].up);
				dbVersion = bumpDbVersion(db, 1);
			}
		}
	}

	console.log('db migrations applied');
}
