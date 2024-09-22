import { Realm } from 'realm';
import AccountRepository from '../repositories/account.repo';
import { ActivityPubClient } from '@dhaaga/shared-abstraction-activitypub';
import { ActivityPubTagRepository } from '../repositories/activitypub-tag.repo';
import { Account } from '../entities/account.entity';
import AccountRepo from '../repositories/account.repo';
import { MastoTag } from '@dhaaga/shared-abstraction-activitypub/dist/adapters/_client/_interface';

class AccountService {
	static loadFollowedTags(db: Realm, client: ActivityPubClient) {
		client.tags.followedTags({ limit: 200 }).then(({ data, error }) => {
			if (error) {
				console.log('[ERROR]: failed to fetch followed tags', error);
				return;
			}
			db.write(() => {
				ActivityPubTagRepository.clearFollowing(db);
				ActivityPubTagRepository.applyFollowing(db, data.data as MastoTag[]);
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
