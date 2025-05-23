import { UserDetailedInstance, UserTargetInterface } from './_interface.js';

export class MisskeyUser implements UserTargetInterface {
	ref: UserDetailedInstance;

	constructor(ref: UserDetailedInstance) {
		this.ref = ref;
	}

	getPinnedNotes = () => this.ref.instance?.pinnedNotes || [];

	getInstanceUrl(subdomain: string) {
		return this.ref.instance?.host || subdomain;
	}

	getIsLockedProfile(): boolean | null | undefined {
		return this.ref.instance?.isLocked;
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

	getAccountUrl(mySubdomain?: string): string {
		if (!this.ref.instance?.host && mySubdomain) {
			return `https://${mySubdomain}/@${this.ref.instance?.username}`;
		}
		return `https://${this.ref.instance?.host}/@${this.ref.instance?.username}`;
	}

	getAppDisplayAccountUrl(myDomain: string): string {
		const url = this.getAccountUrl();
		const username = this.getUsername();
		return this.extractInstanceUrl(url, username, myDomain);
	}

	getEmojiMap(): Map<string, string> {
		const retval: Map<string, string> = new Map();
		const src = (this.ref.instance as any)?.emojis || {};
		for (const k in src) {
			if (typeof src[k] === 'string') {
				// misskey
				retval.set(k, src[k]);
			} else {
				// firefish (deprecated)
				retval.set(src[k]?.['name'], src[k]?.['url']);
				// firefish
				// retval.push({
				// 	name: (src[k] as any)?.['name'],
				// 	url: (src[k] as any)?.['url'],
				// 	height: (src[k] as any)?.['height'],
				// 	width: (src[k] as any)?.['width'],
				// });
			}
		}
		return new Map([...retval]);
	}

	findEmoji(q: string) {
		return undefined;
	}

	isValid() {
		return this.ref?.instance !== undefined && this.ref?.instance !== null;
	}

	getUsername() {
		return this.ref?.instance?.username;
	}

	getAvatarBlurHash() {
		return this.ref?.instance?.avatarBlurhash;
	}

	getAvatarUrl() {
		return this.ref?.instance?.avatarUrl;
	}

	getBannerUrl() {
		return this.ref?.instance?.bannerUrl;
	}

	getBannerBlurHash() {
		return this.ref?.instance?.bannerBlurhash;
	}

	getDescription() {
		return this.ref?.instance?.description;
	}

	getCreatedAt() {
		return new Date(this.ref?.instance?.createdAt);
	}

	getBirthday() {
		return this.ref?.instance?.birthday
			? new Date(this.ref?.instance?.birthday)
			: null;
	}

	getFields(): any[] {
		return this.ref?.instance?.fields;
	}

	getFollowersCount() {
		return (this.ref?.instance?.followersCount as any) === '?'
			? 0
			: this.ref?.instance?.followersCount;
	}

	getFollowingCount() {
		return (this.ref?.instance?.followingCount as any) === '?'
			? 0
			: this.ref?.instance?.followingCount;
	}

	hasPendingFollowRequestFromYou() {
		return this.ref?.instance?.hasPendingFollowRequestFromYou;
	}

	hasPendingFollowRequestToYou() {
		return this.ref?.instance?.hasPendingFollowRequestToYou;
	}

	getIsBot() {
		return this.ref?.instance?.isBot;
	}

	getPostCount() {
		return this.ref?.instance?.notesCount;
	}

	getOnlineStatus() {
		return this.ref?.instance?.onlineStatus;
	}

	getId() {
		return this.ref?.instance?.id;
	}

	getDisplayName() {
		return this.ref?.instance?.name;
	}
}

export default MisskeyUser;
