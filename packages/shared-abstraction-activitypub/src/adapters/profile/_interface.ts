import { UserDetailed, User } from '@dhaaga/shared-provider-misskey/src';
import type { mastodon } from '@dhaaga/shared-provider-mastodon/src';
import MisskeyUser from './misskey';
import MastodonUser from './mastodon';
import DefaultUser from './default';

export type EmojiMapValue = {
	url: string;
	visibleInPicker: boolean;
};

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

	getDisplayName(): string | null;

	getPostCount(): number;

	getUsername(): string;

	/**
	 * e.g. - mastodon.social from "https://mastodon.social/@suvam"
	 */
	getInstanceUrl(): string;

	getOnlineStatus(): 'online' | 'active' | 'offline' | 'unknown';

	getAccountUrl(): string;

	/**
	 * AppNavBar-Specific Logic
	 */
	getAppDisplayAccountUrl(myDomain: string): string;

	/**
	 * Custom -- Emojis
	 */
	findEmoji(q: string): EmojiMapValue | undefined;

	getEmojiMap(): Map<string, EmojiMapValue>;
}

export class UserDetailedInstance {
	instance: UserDetailed;
	emojiMap: Map<string, EmojiMapValue>;

	constructor(instance: UserDetailed) {
		this.instance = instance;
		this.emojiMap = new Map();
	}
}

export class AccountInstance {
	instance: mastodon.v1.Account;
	emojiMap: Map<string, EmojiMapValue>;

	constructor(instance: mastodon.v1.Account) {
		this.instance = instance;
		this.emojiMap = new Map();
	}
}

export function ActivityPubUserAdapter(
	profile: any,
	domain: string,
): UserInterface {
	if (!profile) return new DefaultUser();

	switch (domain) {
		case 'misskey': {
			return new MisskeyUser(new UserDetailedInstance(profile as UserDetailed));
		}
		case 'mastodon': {
			const instance = new AccountInstance(profile as mastodon.v1.Account);
			const emojis = (profile as mastodon.v1.Account).emojis;
			const mp = new Map<string, EmojiMapValue>();
			for (let i = 0; i < emojis.length; i++) {
				let { shortcode, ...rest } = emojis[i];

				mp.set(shortcode, {
					url: rest.url,
					visibleInPicker: rest.visibleInPicker,
				});
			}
			return new MastodonUser(instance, mp);
		}
		default: {
			return new DefaultUser();
		}
	}
}
