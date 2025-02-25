import { SQLiteDatabase } from 'expo-sqlite';

/**
 * Utility functions to inspect the
 * database state
 */
export class ExpoSqliteInspectorService {
	static dbTableList(db: SQLiteDatabase) {
		return db.getAllSync(
			`SELECT name FROM sqlite_master WHERE type=\'table\';`,
		);
	}

	static getColumnList(db: SQLiteDatabase, tableName: string) {
		return db.getAllSync(`PRAGMA table_info(${tableName});`);
	}

	static foreignKeyList(db: SQLiteDatabase, tableName: string) {
		return db.getAllSync(`PRAGMA foreign_key_list(${tableName});`);
	}
}
