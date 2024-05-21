import {AccountInstance, UserInterface} from "./_interface";

class MastodonUser implements UserInterface {
  ref: AccountInstance;

  constructor(ref: AccountInstance) {
    this.ref = ref;
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
    console.log(this?.ref?.instance);
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