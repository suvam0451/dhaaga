import { MediaAttachmentInterface } from "../media-attachment/interface";

export interface StatusInterface {
	getUsername(): string;
	getDisplayName(): string;
	getAvatarUrl(): string;
	getCreatedAt(): string;
	getVisibility(): string;
	getAccountUrl(): string | null | undefined;
	getRepostedStatus(): StatusInterface | null | undefined;
	getContent(): string | null;
	// getUser()
	isReposted(): boolean;
	getMediaAttachments(): MediaAttachmentInterface[] | null | undefined;
	print(): void;

	getRepliesCount(): number;
	getRepostsCount(): number;
	getFavouritesCount(): number;

	getId(): string;

	isValid(): boolean;
}
