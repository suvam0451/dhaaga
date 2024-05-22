import {AccountInstance, EmojiMapValue, UserInterface} from "./_interface";

class MastodonUser implements UserInterface {
  ref: AccountInstance;
  mp: Map<string, EmojiMapValue>

  constructor(ref: AccountInstance, mp: Map<string, EmojiMapValue>) {
    this.ref = ref;
    this.mp = mp
  }

  getEmojiMap(): Map<string, EmojiMapValue> {
    return this.mp
  }

  findEmoji(q: string) {
    return this.mp.get(q)
  }

  getAvatarBlurHash(): string {
    return this.ref?.instance?.avatarStatic;
  }

  getAvatarUrl(): string {
    return this.ref?.instance?.avatar;
  }

  getBannerBlurHash(): string | null {
    return this?.ref?.instance?.headerStatic;
  }

  getBannerUrl(): string | null {
    return this?.ref?.instance?.header;
  }

  getBirthday(): Date | null {
    return null;
  }

  getCreatedAt(): Date {
    return new Date(this?.ref?.instance?.createdAt);
  }

  getDescription(): string | null {
    return this?.ref?.instance?.note;
  }

  getDisplayName(): string {
    return this?.ref?.instance?.displayName;
  }

  getFields(): any[] {
    return this?.ref?.instance?.fields;
  }

  getFollowersCount(): number {
    return this?.ref?.instance?.followersCount;
  }

  getFollowingCount(): number {
    return this?.ref?.instance?.followingCount;
  }

  getId(): string {
    return this?.ref?.instance?.id;
  }

  getIsBot(): boolean {
    return false;
  }

  getOnlineStatus(): "online" | "active" | "offline" | "unknown" {
    return "unknown";
  }

  getPostCount(): number {
    return 0;
  }

  getUsername(): string {
    return this?.ref?.instance?.username;
  }

  hasPendingFollowRequestFromYou(): boolean {
    return false;
  }

  hasPendingFollowRequestToYou(): boolean {
    return false;
  }
}

export default MastodonUser