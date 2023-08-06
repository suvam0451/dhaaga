import { mastodon } from "masto";

export interface UserInterface {

}

export interface StatusInterface {
	getUsername(): string;
	getDisplayName(): string;
	getAvatarUrl(): string;
	getCreatedAt(): string;
	getVisibility(): string;
	getAccountUrl(): string | null | undefined;
	getRepostedStatus(): StatusInterface | null | undefined;
	// getUser()
	isReposted(): boolean
}

export class StatusInstance implements StatusInterface {
	/**
	 *
	 */
	instance: mastodon.v1.Status;
	constructor(instance: mastodon.v1.Status) {
		this.instance = instance;
	}
	getUsername() {
		return this.instance.account.username;
	}
	getDisplayName() {
		return this.instance.account.displayName;
	}
	getAvatarUrl() {
		return this.instance.account.avatar;
	}
	getCreatedAt() {
		return this.instance.createdAt;
	}
	getVisibility() {
		return this.instance.visibility;
	}
	getAccountUrl() {
		return this.instance.account.url;
	}
	getRepostedStatus() {
		return this.instance.reblog
			? new StatusInstance(this.instance.reblog)
			: null;
	}
	isReposted() {
		return this.instance.reblog ? true : false;
	}

	getUser() {

	}
}
