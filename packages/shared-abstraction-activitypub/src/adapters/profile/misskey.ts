import {
  EmojiMapValue,
  UserDetailedInstance,
  UserInterface
} from "./_interface";

export class MisskeyUser implements UserInterface {
  ref: UserDetailedInstance;

  constructor(ref: UserDetailedInstance) {
    this.ref = ref;
  }

  getIsLockedProfile(): boolean | null | undefined {
    return false
  }

  getAccountUrl(): string {
    return this.ref.instance.url || ""
  }

  getAppDisplayAccountUrl(myDomain: string): string {
    throw new Error("Method not implemented.");
  }

  getEmojiMap(): Map<string, EmojiMapValue> {
    return new Map()
  }

  findEmoji(q: string) {
    return undefined
  }

  isValid() {
    return this.ref?.instance !== undefined && this.ref?.instance !== null;
  }

  getUsername() {
    return this.ref?.instance?.username;
  }

  getAvatarBlurHash() {
    return this.ref?.instance?.avatarBlurhash;
  }

  getAvatarUrl() {
    return this.ref?.instance?.avatarUrl;
  }

  getBannerUrl() {
    return this.ref?.instance?.bannerUrl;
  }

  getBannerBlurHash() {
    return this.ref?.instance?.bannerBlurhash;
  }

  getDescription() {
    console.log(this?.ref?.instance);
    return this.ref?.instance?.description;
  }

  getCreatedAt() {
    return new Date(this.ref?.instance?.createdAt);
  }

  getBirthday() {
    return this.ref?.instance?.birthday
        ? new Date(this.ref?.instance?.birthday)
        : null;
  }

  getFields(): any[] {
    return this.ref?.instance?.fields;
  }

  getFollowersCount() {
    return this.ref?.instance?.followersCount;
  }

  getFollowingCount() {
    return this.ref?.instance?.followingCount;
  }

  hasPendingFollowRequestFromYou() {
    return this.ref?.instance?.hasPendingFollowRequestFromYou;
  }

  hasPendingFollowRequestToYou() {
    return this.ref?.instance?.hasPendingFollowRequestToYou;
  }

  getIsBot() {
    return this.ref?.instance?.isBot;
  }

  getPostCount() {
    return this.ref?.instance?.notesCount;
  }

  getOnlineStatus() {
    return this.ref?.instance?.onlineStatus;
  }

  getId() {
    return this.ref?.instance?.id;
  }

  getDisplayName() {
    return this.ref?.instance?.name;
  }
}

export default MisskeyUser