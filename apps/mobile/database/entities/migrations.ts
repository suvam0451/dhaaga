import * as SQLite from 'expo-sqlite';
import { Result } from '../../utils/result';
import { APP_DB, ExpoSqliteColumnDefinition } from '../../types/db.types';

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
	): Result<Migration[]> {
		const db = SQLite.openDatabaseSync(APP_DB);
		try {
			const result = db.getAllSync<Migration>(
				`SELECT * FROM ${TABLE_NAME} ORDER BY userVersion DESC LIMIT ? OFFSET ?;`,
				opts.limit || 10,
				opts.offset || 0,
			);
			return { type: 'success', value: result };
		} catch (e) {
			console.log(e, e.message);
			return { type: 'error', error: e };
		}
	}
}
