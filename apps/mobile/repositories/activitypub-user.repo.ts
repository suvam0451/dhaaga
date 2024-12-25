import { ActivityPubUser } from '../entities/activitypub-user.entity';
import { ActivityPubServerRepository } from './activitypub-server.repo';
import { UserInterface } from '@dhaaga/shared-abstraction-activitypub';
import { SQLiteDatabase } from 'expo-sqlite';

export class ActivityPubUserRepository {
	static clearAll(db: SQLiteDatabase) {
		// db.delete(db.objects(ActivityPubUser));
	}

	static addMeToUserList(list: ActivityPubUser[], me: ActivityPubUser) {
		// const existingIds = list.map((o) => o._id);
		// const myId = me._id;
		// const exists = existingIds.find((o) => o.toString() == myId.toString());
		//
		// if (!exists) {
		// 	list.push(me);
		// }
		// return list;
	}

	/**
	 * Upsert a user
	 * @param db
	 * @param user
	 * @param userSubdomain used by misskey, when host = null
	 */
	static upsert(
		db: SQLiteDatabase,
		{
			user,
			userSubdomain,
		}: {
			user: UserInterface;
			userSubdomain: string;
		},
	) {
		/**
		 * For Firefish, null = my own subdomain
		 */
		const _subdomain = user.getInstanceUrl() || userSubdomain;

		if (!user) {
			console.log('[WARN]: object null while saving user');
			return null;
		}

		const _server = ActivityPubServerRepository.upsert(db, _subdomain);
		if (!_server) {
			console.log('[WARN]: server null while saving user', _subdomain);
			return null;
		}

		const _user = this.getByUsername(db, user.getUsername(), _subdomain);

		try {
			// return db.create(
			// 	ActivityPubUser,
			// 	{
			// 		_id: _user?._id || new Realm.BSON.UUID(),
			// 		username: user.getUsername(),
			// 		userId: user.getId(),
			// 		avatarUrl: user.getAvatarUrl(),
			// 		displayName: user.getDisplayName(),
			// 		server: _server,
			// 	},
			// 	UpdateMode.Modified,
			// );
		} catch (e) {
			console.log('[ERROR]: user db', e);
			return null;
		}
	}

	static upsertMultiple(
		db: SQLiteDatabase,
		{
			users,
			userSubdomain,
		}: {
			users: UserInterface[];
			userSubdomain: string;
		},
	) {
		const results: ActivityPubUser[] = [];
		for (let i = 0; i < users.length; i++) {
			const savedUser = this.upsert(db, { user: users[i], userSubdomain });
			results.push(savedUser);
		}
		return results;
	}

	static getByUsername(db: SQLiteDatabase, username: string, instance: string) {
		// return db
		// 	.objects(ActivityPubUser)
		// 	.find((o) => o.username === username && o.server?.url === instance);
	}
}
