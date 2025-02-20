import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile, ProfilePinnedTag } from '../_schema';
import { ProfileService } from './profile';
import { RandomUtil } from '@dhaaga/core';
import { APP_PINNED_OBJECT_TYPE } from '../types/db.types';

@DbErrorHandler()
class Repo {}

class Service {
	static listByName(db: DataSource, name: string) {
		return db.profilePinnedTag.find({
			name: name,
			active: true,
		});
	}

	static delete(db: DataSource, id: number) {
		const match = Service.findById(db, id);
		if (match) db.profilePinnedTag.updateById(id, { active: false });
	}
	static add(db: DataSource, acct: Account, profile: Profile, name: string) {
		if (!name) return;
		const _uuid = RandomUtil.nanoId();
		db.profilePinnedTag.insert({
			uuid: _uuid,
			server: acct.server,
			category: APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_TAG_LOCAL,
			driver: acct.driver,
			required: true,
			show: true,
			itemOrder: 0,
			page: 1,
			unseenCount: 0,

			active: true,

			identifier: name,
			name: name,

			profileId: profile.id,
		});
		return db.profilePinnedTag.findOne({ uuid: _uuid });
	}

	static renameById(
		db: DataSource,
		id: number,
		name: string,
	): ProfilePinnedTag | null {
		const match = Service.findById(db, id);
		if (!match) return null;
		db.profilePinnedTag.updateById(match.id, {
			alias: name,
			name: name,
		});
		return Service.findById(db, id);
	}

	static findById(db: DataSource, id: number): ProfilePinnedTag | null {
		return db.profilePinnedTag.findOne({ id });
	}

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
		if (!acct) return;

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
					category: APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_TAG_LOCAL,
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
				if (all[i]!.itemOrder <= prev) {
					db.profilePinnedTag.updateById(all[i]!.id, {
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
