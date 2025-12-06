import { DbErrorHandler } from './_base.repo.js';
import { SQLiteDatabase } from 'expo-sqlite';
import type { Hashtag } from '../_schema.js';

export type HashtagRecordType = {
	name: string;
};

@DbErrorHandler()
class Repo {
	static upsert(db: SQLiteDatabase, name: string): Hashtag | null {
		db.runSync(
			`insert into hashtag (name) values (?)
				on conflict(name) do nothing;
		`,
			name,
		);

		return db.getFirstSync<Hashtag>(
			`select * from hashtag where name = ?`,
			name,
		);
	}
}

class Service {
	static upsert(db: SQLiteDatabase, name: string): Hashtag | null {
		return Repo.upsert(db, name);
	}
}

export { Repo as HashtagRepo, Service as HashtagService };
