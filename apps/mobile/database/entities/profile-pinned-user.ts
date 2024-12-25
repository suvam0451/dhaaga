import { DbErrorHandler } from './_base.repo';
import { DataSource } from '../dataSource';
import { Account, Profile, ProfilePinnedUser } from '../_schema';
import { AccountService } from './account';
import { z } from 'zod';
import { APP_PINNED_OBJECT_TYPE } from '../../services/driver.service';
import { RandomUtil } from '../../utils/random.utils';

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
export class Repo {}

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
		return !!Service.find(db, profile, server, userId);
	}

	/**
	 *
	 * @param db
	 * @param profile
	 * @param homeServer is not always necessarily user's own server
	 * @param input
	 */
	static addForProfile(
		db: DataSource,
		profile: Profile,
		homeServer: string,
		input: ProfileUserPinCreateType,
	) {
		const { success, data, error } =
			profileUserPinCreateSchema.safeParse(input);
		if (!success) {
			console.log('[WARN]: invalid input for user pin creation', error);
			return null;
		}
		const duplicate = Service.find(db, profile, homeServer, data.identifier);
		console.log('duplicate', duplicate);
		if (duplicate) {
			if (duplicate.active === false) {
				Service.setActive(db, duplicate);
			}

			return duplicate;
		}

		db.profilePinnedUser.insert({
			uuid: RandomUtil.nanoId(),
			server: homeServer,
			category: data.category,
			driver: data.driver,
			required: data.required,
			itemOrder: 0,
			page: 0,
			// optional
			avatarUrl: data.avatarUrl,
			displayName: data.displayName, // fk
			profileId: profile.id,
			identifier: data.identifier,
			username: data.username,
		});
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
}

export { Service as ProfilePinnedUserService, Repo as ProfilePinnedUserRepo };
