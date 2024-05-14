import {MediaAttachmentInterface} from "../media-attachment/interface";

export interface StatusInterface {
  getId(): string

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

  getIsBookmarked(): boolean | null | undefined

  getRepostsCount(): number;

  getFavouritesCount(): number;

  getAccountId_Poster(): string;

  isValid(): boolean;
}
