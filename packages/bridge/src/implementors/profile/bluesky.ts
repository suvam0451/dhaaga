import { UserTargetInterface } from './_interface.js';
import { AppBskyActorDefs } from '@atproto/api';

export class BlueskyUserInterface implements UserTargetInterface {
	// + AppBskyActorDefs.ProfileViewBasic;
	ref: AppBskyActorDefs.ProfileViewDetailed;

	constructor(ref: AppBskyActorDefs.ProfileViewDetailed) {
		this.ref = ref;
	}

	getPinnedNotes = () => [];
	getInstanceUrl = (subdomain: string) => subdomain;

	getIsLockedProfile = () => false;

	private extractInstanceUrl(
		url: string,
		username: string,
		myServer: string,
	): string {
		return '';
	}

	// ProfileViewBasic
	getId = () => this.ref.did;
	getDisplayName = () => this.ref.displayName;
	getAccountUrl = () => this.ref.handle;
	getAppDisplayAccountUrl = (myDomain: string) => this.ref.handle;
	getUsername = () => this.ref.handle;
	getAvatarUrl = () => this.ref.avatar;
	getCreatedAt = () => new Date(this.ref.createdAt || new Date());

	getEmojiMap = () => new Map<string, string>();

	findEmoji(q: string) {
		return undefined;
	}

	isValid = () => true;

	getAvatarBlurHash = () => null;

	getBannerUrl = () => this.ref.banner;

	getBannerBlurHash = () => null;
	getDescription = () => this.ref.description;

	getBirthday = () => new Date(this.ref.createdAt || new Date());

	// {key: "val"}[]
	getFields(): any[] {
		return this.ref?.labels || [];
	}

	getFollowersCount = () => this.ref.followersCount || 0;

	getFollowingCount = () => this.ref.followsCount || 0;

	hasPendingFollowRequestFromYou = () => false;

	hasPendingFollowRequestToYou = () => false;
	getIsBot = () => false;

	getPostCount = () => this.ref.postsCount || 0;

	getOnlineStatus = () => 'unknown' as any;

	/**
	 * Bluesky Specials
	 */
	getKnownFollowers() {
		return this.ref.viewer?.knownFollowers || [];
	}
}

export default BlueskyUserInterface;
