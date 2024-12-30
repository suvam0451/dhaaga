import { MediaAttachmentInterface } from './interface.js';

export type BlueskyMediaAttachmentItem = {
	alt: string; // can be empty string
	aspectRatio: { height: number; width: number };
	fullsize: string;
	thumb: string;
};

/**
 * Bluesky Media Attachment
 * Adapter Interface
 */
class BlueskyMediaAttachmentAdapter implements MediaAttachmentInterface {
	item: BlueskyMediaAttachmentItem;

	constructor(ref: BlueskyMediaAttachmentItem) {
		this.item = ref;
	}

	static create(ref: BlueskyMediaAttachmentItem) {
		return new BlueskyMediaAttachmentAdapter(ref);
	}

	getId() {
		const ex = /^https:\/\/.*?\/did:plc:.*?\/(.*?)@.*?$/;
		if (this.item?.fullsize && ex.test(this.item.fullsize)) {
			return this.item.fullsize.match(ex)![1];
		}
		return '';
	}

	getAltText = () => this.item.alt;
	getBlurHash = () => null;
	getCreatedAt = () => new Date().toString();
	getMeta = () => {};
	getName = () => '';
	getPreviewUrl = () => this.item.thumb;
	getUrl = () => this.item.fullsize;
	getHeight = () => this.item?.aspectRatio?.height;
	getWidth = () => this.item?.aspectRatio?.width;

	getType(): string {
		// TODO: get type from urls
		return 'image';
	}

	print(): void {
		console.log(this.item);
	}
}

export default BlueskyMediaAttachmentAdapter;
