import { MediaAttachmentTargetInterface } from './_interface.js';
import { DriveFileInstance, MediaAttachmentInstance } from './unique.js';

export class DriveFileToMediaAttachmentAdapter
	implements MediaAttachmentTargetInterface
{
	ref: DriveFileInstance;

	constructor(ref: DriveFileInstance) {
		this.ref = ref;
	}

	getAltText() {
		return this.ref?.instance?.comment;
	}

	getBlurHash() {
		return this.ref?.instance?.blurhash;
	}

	getCreatedAt() {
		return this.ref?.instance?.createdAt;
	}

	getId(): string {
		return this.ref?.instance?.id;
	}

	getMeta() {
		return this.ref?.instance?.properties;
	}

	getName() {
		return this.ref?.instance?.name;
	}

	getPreviewUrl() {
		return this.ref?.instance?.thumbnailUrl;
	}

	getType() {
		return this.ref?.instance?.type;
	}

	getUrl() {
		return this.ref?.instance?.url;
	}

	getHeight(): number | null | undefined {
		return this.getMeta()?.height;
	}

	getWidth(): number | null | undefined {
		return this.getMeta()?.width;
	}

	print() {
		console.log(this.ref.instance);
	}
}

export class MediaAttachmentToMediaAttachmentAdapter
	implements MediaAttachmentTargetInterface
{
	ref: MediaAttachmentInstance;

	constructor(ref: MediaAttachmentInstance) {
		this.ref = ref;
	}

	getAltText() {
		return this.ref?.instance?.description;
	}

	getBlurHash() {
		return this.ref?.instance?.blurhash;
	}

	// no dates available for mastodon
	getCreatedAt() {
		return new Date().toString();
	}

	getId(): string {
		return this.ref?.instance?.id;
	}

	getMeta() {
		return this.ref?.instance?.meta as any;
	}

	getName() {
		return this.ref?.instance?.id;
	}

	getType() {
		return this.ref?.instance?.type;
	}

	/**
	 * NOTE: We would probably need
	 * to return the remote/local urls
	 * individually, since either server
	 * can break
	 */

	getUrl() {
		return this.ref?.instance?.remoteUrl || this.ref?.instance?.url;
	}

	getPreviewUrl() {
		return (
			this.ref?.instance?.previewRemoteUrl || this.ref?.instance?.previewUrl
		);
	}

	getHeight(): number | null | undefined {
		return this.getMeta()?.original?.height;
	}

	getWidth(): number | null | undefined {
		return this.getMeta()?.original?.width;
	}

	print() {
		console.log(this.ref.instance);
	}
}

export class UnknownToMediaAttachmentAdapter
	implements MediaAttachmentTargetInterface
{
	ref: any;

	constructor(ref: any) {
		this.ref = ref;
	}

	getAltText() {
		return null;
	}

	getBlurHash() {
		return null;
	}

	getCreatedAt() {
		return new Date().toString();
	}

	getId(): string {
		return this.ref?.instance?.id;
	}

	getMeta() {
		return null;
	}

	getName() {
		return '';
	}

	getPreviewUrl() {
		return '';
	}

	getType() {
		return '';
	}

	getUrl() {
		return '';
	}

	getHeight(): number | null | undefined {
		return null;
	}

	getWidth(): number | null | undefined {
		return null;
	}

	print() {
		console.log('[WARN]: null media attachment entity');
	}
}
