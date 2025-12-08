import { DbErrorHandler } from './_base.repo.js';
import { DataSource } from '../dataSource.js';
import { Account, Profile, ProfilePinnedUser } from '../_schema.js';
import { AccountService } from './account.js';
import { z } from 'zod';
import { RandomUtil } from '@dhaaga/bridge';
import type { UserObjectType } from '@dhaaga/bridge';
import { APP_PINNED_OBJECT_TYPE } from '../types/db.types.js';

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
class Repo {
	/**
	 *
	 */
	static addLocalPin(
		db: DataSource,
		profile: Profile,
		acct: Account,
		user: UserObjectType,
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
	static toggle(db: DataSource, pinnedUser: ProfilePinnedUser) {
		const match = db.profilePinnedUser.findOne({
			id: pinnedUser.id,
		});
		if (!match) return;
		db.profilePinnedUser.updateById(pinnedUser.id, {
			active: !match.active,
		});
		return db.profilePinnedUser.findOne({
			id: pinnedUser.id,
		});
	}

	static listByUserId(db: DataSource, server: string, userId: string) {
		return db.profilePinnedUser.find({
			server,
			identifier: userId,
			active: true,
		});
	}

	static findById(db: DataSource, id: number): ProfilePinnedUser | null {
		return db.profilePinnedUser.findOne({ id });
	}

	static getOwnerAccount(db: DataSource, profile: Profile): Account | null {
		return AccountService.getById(db, profile.accountId || -1);
	}

	static find(
		db: DataSource,
		profile: Profile,
		server: string,
		userId: string,
	): ProfilePinnedUser | null {
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
		user: UserObjectType,
	) {
		const duplicate = Service.find(db, profile, acct.server, user.id);
		if (duplicate) {
			if (!duplicate.active) {
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
		user: UserObjectType,
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
