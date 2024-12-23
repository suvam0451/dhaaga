import MisskeyUser from './misskey.js';
import MastodonUser from './mastodon.js';
import DefaultUser from './default.js';
import { KNOWN_SOFTWARE } from '../../adapters/_client/_router/routes/instance.js';
import camelcaseKeys from 'camelcase-keys';
import BlueskyUserInterface from './bluesky.js';
import type {
	MissNote,
	MissUser,
	MissUserDetailed,
} from '../../types/misskey-js.types.js';
import type { MastoAccount } from '../../types/mastojs.types.js';

export type UserType =
	| MastoAccount
	| MissUserDetailed
	| MissUser
	| null
	| undefined;

export interface UserInterface {
	getAvatarBlurHash(): string | null | undefined;

	getAvatarUrl(): string | null | undefined;

	getBannerUrl(): string | null | undefined;

	getBannerBlurHash(): string | null;

	getDescription(): string | null | undefined;

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

	getPinnedNotes(): MissNote[];
}

export class UserDetailedInstance {
	instance: MissUserDetailed;

	constructor(instance: MissUserDetailed) {
		this.instance = instance;
	}
}

export class AccountInstance {
	instance: MastoAccount;

	constructor(instance: MastoAccount) {
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
			return new MisskeyUser(
				new UserDetailedInstance(profile as MissUserDetailed),
			);
		}
		case KNOWN_SOFTWARE.MASTODON: {
			const instance = new AccountInstance(profile as MastoAccount);
			return new MastodonUser(instance);
		}
		case KNOWN_SOFTWARE.PLEROMA:
		case KNOWN_SOFTWARE.AKKOMA: {
			const _camel = camelcaseKeys(profile, { deep: true });
			return new MastodonUser(new AccountInstance(_camel as MastoAccount));
		}
		case KNOWN_SOFTWARE.BLUESKY:
			return new BlueskyUserInterface(profile);
		default: {
			return new DefaultUser();
		}
	}
}
