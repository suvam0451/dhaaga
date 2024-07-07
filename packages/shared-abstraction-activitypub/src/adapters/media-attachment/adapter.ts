import { MediaAttachmentInterface } from './interface.js';
import { DriveFileInstance, MediaAttachmentInstance } from './unique.js';

export class DriveFileToMediaAttachmentAdapter
	implements MediaAttachmentInterface
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
	implements MediaAttachmentInterface
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

	// no dates available for masto-dono
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

	getPreviewUrl() {
		return this.ref?.instance?.previewUrl;
	}

	getType() {
		return this.ref?.instance?.type;
	}

	getUrl() {
		return this.ref?.instance?.url;
	}

	/**
	 * Masto-dono stores the dimensions for various
	 * sizes, as follows:
	 *
	 * {"original": {"aspect": 0.7615101289134438, "height": 1086, "size": "827x1086", "width": 827},
	 * "small": {"aspect": 0.7618181818181818, "height": 550, "size": "419x550", "width": 419}}
	 */
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
	implements MediaAttachmentInterface
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
