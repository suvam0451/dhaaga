import { Note } from "@dhaaga/shared-provider-misskey/dist";
import { StatusInterface } from "../interfaces/StatusInterface";
import { StatusInstance } from "../interfaces/StatusInterface";

export class NoteToStatusAdapter implements StatusInterface {
	ref: NoteInstance;
	constructor(ref: NoteInstance) {
		this.ref = ref;
	}

	getUsername() {
		return this.ref.instance.user.username;
	}
	getDisplayName() {
		return this.ref.instance.user.name;
	}

	getAvatarUrl() {
		return this.ref.instance.user.avatarUrl;
	}

	getCreatedAt() {
		return this.ref.instance.createdAt;
	}

	getVisibility() {
		return this.ref.instance.visibility;
	}

	getAccountUrl() {
		return this.ref.instance.user.instance?.name;
	}
	getRepostedStatus(): StatusInterface | null | undefined {
		if (this.ref.instance.renote) {
			return new NoteToStatusAdapter(
				new NoteInstance(this.ref.instance.renote)
			);
		}
		return null;
	}

	isReposted(): boolean {
		return this.ref.instance.renote !== null;
	}
}

export class StatusToStatusAdapter implements StatusInterface {
	ref: StatusInstance;
	constructor(ref: StatusInstance) {
		this.ref = ref;
	}

	getUsername() {
		return this.ref.instance.account.username;
	}

	getDisplayName() {
		return this.ref.instance.account.displayName;
	}

	getAvatarUrl() {
		return this.ref.instance.account.avatarStatic;
	}

	getCreatedAt() {
		return this.ref.instance.createdAt;
	}

	getVisibility() {
		return this.ref.instance.visibility;
	}

	getAccountUrl() {
		return this.ref.instance.account.url;
	}
	getRepostedStatus(): StatusInterface | null | undefined {
		if (this.ref.instance.reblog) {
			return new StatusToStatusAdapter(
				new StatusInstance(this.ref.instance.reblog)
			);
		}
		return null;
	}

	isReposted(): boolean {
		return this.ref.instance.reblog !== null;
	}
}

export class UnknownToStatusAdapter implements StatusInterface {
	getUsername() {
		return "";
	}

	getDisplayName() {
		return "";
	}

	getAvatarUrl() {
		return "";
	}

	getCreatedAt() {
		return "";
	}

	getVisibility() {
		return "";
	}

	getAccountUrl() {
		return "";
	}

	getRepostedStatus(): StatusInterface | null | undefined {
		return null;
	}

	isReposted() {
		return false;
	}
}
export class NoteInstance {
	instance: Note;
	constructor(instance: Note) {
		this.instance = instance;
	}
}
