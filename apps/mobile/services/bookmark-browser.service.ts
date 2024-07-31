import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import { Realm } from 'realm';
import { Account } from '../entities/account.entity';
import ActivityPubAdapterService from './activitypub-adapter.service';
import AccountRepository from '../repositories/account.repo';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

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
			const { data, error } = await client.bookmarks.get({ limit: 20, maxId });
			console.log(data.data.length, data.minId, data.maxId, error);
			let _data = data.data;
			if (primaryAcct.domain !== KNOWN_SOFTWARE.MASTODON) {
				_data = _data.map((o: any) => o.note);
			}

			/**
			 * data format is different
			 *
			 * createdAt
			 * id --> only useful for pagination
			 * note --> the actual post object
			 * noteId --> post id
			 */
			const statusIs = ActivityPubAdapterService.adaptManyStatuses(
				_data,
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

			syncedCount += _data.length;
			if (callback) {
				callback(syncedCount);
			}

			if (maxId === data.maxId || data.maxId === null) break;
			maxId = data.maxId;
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
