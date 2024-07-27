import { BSON, Realm } from 'realm';
import UUID = BSON.UUID;
import AccountRepository from '../repositories/account.repo';
import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubTagRepository } from '../repositories/activitypub-tag.repo';
import { Account } from '../entities/account.entity';
import AccountRepo from '../repositories/account.repo';
import { KNOWN_SOFTWARE } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_router/instance';

class AccountService {
	static selectAccount(db: Realm, _id: UUID) {
		db.write(() => {
			AccountRepository.select(db, _id);
		});
	}

	static deselectAccount(db: Realm, _id: UUID) {
		db.write(() => {
			AccountRepository.deselect(db, _id);
		});
	}

	static loadFollowedTags(db: Realm, client: ActivityPubClient) {
		client.getFollowedTags({ limit: 200 }).then((res: any) => {
			db.write(() => {
				ActivityPubTagRepository.clearFollowing(db);
				ActivityPubTagRepository.applyFollowing(db, res.data);
			});
		});
	}

	static updateBookmarkSyncStatus(db: Realm, acct: Account) {
		db.write(() => {
			acct.bookmarksLastSyncedAt = new Date();
		});
	}

	static clearBookmarkSyncStatus(db: Realm, acct: Account) {
		db.write(() => {
			acct.bookmarksLastSyncedAt = null;
		});
	}

	static updateTagStatus(db: Realm, name: string, followed: boolean) {}

	static updateSoftwareType(db: Realm, acct: Account, software: string) {
		db.write(() => {
			AccountRepository.updateSoftware(db, acct, software);
		});
	}

	static remove(db: Realm, acct: Account) {
		db.write(() => {
			AccountRepo.remove(db, acct._id.toString());
		});
	}

	static upsert(
		db: Realm,
		{
			username,
			subdomain,
			displayName,
			domain,
			credentials,
			avatarUrl,
		}: {
			domain: string;
			subdomain: string;
			username: string;
			avatarUrl?: string;
			displayName?: string;
			credentials: {
				key: string;
				value?: string;
			}[];
		},
	) {
		db.write(() => {
			const acct = AccountRepository.upsert(db, {
				subdomain,
				domain,
				username,
				avatarUrl,
				displayName,
			});

			for (const credential of credentials) {
				AccountRepository.setSecret(
					db,
					acct,
					credential.key,
					credential.value || '',
				);
			}
		});
	}
}

export default AccountService;
