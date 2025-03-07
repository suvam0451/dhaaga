import * as SQLite from 'expo-sqlite';
import { DbErrorCode, type DbResult, Err, Ok } from '../utils/db-result';

type ExpoSqliteColumnDefinition = {
	cid: number;
	name: string;
	notnull: boolean;
	pk: boolean;
	type: 'INTEGER' | 'TEXT';
	dflt_value: null;
};
const APP_DB = 'app.db';

type Migration = {
	id: number;
	userVersion: number; // unique
	versionCode: string;
	name: string;
};

const TABLE_NAME = 'migrations';

type SqlListOptions = {
	limit?: number;
	offset?: number;
};

export class MigrationRepo {
	static describe() {
		const db = SQLite.openDatabaseSync(APP_DB);
		const result = db.getAllSync<ExpoSqliteColumnDefinition>(
			`PRAGMA table_info(${TABLE_NAME});`,
		);
	}

	static list(
		opts: SqlListOptions = { limit: 10, offset: 0 },
	): DbResult<Migration[]> {
		const db = SQLite.openDatabaseSync(APP_DB);
		try {
			const result = db.getAllSync<Migration>(
				`SELECT * FROM ${TABLE_NAME} ORDER BY userVersion DESC LIMIT ? OFFSET ?;`,
				opts.limit || 10,
				opts.offset || 0,
			);
			return Ok(result);
		} catch (e) {
			return Err(DbErrorCode.UNKNOWN);
		}
	}
}
