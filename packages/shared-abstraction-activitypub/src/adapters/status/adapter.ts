import { DriveFile } from "@dhaaga/shared-provider-misskey/src";
import {
	DriveFileToMediaAttachmentAdapter,
	MediaAttachmentToMediaAttachmentAdapter,
} from "../media-attachment/adapter";
import {
	DriveFileInstance,
	MediaAttachmentInstance,
} from "../media-attachment/unique";
import { StatusInterface } from "./interface";
import { NoteInstance, StatusInstance } from "./unique";
import { MediaAttachmentInterface } from "../media-attachment/interface";

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

	getMediaAttachments() {
		if (!this.ref?.instance?.files) {
			return [];
		}
		return this.ref.instance.files.map((o: DriveFile) => {
			return new DriveFileToMediaAttachmentAdapter(new DriveFileInstance(o));
		});
	}

	isReposted() {
		return this.ref.instance.renote !== null;
	}

	getContent() {
		return this.ref.instance.text;
	}

	print(): void {
		console.log(this.ref.instance);
	}
}

export class StatusToStatusAdapter implements StatusInterface {
	ref: StatusInstance;
	constructor(ref: StatusInstance) {
		this.ref = ref;
	}

	getUsername() {
		return this.ref?.instance?.account.username || "";
	}

	getDisplayName() {
		return this.ref?.instance?.account.displayName || "";
	}

	getAvatarUrl() {
		return this.ref?.instance?.account.avatarStatic || "";
	}

	getCreatedAt() {
		return this.ref.instance?.createdAt || "";
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

	getMediaAttachments() {
		return this.ref.instance.mediaAttachments.map((o) => {
			return new MediaAttachmentToMediaAttachmentAdapter(
				new MediaAttachmentInstance(o)
			);
		});
	}

	getContent(): string | null {
		return this.ref.instance.content;
	}

	print(): void {
		console.log(this.ref.instance);
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
		return new Date().toString();
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

	getContent() {
		return "";
	}

	getMediaAttachments() {
		return [];
	}

	print() {
		console.log("Unknown status type");
	}
}
