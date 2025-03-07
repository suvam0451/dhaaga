import { MastoMediaAttachmentMeta } from '../../types/mastojs.types.js';

/**
 * For reference, see
 * @type {MediaAttachment}
 * @type {DriveFile}
 *
 * For type, see
 * @type {MediaAttachmentType} --> "image" | "video" | "gifv" | "audio" | "unknown";
 */
interface MediaAttachmentTargetInterface {
	getAltText(): string | null | undefined;

	getBlurHash(): string | null | undefined;

	getCreatedAt(): string;

	getId(): string;

	getMeta(): any | MastoMediaAttachmentMeta;

	getName(): string;

	getPreviewUrl(): string | null | undefined;

	getType(): string;

	getUrl(): string | null | undefined;

	// dimensions
	getHeight(): number | null | undefined;

	getWidth(): number | null | undefined;

	print(): void;
}

export type { MediaAttachmentTargetInterface };
