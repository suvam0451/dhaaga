import { UserDetailed } from "@dhaaga/shared-provider-misskey/src";
import { UserProfileInterface } from "./interface";
import { UserDetailedInstance } from "./unique";

export class UserDetailedToUserProfileAdapter implements UserProfileInterface {
	ref: UserDetailedInstance;
	constructor(ref: UserDetailedInstance) {
		this.ref = ref;
	}

	isValid() {
		return this.ref?.instance !== undefined && this.ref?.instance !== null;
	}
	getUsername() {
		return this.ref?.instance?.username;
	}
	getAvatarBlurHash(): string {
		return this.ref?.instance?.avatarBlurhash;
	}
	getAvatarUrl(): string {
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
		return this.ref?.instance?.followersCount;
	}
	getFollowingCount() {
		return this.ref?.instance?.followingCount;
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

	getDispalyName() {
		return this.ref?.instance?.name;
	}
}
