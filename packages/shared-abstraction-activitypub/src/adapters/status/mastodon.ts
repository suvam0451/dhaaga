import {StatusInterface} from "./_interface";
import {StatusInstance} from "./unique";
import {
  MediaAttachmentToMediaAttachmentAdapter
} from "../media-attachment/adapter";
import {MediaAttachmentInstance} from "../media-attachment/unique";

class MastodonToStatusAdapter implements StatusInterface {
  ref: StatusInstance;

  constructor(ref: StatusInstance) {
    this.ref = ref;
  }

  isReply() {
    return this?.ref?.instance?.inReplyToId !== "" && this?.ref?.instance?.inReplyToId !== null
        && this?.ref?.instance?.inReplyToId !== undefined
  }

  getParentStatusId() {
    return this?.ref?.instance?.inReplyToId
  }

  getUserIdParentStatusUserId() {
    return this?.ref?.instance?.inReplyToAccountId
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
    return this.ref?.instance?.account.username || "";
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

  getRepostedStatus() {
    if (this.ref?.instance?.reblog) {
      return new MastodonToStatusAdapter(
          new StatusInstance(this.ref?.instance?.reblog)
      ) as unknown as StatusInterface;
    }
    return null;
  }

  getRepostedStatusRaw = () => {
    return this.ref?.instance?.reblog
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

export default MastodonToStatusAdapter;