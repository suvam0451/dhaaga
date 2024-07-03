import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub/src';
import { Realm } from 'realm';
import { Account } from '../entities/account.entity';
import ActivityPubAdapterService from './activitypub-adapter.service';
import AccountRepository from '../repositories/account.repo';

class BookmarkBrowserService {
	static async updateBookmarkCache(
		primaryAcct: Account,
		client: ActivityPubClient,
		db: Realm,
		callback?: React.Dispatch<React.SetStateAction<number>>,
	) {
		let maxId = null;
		const done = false;
		let syncedCount = 0;
		do {
			const res = await client.getBookmarks({ limit: 20, maxId });
			const statusIs = ActivityPubAdapterService.adaptManyStatuses(
				res.data,
				primaryAcct.domain,
			);

			db.write(() => {
				for (const statusI of statusIs) {
					AccountRepository.upsertBookmark(
						db,
						primaryAcct,
						primaryAcct.bookmarks,
						{
							status: statusI,
							subdomain: primaryAcct.subdomain,
							domain: primaryAcct.domain,
						},
					);
				}
			});

			syncedCount += res.data.length;
			if (callback) {
				callback(syncedCount);
			}

			if (maxId === res.maxId || res.maxId === null) break;
			maxId = res.maxId;
		} while (!done);
	}

	static clearBookmarkCache(db: Realm, primaryAcct: Account) {
		db.write(() => {
			while (primaryAcct.bookmarks.length > 0) {
				primaryAcct.bookmarks.pop();
			}
			primaryAcct.bookmarksLastSyncedAt = null;
		});
	}
}

export default BookmarkBrowserService;
