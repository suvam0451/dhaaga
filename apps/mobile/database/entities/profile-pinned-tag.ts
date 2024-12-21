import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Profile, ProfilePinnedTag, ProfilePinnedTimeline } from '../_schema';
import { ProfileService } from './profile';
import { RandomUtil } from '../../utils/random.utils';
import { APP_PINNED_OBJECT_TYPE } from '../../services/driver.service';

@DbErrorHandler()
export class Repo {}

export class Service {
	static getShownForProfile(
		db: DataSource,
		profile: Profile,
	): ProfilePinnedTag[] {
		if (!db || !profile) return [];
		try {
			const items = db.profilePinnedTag.find({
				profileId: profile.id,
				active: true,
				show: true,
			});
			return items.sort((a, b) => (a.itemOrder > b.itemOrder ? 1 : -1));
		} catch (e) {
			return [];
		}
	}
	/**
	 * Make sure that the essential tags are
	 * added for profile (if missing).
	 *
	 * Any added items will get floated to the top
	 * ^ Won't show a hidden item
	 */
	static upsertDefaultTags(db: DataSource, profile: Profile) {
		const acct = ProfileService.getOwnerAccount(db, profile);
		const recommendedTags = ['DhaagaApp', 'DhaagaUpdates', 'DhaagaDev'];
		const currentTags = db.profilePinnedTag.find({
			profileId: profile.id,
			active: true,
		});

		for (const tag of recommendedTags) {
			if (
				!currentTags.find((o) => o.name === tag && o.server === acct.server)
			) {
				db.profilePinnedTag.insert({
					uuid: RandomUtil.nanoId(),
					server: acct.server,
					category: APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_TAG,
					driver: acct.driver,
					required: true,
					show: true,
					itemOrder: 0,
					page: 1,
					unseenCount: 0,

					active: true,

					identifier: tag,
					name: tag,

					profileId: profile.id,
				});
			}
		}

		Service._fixItemOrder(db, profile);
	}

	private static _fixItemOrder(db: DataSource, profile: Profile) {
		/**
		 * A simple item order fix to ensure the indices
		 * are monotonically increasing
		 */
		try {
			let all = db.profilePinnedTag.find({
				profileId: profile.id,
				active: true,
			});

			all = all.sort((a, b) => a.id - b.id);
			let prev = -1;
			for (let i = 0; i < all.length; i++) {
				if (all[i].itemOrder <= prev) {
					db.profilePinnedTag.updateById(all[i].id, {
						itemOrder: prev + 1,
					});
					prev = prev + 1;
				}
			}
		} catch (e) {
			console.log(
				'[WARN]: failed to fix item ordering for profile tags',
				profile.id,
				e,
			);
		}
	}
}

export { Service as ProfilePinnedTagService, Repo as ProfilePinnedTagRepo };
