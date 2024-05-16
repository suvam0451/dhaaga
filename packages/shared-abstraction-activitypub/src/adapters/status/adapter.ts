import {DriveFile} from "@dhaaga/shared-provider-misskey/src";
import {
  DriveFileToMediaAttachmentAdapter,
  MediaAttachmentToMediaAttachmentAdapter,
} from "../media-attachment/adapter";
import {
  DriveFileInstance,
  MediaAttachmentInstance,
} from "../media-attachment/unique";
import {StatusInterface} from "./interface";
import {NoteInstance, StatusInstance} from "./unique";

export class MisskeyToStatusAdapter implements StatusInterface {
  ref: NoteInstance;

  constructor(ref: NoteInstance) {
    this.ref = ref;
  }

  getIsBookmarked(): boolean {
    return false
  }

  isValid() {
    return this.ref?.instance !== undefined && this.ref?.instance !== null;
  }

  getId(): string {
    return this.ref?.instance?.id;
  }

  getRepliesCount(): number {
    return this.ref?.instance?.repliesCount;
  }

  getRepostsCount(): number {
    return this.ref?.instance?.renoteCount;
  }

  getFavouritesCount(): number {
    return -1;
  }

  getUsername() {
    return this.ref?.instance?.user.username;
  }

  getDisplayName() {
    return this.ref?.instance?.user.name;
  }

  getAvatarUrl() {
    return this.ref?.instance?.user.avatarUrl;
  }

  getCreatedAt() {
    return this.ref?.instance?.createdAt || new Date().toString();
  }

  getVisibility() {
    return this.ref?.instance?.visibility;
  }

  getAccountUrl() {
    return this.ref?.instance?.user.instance?.name;
  }

  getRepostedStatus(): StatusInterface | null | undefined {
    if (this.ref?.instance?.renote) {
      return new MisskeyToStatusAdapter(
          new NoteInstance(this.ref?.instance?.renote)
      );
    }
    return null;
  }

  getMediaAttachments() {
    if (!this.ref?.instance?.files) {
      return [];
    }
    return this.ref?.instance?.files.map((o: DriveFile) => {
      return new DriveFileToMediaAttachmentAdapter(new DriveFileInstance(o));
    });
  }

  isReposted() {
    return this.ref?.instance?.renote !== null;
  }

  getContent() {
    return this.ref?.instance?.text;
  }

  print(): void {
    console.log(this.ref.instance);
  }

  getAccountId_Poster(): string {
    return this?.ref?.instance?.user?.id;
  }
}

export class MastodonToStatusAdapter implements StatusInterface {
  ref: StatusInstance;

  constructor(ref: StatusInstance) {
    this.ref = ref;
  }

  getIsBookmarked() {
    return this?.ref?.instance?.bookmarked
  }

  isValid() {
    return this.ref?.instance !== undefined && this.ref?.instance !== null;
  }

  getId(): string {
    return this.ref?.instance?.id;
  }

  getAccountId() {

  }

  getRepliesCount(): number {
    return this.ref?.instance?.repliesCount;
  }

  getRepostsCount(): number {
    return this.ref?.instance?.reblogsCount;
  }

  getFavouritesCount(): number {
    return this.ref?.instance?.favouritesCount;
  }

  getUsername() {
    // console.log("need username", this.ref.instance)
    return this.ref?.instance?.account.displayName || "";
  }

  getDisplayName() {
    return this.ref?.instance?.account.displayName || "";
  }

  getAvatarUrl() {
    return this.ref?.instance?.account.avatarStatic || "";
  }

  getCreatedAt() {
    return this.ref.instance?.createdAt || new Date().toString();
  }

  getVisibility() {
    return this.ref?.instance?.visibility;
  }

  getAccountUrl() {
    return this.ref?.instance?.account.url;
  }

  getRepostedStatus(): StatusInterface | null | undefined {
    if (this.ref?.instance?.reblog) {
      return new MastodonToStatusAdapter(
          new StatusInstance(this.ref?.instance?.reblog)
      );
    }
    return null;
  }

  isReposted(): boolean {
    return this.ref?.instance?.reblog !== null;
  }

  getMediaAttachments() {
    return this.ref?.instance?.mediaAttachments.map((o) => {
      return new MediaAttachmentToMediaAttachmentAdapter(
          new MediaAttachmentInstance(o)
      );
    });
  }

  getContent(): string | null {
    return this.ref?.instance?.content;
  }

  print(): void {
    console.log(this.ref.instance);
  }

  getAccountId_Poster(): string {
    return this?.ref?.instance?.account?.id;
  }
}

export class UnknownToStatusAdapter implements StatusInterface {
  getIsBookmarked() {
    return false
  }

  getRepliesCount(): number {
    return -1;
  }

  isValid() {
    return false
  }

  getId(): string {
    return "";
  }

  getRepostsCount(): number {
    return -1;
  }

  getFavouritesCount(): number {
    return -1;
  }

  getUsername() {
    return "";
  }

  getDisplayName() {
    return "";
  }

  getAvatarUrl() {
    return "";
  }

  getCreatedAt() {
    return new Date().toString();
  }

  getVisibility() {
    return "";
  }

  getAccountUrl() {
    return "";
  }

  getRepostedStatus(): StatusInterface | null | undefined {
    return null;
  }

  isReposted() {
    return false;
  }

  getContent() {
    return "";
  }

  getMediaAttachments() {
    return [];
  }

  print() {
    console.log("Unknown status type");
  }

  getAccountId_Poster(): string {
    return "";
  }
}
