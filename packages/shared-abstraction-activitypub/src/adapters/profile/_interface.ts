import type {UserDetailed} from "@dhaaga/shared-provider-misskey/src";
import type {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import MisskeyUser from "./misskey";
import MastodonUser from "./mastodon";
import DefaultUser from "./default";

export interface UserInterface {
  getAvatarBlurHash(): string | null | undefined;

  getAvatarUrl(): string | null | undefined;

  getBannerUrl(): string | null

  getBannerBlurHash(): string | null

  getDescription(): string | null

  getCreatedAt(): Date

  getBirthday(): Date | null

  getFields(): any[]

  getFollowersCount(): number

  getFollowingCount(): number

  hasPendingFollowRequestFromYou(): boolean | null | undefined

  hasPendingFollowRequestToYou(): boolean | null | undefined

  getId(): string

  getIsBot(): boolean | undefined | null

  getDisplayName(): string | null

  getPostCount(): number

  getUsername(): string

  getOnlineStatus(): "online" | "active" | "offline" | "unknown"
}

export class UserDetailedInstance {
  instance: UserDetailed;

  constructor(instance: UserDetailed) {
    this.instance = instance;
  }
}

export class AccountInstance {
  instance: mastodon.v1.Account;

  constructor(instance: mastodon.v1.Account) {
    this.instance = instance;
  }
}

export function ActivityPubUserAdapter(
    profile: any,
    domain: string
): UserInterface {
  switch (domain) {
    case "misskey": {
      return new MisskeyUser(
          new UserDetailedInstance(profile as UserDetailed)
      );
    }
    case "mastodon": {
      return new MastodonUser(
          new AccountInstance(profile as mastodon.v1.Account)
      )
    }
    default: {
      return new DefaultUser();
    }
  }
}
