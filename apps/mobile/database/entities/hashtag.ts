import { DbErrorHandler } from './_base.repo';
import { SQLiteDatabase } from 'expo-sqlite';
import { Result, withSuccess } from '../../utils/result';
import { Hashtag } from '../_schema';

export type HashtagRecordType = {
	name: string;
};

@DbErrorHandler()
class Repo {
	static upsert(db: SQLiteDatabase, name: string): Result<Hashtag> {
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
		return withSuccess(result);
	}
}

class Service {
	static upsert(db: SQLiteDatabase, name: string): Hashtag {
		const upsertResult = Repo.upsert(db, name);
		return upsertResult.type === 'success' ? upsertResult.value : null;
	}
}

export { Repo as HashtagRepo, Service as HashtagService };
