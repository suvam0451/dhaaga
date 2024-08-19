import { AccountInstance, EmojiMapValue, UserInterface } from './_interface.js';

class MastodonUser implements UserInterface {
	ref: AccountInstance;
	mp: Map<string, EmojiMapValue>;

	constructor(ref: AccountInstance, mp: Map<string, EmojiMapValue>) {
		this.ref = ref;
		this.mp = mp;
	}

	// not implemented
	getPinnedNotes = () => [];

	getInstanceUrl(): string {
		const ex = /^https?:\/\/(.*?)\/(.*?)/;
		const subdomainExtractUrl = /^https?:\/\/(.*?)\/@?/;
		const fullUrl = this.ref.instance?.url;
		if (ex.test(fullUrl)) {
			// @ts-ignore
			return fullUrl.match(subdomainExtractUrl)[1];
		}
		return '';
	}

	getAccountUrl(mySubdomain?: string): string {
		return this.ref.instance?.url;
	}

	private extractInstanceUrl(
		url: string,
		username: string,
		myServer: string,
	): string {
		if (!url) return '';

		let ourUrl = '';
		let theirUrl = '';
		const ex = /^https?:\/\/(.*?)\/(.*?)/;
		const subdomainExtractUrl = /^https?:\/\/(.*?)\/?/;

		if (ex.test(myServer)) {
			// @ts-ignore
			ourUrl = myServer.match(subdomainExtractUrl)[1];
		}

		if (ex.test(url)) {
			// @ts-ignore
			theirUrl = url.match(ex)[1];
		}

		if (url.includes(myServer)) return '@' + username;

		if (ourUrl === theirUrl) {
			return '@' + username;
		}
		return '@' + username + '@' + theirUrl;
	}

	getAppDisplayAccountUrl(myDomain: string): string {
		const url = this.getAccountUrl();
		const username = this.getUsername();
		return this.extractInstanceUrl(url, username, myDomain);
	}

	getEmojiMap(): Map<string, EmojiMapValue> {
		return this.mp;
	}

	findEmoji(q: string) {
		return this.mp.get(q);
	}

	getAvatarBlurHash(): string {
		return this.ref?.instance?.avatarStatic;
	}

	getAvatarUrl(): string {
		return this.ref?.instance?.avatar;
	}

	getBannerBlurHash(): string | null {
		return this?.ref?.instance?.headerStatic;
	}

	getBannerUrl(): string | null {
		return this?.ref?.instance?.header;
	}

	getBirthday(): Date | null {
		return null;
	}

	getCreatedAt(): Date {
		return new Date(this?.ref?.instance?.createdAt);
	}

	getDescription(): string | null {
		return this?.ref?.instance?.note;
	}

	getDisplayName(): string {
		return this?.ref?.instance?.displayName;
	}

	getFields(): any[] {
		return this?.ref?.instance?.fields;
	}

	getFollowersCount(): number {
		return this?.ref?.instance?.followersCount;
	}

	getFollowingCount(): number {
		return this?.ref?.instance?.followingCount;
	}

	getId(): string {
		return this?.ref?.instance?.id;
	}

	getIsBot(): boolean {
		return this?.ref?.instance?.bot;
	}

	getIsLockedProfile() {
		return this?.ref?.instance?.locked;
	}

	getOnlineStatus(): 'online' | 'active' | 'offline' | 'unknown' {
		return 'unknown';
	}

	getPostCount(): number {
		return this.ref?.instance?.statusesCount;
	}

	getUsername(): string {
		return this?.ref?.instance?.username;
	}

	hasPendingFollowRequestFromYou(): boolean {
		return false;
	}

	hasPendingFollowRequestToYou(): boolean {
		return false;
	}
}

export default MastodonUser;
