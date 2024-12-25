import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile, ProfilePinnedTimeline } from '../_schema';
import { AccountService } from './account';
import { ProfileService } from './profile';
import DriverService from '../../services/driver.service';
import { RandomUtil } from '../../utils/random.utils';

@DbErrorHandler()
export class Repo {}

export class Service {
	static findById(db: DataSource, id: number): ProfilePinnedTimeline {
		return db.profilePinnedTimeline.findOne({ id });
	}

	static getShownForProfile(db: DataSource, profile: Profile) {
		if (!db || !profile) return [];
		try {
			const items = db.profilePinnedTimeline.find({
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
	 * Add a pin at end
	 */
	static appendPin(
		db: DataSource,
		profile: Profile,
		pin: string,
		sticky = false,
	) {}

	/**
	 * A simple item order fix to ensure the indices
	 * are monotonically increasing
	 */
	private static _fixItemOrder(db: DataSource, profile: Profile) {
		try {
			let all = db.profilePinnedTimeline.find({
				profileId: profile.id,
				active: true,
			});

			all = all.sort((a, b) => a.id - b.id);
			let prev = -1;
			for (let i = 0; i < all.length; i++) {
				if (all[i].itemOrder <= prev) {
					db.profilePinnedTimeline.updateById(all[i].id, {
						itemOrder: prev + 1,
					});
					prev = prev + 1;
				}
			}
		} catch (e) {
			console.log(
				'[WARN]: failed to fix item ordering for profile timelines',
				profile.id,
				e,
			);
		}
	}
	/**
	 * Make sure that the essential tags are
	 * added for profile (if missing).
	 *
	 * Also calls the function to fix item
	 * ordering
	 *
	 * Any added items will get floated to the top
	 * ^ Won't show a hidden item
	 */
	static upsertDefaultTimelines(db: DataSource, profile: Profile) {
		const acct = ProfileService.getOwnerAccount(db, profile);
		const recommendedPins = DriverService.getTimelinePins(acct.driver);
		const currentPins = db.profilePinnedTimeline.find({
			profileId: profile.id,
			active: true,
		});

		for (const pin of recommendedPins) {
			if (
				!currentPins.find((o) => o.category === pin && o.server === acct.server)
			) {
				db.profilePinnedTimeline.insert({
					uuid: RandomUtil.nanoId(),
					server: acct.server,
					category: pin,
					driver: acct.driver,
					required: true,
					show: true,
					itemOrder: 0,
					page: 1,
					unseenCount: 0,
					profileId: profile.id,
					active: true,
				});
			}
		}

		Service._fixItemOrder(db, profile);
	}

	static getOwnerAccount(db: DataSource, profile: Profile): Account {
		return AccountService.getById(db, profile.accountId);
	}
}

export {
	Service as ProfilePinnedTimelineService,
	Repo as ProfilePinnedTimelineRepo,
};
