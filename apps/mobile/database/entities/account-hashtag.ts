import { DbErrorHandler } from './_base.repo';
import { SQLiteDatabase } from 'expo-sqlite';
import { Account, Hashtag } from '../_schema';

export type AccountHashtagRecordType = {
	name: string;
};

export type UpsertType = {
	name: string;
	private: boolean;
	followed: boolean;
};

@DbErrorHandler()
class Repo {
	static upsertTag(db: SQLiteDatabase, acctId: number, tagId: number) {}
}

class Service {
	static upsertTag(db: SQLiteDatabase, acct: Account, tag: Hashtag) {
		return Repo.upsertTag(db, acct.id, tag.id);
	}
}

export { Repo as AccountHashtagRepo, Service as AccountHashtagService };
