export interface UserProfileInterface {
  getAvatarBlurHash(): string;
  getAvatarUrl(): string;
  getBannerUrl(): string | null
  getBannerBlurHash(): string | null
  getDescription(): string | null
  getCreatedAt(): Date
  getBirthday(): Date | null
  getFields(): any[]

  getFollowersCount(): number
  getFollowingCount(): number

  hasPendingFollowRequestFromYou(): boolean
  hasPendingFollowRequestToYou(): boolean

  getId(): string

  getIsBot(): boolean
  getDispalyName(): string
  getPostCount(): number
  getUsername(): string

  getOnlineStatus(): "online" | "active" | "offline" | "unknown"
}