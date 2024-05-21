import {StatusInterface} from "./_interface";
import {NoteInstance} from "./unique";
import {DriveFile} from "@dhaaga/shared-provider-misskey/src";
import {DriveFileToMediaAttachmentAdapter} from "../media-attachment/adapter";
import {DriveFileInstance} from "../media-attachment/unique";

class MisskeyToStatusAdapter implements StatusInterface {
  ref: NoteInstance;

  constructor(ref: NoteInstance) {
    this.ref = ref;
  }

  isReply(): boolean {
    return false
  }

  getParentStatusId(): string | null | undefined {
    return null
  }

  getUserIdParentStatusUserId(): string | null | undefined {
    return null
  }

  getRepostedStatusRaw = () => this.ref?.instance?.renote

  getIsBookmarked(): boolean {
    return false
  }

  isValid() {
    return this.ref?.instance !== undefined && this.ref?.instance !== null;
  }

  getId = () => this.ref?.instance?.id;
  getRepliesCount = () => this.ref?.instance?.repliesCount;
  getRepostsCount = () => this.ref?.instance?.renoteCount;
  getFavouritesCount = () => -1;
  getUsername = () => this.ref?.instance?.user.username;
  getDisplayName = () => this.ref?.instance?.user.name;
  getAvatarUrl = () => this.ref?.instance?.user.avatarUrl;
  getCreatedAt = () => this.ref?.instance?.createdAt || new Date().toString();

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
      ) as unknown as StatusInterface;
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

export default MisskeyToStatusAdapter