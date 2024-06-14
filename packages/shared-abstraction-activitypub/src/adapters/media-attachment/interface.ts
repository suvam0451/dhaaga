import { mastodon } from "@dhaaga/shared-provider-mastodon/src";

/**
 * For reference, see
 * @type {MediaAttachment}
 * @type {DriveFile}
 *
 * For type, see
 * @type {MediaAttachmentType} --> "image" | "video" | "gifv" | "audio" | "unknown";
 */
export interface MediaAttachmentInterface {
	getAltText(): string | null | undefined;
	getBlurHash(): string | null | undefined;
	getCreatedAt(): string;
  getId(): string;
  getMeta(): any | mastodon.v1.MediaAttachmentMeta
	getName(): string;
	getPreviewUrl(): string | null | undefined;
	getType(): string;
	getUrl(): string | null | undefined;


  // dimensions
  getHeight(): number | null | undefined;
  getWidth(): number | null | undefined;

	print(): void;
}
