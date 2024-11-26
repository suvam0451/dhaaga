import { Server } from '../_schema';
import { DbErrorHandler } from './_base.repo';
import { SQLiteDatabase } from 'expo-sqlite';
import { withSuccess } from '../../utils/result';

export type ServerRecordType = {
	description: string;
	driver: string;
	url: string;
};

@DbErrorHandler()
export class Repo {
	static async getByUrl(db: SQLiteDatabase, url: string) {
		const match = await db.getFirstAsync<Server>(
			`select * from server where url = ?;`,
			url,
		);
		return withSuccess(match);
	}

	static async upsert(db: SQLiteDatabase, input: ServerRecordType) {
		await db.runAsync(
			`insert into server (url, driver, description) values (?, ?, ?)`,
			input.url,
			input.driver,
			input.description || 'N/A',
		);
	}
}

export class Service {
	static async upsert(db: SQLiteDatabase, input: ServerRecordType) {
		return Repo.upsert(db, input);
	}
}

export { Repo as ServerRepo, Service as ServerService };
