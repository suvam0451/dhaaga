import { DbErrorHandler } from './_base.repo.js';
import { SQLiteDatabase } from 'expo-sqlite';
import type { Hashtag } from '../_schema.js';
import { DbErrorCode, type DbResult, Err, Ok } from '../utils/db-result.js';

export type HashtagRecordType = {
	name: string;
};

@DbErrorHandler()
class Repo {
	static upsert(db: SQLiteDatabase, name: string): DbResult<Hashtag> {
		db.runSync(
			`insert into hashtag (name) values (?)
				on conflict(name) do nothing;
		`,
			name,
		);

		const result = db.getFirstSync<Hashtag>(
			`select * from hashtag where name = ?`,
			name,
		);
		return result ? Ok(result) : Err(DbErrorCode.WRITE_FAILED);
	}
}

class Service {
	static upsert(db: SQLiteDatabase, name: string): DbResult<Hashtag> {
		return Repo.upsert(db, name);
	}
}

export { Repo as HashtagRepo, Service as HashtagService };
