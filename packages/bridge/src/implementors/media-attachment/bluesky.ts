import { MediaAttachmentInterface } from './interface.js';

export type BlueskyMediaAttachmentItem = {
	alt: string; // can be empty string
	aspectRatio: { height: number; width: number };
	fullsize: string;
	thumb: string;
};

export type BlueskyMediaEmbedItem = {
	$type: 'app.bsky.embed.video#view';
	cid: string;
	playlist: string;
	thumbnail: string;
	aspectRatio: {
		height: number;
		width: number;
	};
};

/**
 * Bluesky Media Attachment
 * Adapter Interface
 */
export class BlueskyMediaAttachmentAdapter implements MediaAttachmentInterface {
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

// Example included here for reference
const bskyMediaEmbed = {
	embed: {
		$type: 'app.bsky.embed.video#view',
		cid: 'bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne',
		playlist:
			'https://video.bsky.app/watch/did%3Aplc%3Ahih2bsukkev2t5sxaytjysvb/bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne/playlist.m3u8',
		thumbnail:
			'https://video.bsky.app/watch/did%3Aplc%3Ahih2bsukkev2t5sxaytjysvb/bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne/thumbnail.jpg',
		aspectRatio: {
			height: 1080,
			width: 1920,
		},
	},
};

// video.cdn.bsky.app/hls/did:plc:hih2bsukkev2t5sxaytjysvb/bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne/360p/video0.ts
//video.bsky.app/watch/did%3Aplc%3Ahih2bsukkev2t5sxaytjysvb/bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne/360p/video0.ts?session_id=cu17752djros72p433t0&dur=6.000000

export class BlueskyVideoAttachmentAdapter implements MediaAttachmentInterface {
	item: BlueskyMediaEmbedItem;

	constructor(ref: BlueskyMediaEmbedItem) {
		this.item = ref;
	}

	static create(ref: BlueskyMediaEmbedItem) {
		return new BlueskyVideoAttachmentAdapter(ref);
	}

	getId() {
		return this.item.cid;
	}

	getAltText = () => null;
	getBlurHash = () => null;
	getCreatedAt = () => new Date().toString();
	getMeta = () => {};
	getName = () => '';
	getPreviewUrl = () => this.item.thumbnail;
	getUrl = () => {
		return this.item.thumbnail
			.replace('video.bsky.app/watch', 'video.cdn.bsky.app/hls')
			.replace('thumbnail.jpg', '360p/video0.ts');
	};
	getHeight = () => this.item?.aspectRatio?.height;
	getWidth = () => this.item?.aspectRatio?.width;

	getType(): string {
		// TODO: get type from urls
		return 'video';
	}

	print(): void {
		console.log(this.item);
	}
}
