import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile } from '../_schema';
import { eq, gt } from '@dhaaga/orm';
import { AccountService } from './account';
import { ProfilePinnedTimelineService } from './profile-pinned-timeline';
import { ProfilePinnedTagService } from './profile-pinned-tag';
import { RandomUtil } from '../../utils/random.utils';

@DbErrorHandler()
class Repo {}

class Service {
	static getShownProfiles(db: DataSource) {
		return db.profile.find({ active: true });
	}

	static renameProfileById(
		db: DataSource,
		id: number | string,
		newName: string,
	) {
		const profile = Service.getById(db, id);
		if (profile) {
			db.profile.updateById(profile.id, {
				name: newName,
			});
		}
	}

	static isDefaultProfile(db: DataSource, profile: Profile) {
		return profile.uuid === 'DEFAULT';
	}

	static getById(db: DataSource, id: number | string) {
		try {
			return db.profile.findOne({
				id: typeof id === 'string' ? parseInt(id) : id,
			});
		} catch (e) {
			return null;
		}
	}

	static getForAccount(db: DataSource, acct: Account) {
		return db.profile.find({ active: true, accountId: acct.id });
	}

	static getAllShown(db: DataSource) {
		return db.profile.find({ active: true, visible: true });
	}

	static deselectAll(db: DataSource) {
		db.profile.update({ id: gt(0) as any }, { selected: false });
	}

	static hideProfile(db: DataSource, id: number) {
		db.profile.updateById(id, {
			visible: false,
		});
	}

	static unhideProfile(db: DataSource, id: number) {
		db.profile.updateById(id, {
			visible: true,
		});
	}

	static removeProfile(db: DataSource, id: number) {
		const match = db.profile.findOne({ id });
		//may never delete the default profile
		if (match && match.uuid === 'DEFAULT') return;
		db.profile.updateById(id, {
			active: false,
		});
	}

	static getDefaultProfile(db: DataSource, acct: Account) {
		const match = db.profile.findOne({
			accountId: acct.id,
			uuid: 'DEFAULT',
		});
		if (match) {
			Service._postSelect(db, match);
			return match;
		}
		return null;
	}

	static getActiveProfile(db: DataSource, acct: Account) {
		const found = db.profile.findOne({
			accountId: acct.id,
			selected: true,
		});
		if (!found) return Service.getDefaultProfile(db, acct);

		Service._postSelect(db, found);
		return found;
	}

	/**
	 * Makes sure the default profile is always populated
	 * @param db
	 * @param acct
	 */
	static setupDefaultProfile(db: DataSource, acct: Account) {
		let conflict = Service.getDefaultProfile(db, acct);
		if (!conflict) {
			db.profile.insert({
				accountId: acct.id,
				uuid: 'DEFAULT',
				name: 'Default',
				selected: true, // selected by default
			});
		}

		conflict = Service.getDefaultProfile(db, acct);

		Service._postInsert(db, conflict);
	}

	static selectDefaultProfile(db: DataSource, acct: Account) {
		const conflict = Service.getDefaultProfile(db, acct);
		db.profile.update({ id: eq(conflict.id) as any }, { selected: true });
	}

	static getOwnerAccount(db: DataSource, profile: Profile): Account {
		return AccountService.getById(db, profile.accountId);
	}

	/**
	 * Add a new profile for this account.
	 *
	 * name collisions are allowed
	 * @param db
	 * @param acct
	 * @param name
	 * @constructor
	 */
	static addProfile(db: DataSource, acct: Account, name: string) {
		const _key = RandomUtil.nanoId();
		db.profile.insert({
			accountId: acct.id,
			uuid: _key,
			name,
			selected: false,
		});

		const savedProfile = db.profile.findOne({
			uuid: _key,
		});

		Service._postInsert(db, savedProfile);
		return savedProfile;
	}

	/**
	 * Lifecycle Hooks
	 * @param db
	 * @param profile
	 */
	static _postInsert(db: DataSource, profile: Profile) {
		// upsert timeline items
		ProfilePinnedTimelineService.upsertDefaultTimelines(db, profile);
		ProfilePinnedTagService.upsertDefaultTags(db, profile);
	}

	static _postSelect(db: DataSource, profile: Profile) {
		// upsert timeline items
		ProfilePinnedTimelineService.upsertDefaultTimelines(db, profile);
		ProfilePinnedTagService.upsertDefaultTags(db, profile);
	}
}

export { Repo as ProfileRepo, Service as ProfileService };
