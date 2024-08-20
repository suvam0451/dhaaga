import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import { Realm } from 'realm';
import { Account } from '../entities/account.entity';
import ActivityPubAdapterService from './activitypub-adapter.service';
import AccountRepository from '../repositories/account.repo';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

class BookmarkBrowserService {
	/**
	 * Sync the account's bookmarks,
	 * updating the progress for every
	 * batch processed
	 * @param primaryAcct
	 * @param client
	 * @param db
	 * @param callback to update the numerator
	 */
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
			const { data, error } = await client.bookmarks.get({ limit: 40, maxId });

			/**
			 * data format is different
			 *
			 * createdAt
			 * id --> only useful for pagination
			 * note --> the actual post object
			 * noteId --> post id
			 */
			let _data = data.data;
			if (
				![
					KNOWN_SOFTWARE.MASTODON,
					KNOWN_SOFTWARE.PLEROMA,
					KNOWN_SOFTWARE.AKKOMA,
				].includes(primaryAcct.domain as any)
			) {
				_data = _data.map((o: any) => o.note);
			}

			const statusIs = ActivityPubAdapterService.adaptManyStatuses(
				_data,
				primaryAcct.domain,
			);

			db.write(() => {
				for (const statusI of statusIs) {
					try {
						AccountRepository.upsertBookmark(db, primaryAcct, {
							status: statusI,
							subdomain: primaryAcct.subdomain,
							domain: primaryAcct.domain,
						});
					} catch (e) {
						console.log('[ERROR]: upserting bookmark', e, statusI.getId());
						// console.log('[ERROR]: upserting bookmark', e, statusI);
					}
				}
			});

			syncedCount += _data.length;
			if (callback) {
				callback(syncedCount);
			}
			/**
			 * Abort (to avoid rate limits)
			 *
			 * After ~8000 bookmarks
			 */
			if (syncedCount > 8000) break;

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
