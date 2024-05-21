import {MediaAttachmentInterface} from "../media-attachment/interface";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {
  MastodonToStatusAdapter,
  MisskeyToStatusAdapter,
  UnknownToStatusAdapter
} from "../../index";

export type Status = mastodon.v1.Status | Note | null | undefined
export type StatusArray = Status[]

export interface StatusInterface {
  getId(): string

  getUsername(): string;

  getDisplayName(): string | null;

  getAvatarUrl(): string | null;

  getCreatedAt(): string;

  getVisibility(): string;

  getAccountUrl(): string | null | undefined;

  getRepostedStatus(): StatusInterface | null | undefined;

  getRepostedStatusRaw(): Status;

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

  isReply(): boolean

  getParentStatusId(): string | null | undefined

  getUserIdParentStatusUserId(): string | null | undefined
}

export class StatusInstance {
  instance: mastodon.v1.Status;

  constructor(instance: mastodon.v1.Status) {
    this.instance = instance;
  }
}

export class NoteInstance {
  instance: Note;

  constructor(instance: Note) {
    this.instance = instance;
  }
}

/**
 * @param status any status object
 * @param domain domain from database
 * @returns StatusInterface
 */
export function ActivitypubStatusAdapter(
    status: any,
    domain: string): StatusInterface {
  switch (domain) {
    case "misskey": {
      return new MisskeyToStatusAdapter(new NoteInstance(status as Note));
    }
    case "mastodon": {
      return new MastodonToStatusAdapter(
          new StatusInstance(status as mastodon.v1.Status)
      );
    }
    default: {
      return new UnknownToStatusAdapter();
    }
  }
}