import {UserDetailed} from "@dhaaga/shared-provider-misskey/src";
import {UserProfileInterface} from "./interface";
import {UserDetailedInstance, AccountInstance} from "./unique";

export class UserDetailedToUserProfileAdapter implements UserProfileInterface {
  ref: UserDetailedInstance;

  constructor(ref: UserDetailedInstance) {
    this.ref = ref;
  }

  isValid() {
    return this.ref?.instance !== undefined && this.ref?.instance !== null;
  }

  getUsername() {
    return this.ref?.instance?.username;
  }

  getAvatarBlurHash(): string {
    return this.ref?.instance?.avatarBlurhash;
  }

  getAvatarUrl(): string {
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

export class MastodonUserProfileAdapter implements UserProfileInterface {
  ref: AccountInstance;

  constructor(ref: AccountInstance) {
    this.ref = ref;
  }

  getAvatarBlurHash(): string {
    return this.ref?.instance?.avatarStatic;
  }

  getAvatarUrl(): string {
    return  this.ref?.instance?.avatar;
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