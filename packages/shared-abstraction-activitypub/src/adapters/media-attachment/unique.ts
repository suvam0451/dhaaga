import { mastodon } from "@dhaaga/shared-provider-mastodon/dist";
import { DriveFile } from "@dhaaga/shared-provider-misskey/dist";

export class DriveFileInstance {
	instance: DriveFile;
	constructor(instance: DriveFile) {
		this.instance = instance;
	}
}

export class MediaAttachmentInstance {
	instance: mastodon.v1.MediaAttachment;
	constructor(instance: mastodon.v1.MediaAttachment) {
		this.instance = instance;
	}
}
