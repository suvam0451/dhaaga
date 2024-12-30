import { DriveFile } from 'misskey-js/autogen/models.js';
import { MastoMediaAttachment } from '../../types/mastojs.types.js';

export class DriveFileInstance {
	instance: DriveFile;

	constructor(instance: DriveFile) {
		this.instance = instance;
	}
}

export class MediaAttachmentInstance {
	instance: MastoMediaAttachment;

	constructor(instance: MastoMediaAttachment) {
		this.instance = instance;
	}
}
