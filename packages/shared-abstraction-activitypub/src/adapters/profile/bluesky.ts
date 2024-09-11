import { UserInterface } from './_interface.js';
import { AppBskyActorDefs } from '@atproto/api';

export class BlueskyUserInterface implements UserInterface {
	ref: AppBskyActorDefs.ProfileViewBasic;

	constructor(ref: AppBskyActorDefs.ProfileViewBasic) {
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

	getBannerUrl = () => null;

	getBannerBlurHash = () => null;
	getDescription = () => null;

	getBirthday = () => new Date(this.ref.createdAt || new Date());

	// {key: "val"}[]
	getFields(): any[] {
		return this.ref?.labels || [];
	}

	getFollowersCount = () => 0;

	getFollowingCount = () => 0;

	hasPendingFollowRequestFromYou = () => false;

	hasPendingFollowRequestToYou = () => false;
	getIsBot = () => false;

	getPostCount = () => 0;

	getOnlineStatus = () => 'unknown' as any;
}

export default BlueskyUserInterface;
