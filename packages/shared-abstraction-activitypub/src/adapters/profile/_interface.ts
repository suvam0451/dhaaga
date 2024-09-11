import { UserDetailed, User } from 'misskey-js/autogen/models.js';
import type { mastodon } from '@dhaaga/shared-provider-mastodon';
import MisskeyUser from './misskey.js';
import MastodonUser from './mastodon.js';
import DefaultUser from './default.js';
import { Note } from 'misskey-js/autogen/models.d.ts';
import { KNOWN_SOFTWARE } from '../_client/_router/routes/instance.js';
import camelcaseKeys from 'camelcase-keys';
import BlueskyUserInterface from './bluesky.js';

export type UserType =
	| mastodon.v1.Account
	| UserDetailed
	| User
	| null
	| undefined;

export interface UserInterface {
	getAvatarBlurHash(): string | null | undefined;

	getAvatarUrl(): string | null | undefined;

	getBannerUrl(): string | null;

	getBannerBlurHash(): string | null;

	getDescription(): string | null;

	getCreatedAt(): Date;

	getBirthday(): Date | null;

	getFields(): any[];

	getFollowersCount(): number;

	getFollowingCount(): number;

	hasPendingFollowRequestFromYou(): boolean | null | undefined;

	hasPendingFollowRequestToYou(): boolean | null | undefined;

	getId(): string;

	getIsBot(): boolean | undefined | null;

	getIsLockedProfile(): boolean | undefined | null;

	getDisplayName(): string | null | undefined;

	getPostCount(): number;

	getUsername(): string;

	/**
	 * e.g. - mastodon.social from "https://mastodon.social/@suvam"
	 */
	getInstanceUrl(subdomain?: string): string | null;

	getOnlineStatus(): 'online' | 'active' | 'offline' | 'unknown';

	getAccountUrl(mySubdomain?: string): string;

	/**
	 * AppNavBar-Specific Logic
	 */
	getAppDisplayAccountUrl(myDomain: string): string;

	getEmojiMap(): Map<string, string>;

	getPinnedNotes(): Note[];
}

export class UserDetailedInstance {
	instance: UserDetailed;

	constructor(instance: UserDetailed) {
		this.instance = instance;
	}
}

export class AccountInstance {
	instance: mastodon.v1.Account;

	constructor(instance: mastodon.v1.Account) {
		this.instance = instance;
	}
}

export function ActivityPubUserAdapter(
	profile: any,
	domain: string,
): UserInterface {
	if (!profile) return new DefaultUser();

	switch (domain) {
		case KNOWN_SOFTWARE.MISSKEY:
		case KNOWN_SOFTWARE.FIREFISH:
		case KNOWN_SOFTWARE.MEISSKEY:
		case KNOWN_SOFTWARE.KMYBLUE:
		case KNOWN_SOFTWARE.CHERRYPICK:
		case KNOWN_SOFTWARE.SHARKEY: {
			return new MisskeyUser(new UserDetailedInstance(profile as UserDetailed));
		}
		case KNOWN_SOFTWARE.MASTODON: {
			const instance = new AccountInstance(profile as mastodon.v1.Account);
			return new MastodonUser(instance);
		}
		case KNOWN_SOFTWARE.PLEROMA:
		case KNOWN_SOFTWARE.AKKOMA: {
			const _camel = camelcaseKeys(profile, { deep: true });
			return new MastodonUser(
				new AccountInstance(_camel as mastodon.v1.Account),
			);
		}
		case KNOWN_SOFTWARE.BLUESKY:
			return new BlueskyUserInterface(profile);
		default: {
			return new DefaultUser();
		}
	}
}
