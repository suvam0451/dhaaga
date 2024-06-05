import {MediaAttachmentInterface} from "../media-attachment/interface";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {UserType} from "../profile/_interface";

export type Status = mastodon.v1.Status | Note | null | undefined
export type StatusArray = Status[]

export interface StatusContextInterface {
  getId(): string

  getChildren(): StatusInterface[]

  getParent(): StatusInterface | null | undefined

  getRoot(): StatusInterface | null | undefined

  addChildren(items: StatusInterface[]): void
}

export interface StatusInterface {
  getRaw(): Status

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

  getUser(): UserType | null

  isReposted(): boolean;

  getMediaAttachments(): MediaAttachmentInterface[] | null | undefined;

  print(): void;

  getRepliesCount(): number;

  getIsBookmarked(): boolean | null | undefined
  getIsFavourited(): boolean | null | undefined
  getRepostsCount(): number;

  getFavouritesCount(): number;

  getAccountId_Poster(): string;

  isValid(): boolean;

  isReply(): boolean

  getParentStatusId(): string | null | undefined

  getUserIdParentStatusUserId(): string | null | undefined

  print(): void

  getIsSensitive(): boolean

  getSpoilerText(): string | null | undefined

  /**
   * Reply Thread
   */
  setDescendents(items: StatusInterface[]): void

  getDescendants(): StatusInterface[]
}

export class StatusContextInstance {
  instance: StatusInterface
  children: StatusInterface[]
  parent: StatusInterface | null | undefined

  constructor(instance: StatusInterface) {
    this.instance = instance
    this.children = []
  }

  setParent(parent: StatusInterface | null | undefined): void {
    this.parent = parent
  }

  addChild(item: StatusInterface) {
    this.children.push(item)
  }

  addChildren(items: StatusInterface[]) {
    this.children = this.children.concat(items)
  }
}


export class StatusInstance {
  instance: mastodon.v1.Status;
  emojiMap: Map<string, URL>

  constructor(instance: mastodon.v1.Status) {
    this.instance = instance;
    this.emojiMap = new Map()
  }
}

export class NoteInstance {
  instance: Note;
  emojiMap: Map<string, URL>

  constructor(instance: Note) {
    this.instance = instance;
    this.emojiMap = new Map()
  }
}