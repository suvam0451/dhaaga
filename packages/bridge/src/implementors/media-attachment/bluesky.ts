import { z } from 'zod';
import { MediaAttachmentTargetInterface } from './_interface.js';
import { RandomUtil } from '#/utils/random.js';
import { PostLinkAttachmentObjectType } from '#/types/shared/link-attachments.js';

/**
 * Bluesky Media Attachment
 * Adapter Interface
 */
class BlueskyMediaAttachmentAdapter implements MediaAttachmentTargetInterface {
	item: BskyImageEmbedItem;

	constructor(ref: BskyImageEmbedItem) {
		this.item = ref;
	}

	static create(ref: BskyImageEmbedItem) {
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

class BlueskyVideoAttachmentAdapter implements MediaAttachmentTargetInterface {
	/**
	 * For example:
	 * {
	 * 		$type: 'app.bsky.embed.video#view',
	 * 		cid: 'bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne',
	 * 		playlist:
	 * 			'https://video.bsky.app/watch/did%3Aplc%3Ahih2bsukkev2t5sxaytjysvb/bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne/playlist.m3u8',
	 * 		thumbnail:
	 * 			'https://video.bsky.app/watch/did%3Aplc%3Ahih2bsukkev2t5sxaytjysvb/bafkreiennzhlpiwdi3xtfotsadwh5k6xfdcahsnn5ton3zjzhfrgsxbzne/thumbnail.jpg',
	 * 		aspectRatio: {
	 * 			height: 1080,
	 * 			width: 1920,
	 * 		},
	 * 	}
	 */
	item: BskyVideoEmbedType;

	constructor(ref: BskyVideoEmbedType) {
		this.item = ref;
	}

	static create(ref: BskyVideoEmbedType) {
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

export const bskyEmbedExternalSchema_2 = z.object({
	// Record
	// $type: z.literal('app.bsky.embed.external'),
	// external: z.object({
	// 	uri: z.string(),
	// 	title: z.string(),
	// 	description: z.string(),
	// 	thumb: z.any(),
	// }),

	// View
	$type: z.literal('app.bsky.embed.external#view'),
	external: z.object({
		uri: z.string(),
		title: z.string(),
		description: z.string(),
		thumb: z.string(),
	}),
});

type BskyEmbedExternalType = z.infer<typeof bskyEmbedExternalSchema>;

/**
 * @deprecated
 */
class EmbedViewProcessor_External_2 implements MediaAttachmentTargetInterface {
	/**
	 *  "thumb": {
	 *		"$type": "blob",
	 * 		"ref": {
	 * 			"$link": "bafkreibyh7mqyyldtgxhdaqvkqjvrzzvynqsfyn2fxht4tg6nn2fbnptjy"
	 * 		},
	 * 		"mimeType": "image/jpeg",
	 * 		"size": 269918
	 * 	}
	 */
	item: BskyEmbedExternalType;

	constructor(obj: BskyEmbedExternalType) {
		this.item = obj;
	}

	static create(obj: BskyEmbedExternalType) {
		return new EmbedViewProcessor_External_2(obj);
	}

	static isCompatible(obj: any) {
		const { success } = bskyEmbedExternalSchema.safeParse(obj);
		return success;
	}

	static compile(obj: any): MediaAttachmentTargetInterface[] {
		const { data } = bskyEmbedExternalSchema.safeParse(obj);
		return [EmbedViewProcessor_External_2.create(data!)];
	}

	/**
	 * 	TODO: hash these external image attachments
	 * 	 based on something that will not result in
	 * 	 db clutter
	 */
	getId() {
		return RandomUtil.nanoId();
	}

	getAltText = () => this.item.external.description;
	getBlurHash = () => null;
	getCreatedAt = () => new Date().toString();
	getMeta = () => {};
	getName = () => '';
	getPreviewUrl = () => this.item.external.thumb;
	getUrl = () => this.item.external.uri;
	getHeight = () => null;
	getWidth = () => null;

	getType(): string {
		// anything other that jeffs supported?
		return 'image/gif'; // this.item.external.thumb?.['mimeType'];
	}

	print(): void {
		console.log(this.item);
	}
}

/**
 * ------ Uploaded Images ------
 */

const bskyEmbedImagesSchemaImageItem = z.object({
	alt: z.string(), // can be empty string
	aspectRatio: z.object({
		height: z.number().int(),
		width: z.number().int(),
	}),
	thumb: z.string(),
	fullsize: z.string(),
});

type BskyImageEmbedItem = z.infer<typeof bskyEmbedImagesSchemaImageItem>;

const bskyEmbedImagesViewSchema = z.object({
	$type: z.literal('app.bsky.embed.images#view'),
	images: z.array(bskyEmbedImagesSchemaImageItem),
});

const bskyEmbedImageSchema = z.object({
	$type: z.literal('app.bsky.embed.images'),
	images: z.array(
		z.object({
			alt: z.string(),
			aspectRatio: z.object({
				height: z.number().int(),
				width: z.number().int(),
			}),
			image: z.object({
				$type: z.literal('blob'),
				ref: z.object({
					$link: z.string(),
				}),
				mimeType: z.string(),
				size: z.number().int(),
			}),
		}),
	),
});

class EmbedViewProcessor_Images {
	static isCompatible(obj: any) {
		const { success } = bskyEmbedImageSchema.safeParse(obj);
		return success;
	}

	static compile(obj: any): MediaAttachmentTargetInterface[] {
		const { data } = bskyEmbedImageSchema.safeParse(obj);
		return data!.images.map((o) =>
			BlueskyMediaAttachmentAdapter.create({
				alt: o.alt,
				aspectRatio: o.aspectRatio,
				fullsize: o.image.ref.$link,
				thumb: o.image.ref.$link,
			}),
		);
	}
}

// handles --> app.bsky.embed.images#view
class EmbedViewProcessor_ImagesView {
	static isCompatible(obj: any) {
		const { success } = bskyEmbedImagesViewSchema.safeParse(obj);
		return success;
	}

	static compile(obj: any): MediaAttachmentTargetInterface[] {
		const { data } = bskyEmbedImagesViewSchema.safeParse(obj);
		return data!.images.map((o) => BlueskyMediaAttachmentAdapter.create(o));
	}
}

/**
 * --------------------
 */

/**
 * ------ Videos ------
 */

const bskyEmbedVideoSchema = z.object({
	$type: z.literal('app.bsky.embed.video#view'),
	cid: z.string(),
	playlist: z.string(),
	thumbnail: z.string(),
	aspectRatio: z.object({
		height: z.number().int(),
		width: z.number().int(),
	}),
});

type BskyVideoEmbedType = z.infer<typeof bskyEmbedVideoSchema>;

// handles --> app.bsky.embed.video#view
class EmbedViewProcessor_Video {
	static isCompatible(obj: any) {
		const { success } = bskyEmbedVideoSchema.safeParse(obj);
		return success;
	}

	static compile(obj: any): MediaAttachmentTargetInterface[] {
		const { data } = bskyEmbedVideoSchema.safeParse(obj);
		return [BlueskyVideoAttachmentAdapter.create(data!)];
	}
}

const bskyEmbedExternalSchema = z.object({
	$type: z.literal('app.bsky.embed.external#view'),
	external: z.object({
		uri: z.string(),
		title: z.string(),
		description: z.string(),
		thumb: z.string(),
	}),
});

class LinkEmbedProcessor_External {
	static isCompatible(obj: any) {
		const { success } = bskyEmbedExternalSchema.safeParse(obj);
		return success;
	}

	static compile(obj: any): PostLinkAttachmentObjectType[] {
		const { data } = bskyEmbedExternalSchema.safeParse(obj);
		return [
			{
				...data!.external,
				url: data!.external.uri,
				bannerImageUrl: data!.external.thumb,
			},
		];
	}
}

/**
 * --------------------
 */

const bskyEmbedRecordWithMediaSchema = z.object({
	$type: z.literal('app.bsky.embed.recordWithMedia#view'),
	media: z.any(),
	record: z.any(),
});

class EmbedViewProcessor_RecordWithMedia {
	static isCompatible(obj: any) {
		const { success } = bskyEmbedRecordWithMediaSchema.safeParse(obj);
		return success;
	}

	static compile(obj: any): MediaAttachmentTargetInterface[] {
		const { data } = bskyEmbedRecordWithMediaSchema.safeParse(obj);
		if (EmbedViewProcessor_ImagesView.isCompatible(data!.media))
			return EmbedViewProcessor_ImagesView.compile(data!.media);
		if (EmbedViewProcessor_Video.isCompatible(data!.media))
			return EmbedViewProcessor_Video.compile(data!.media);
		return [];
	}
}

export {
	EmbedViewProcessor_External_2,
	LinkEmbedProcessor_External,
	EmbedViewProcessor_ImagesView,
	EmbedViewProcessor_RecordWithMedia,
	EmbedViewProcessor_Video,
	BlueskyMediaAttachmentAdapter,
	BlueskyVideoAttachmentAdapter,
};
