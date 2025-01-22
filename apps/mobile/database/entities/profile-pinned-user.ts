import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile, ProfilePinnedUser } from '../_schema';
import { AccountService } from './account';
import { z } from 'zod';
import { APP_PINNED_OBJECT_TYPE } from '../../services/driver.service';
import { RandomUtil } from '../../utils/random.utils';
import { AppUserObject } from '../../types/app-user.types';

const profileUserPinCreateSchema = z.object({
	server: z.string(),
	driver: z.string(),
	required: z.boolean(),
	category: z.enum([
		APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_LOCAL,
		APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_REMOTE,
	] as const),
	identifier: z.string(),
	username: z.string(),
	avatarUrl: z.string().optional().nullable(),
	displayName: z.string().nullable().optional(),
});

export type ProfileUserPinCreateType = z.infer<
	typeof profileUserPinCreateSchema
>;

@DbErrorHandler()
export class Repo {
	/**
	 *
	 */
	static addLocalPin(
		db: DataSource,
		profile: Profile,
		acct: Account,
		user: AppUserObject,
	) {
		const _uuid = RandomUtil.nanoId();
		db.profilePinnedUser.insert({
			uuid: RandomUtil.nanoId(),
			server: acct.server,
			category: APP_PINNED_OBJECT_TYPE.AP_PROTO_MICROBLOG_USER_LOCAL,
			driver: acct.driver,
			required: false,
			itemOrder: 0,
			page: 0, // optional
			avatarUrl: user.avatarUrl,
			displayName: user.displayName, // fk
			profileId: profile.id,
			identifier: user.id,
			username: user.handle,
		});

		return db.profilePinnedUser.findOne({
			uuid: _uuid,
		});
	}
}

export class Service {
	static findById(db: DataSource, id: number): ProfilePinnedUser {
		return db.profilePinnedUser.findOne({ id });
	}

	static getOwnerAccount(db: DataSource, profile: Profile): Account {
		return AccountService.getById(db, profile.accountId);
	}

	static find(
		db: DataSource,
		profile: Profile,
		server: string,
		userId: string,
	): ProfilePinnedUser {
		return db.profilePinnedUser.findOne({
			profileId: profile.id,
			server: server,
			identifier: userId,
		});
	}

	static setActive(db: DataSource, profile: ProfilePinnedUser) {
		db.profilePinnedUser.updateById(profile.id, { active: true });
	}

	static isPinnedForProfile(
		db: DataSource,
		profile: Profile,
		server: string,
		userId: string,
	) {
		const match = Service.find(db, profile, server, userId);
		return match && match?.active;
	}

	/**
	 *
	 * @param db
	 * @param profile
	 * @param acct
	 * @param user
	 */
	static addForProfile(
		db: DataSource,
		profile: Profile,
		acct: Account,
		user: AppUserObject,
	) {
		const duplicate = Service.find(db, profile, acct.server, user.id);
		if (duplicate) {
			if (duplicate.active === false) {
				Service.setActive(db, duplicate);
			}
			return duplicate;
		}

		// create if not exists
		return Repo.addLocalPin(db, profile, acct, user);
	}

	static getShownForProfile(
		db: DataSource,
		profile: Profile,
	): ProfilePinnedUser[] {
		if (!db || !profile) return [];
		try {
			const items = db.profilePinnedUser.find({
				profileId: profile.id,
				active: true,
				show: true,
			});
			return items.sort((a, b) => (a.itemOrder > b.itemOrder ? 1 : -1));
		} catch (e) {
			console.log(
				'[ERROR]: could not load pinned user items for profile',
				profile,
			);
			return [];
		}
	}

	/**
	 * Creates if not exists
	 */
	static toggleUserPin(
		db: DataSource,
		profile: Profile,
		acct: Account,
		user: AppUserObject,
	) {
		const matched = Service.find(db, profile, acct.server, user.id);

		if (matched) {
			db.profilePinnedUser.updateById(matched.id, {
				active: !matched.active,
				show: true,
			});
			return Service.find(db, profile, acct.server, user.id);
		}

		// create if not exists
		return Repo.addLocalPin(db, profile, acct, user);
	}
}

export { Service as ProfilePinnedUserService, Repo as ProfilePinnedUserRepo };
