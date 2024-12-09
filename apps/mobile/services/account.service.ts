import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubTagRepository } from '../repositories/activitypub-tag.repo';
import { Account } from '../entities/account.entity';
import { MastoTag } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';
import { SQLiteDatabase } from 'expo-sqlite';

class AccountService {
	static loadFollowedTags(db: SQLiteDatabase, client: ActivityPubClient) {
		client.tags.followedTags({ limit: 200 }).then(({ data, error }) => {
			if (error) {
				console.log('[ERROR]: failed to fetch followed tags', error);
				return;
			}
			// db.write(() => {
			// 	ActivityPubTagRepository.clearFollowing(db);
			// 	ActivityPubTagRepository.applyFollowing(db, data.data as MastoTag[]);
			// });
		});
	}

	static updateBookmarkSyncStatus(db: SQLiteDatabase, acct: Account) {
		// db.write(() => {
		// 	acct.bookmarksLastSyncedAt = new Date();
		// });
	}

	static clearBookmarkSyncStatus(db: SQLiteDatabase, acct: Account) {
		// db.write(() => {
		// 	acct.bookmarksLastSyncedAt = null;
		// });
	}
}

export default AccountService;
