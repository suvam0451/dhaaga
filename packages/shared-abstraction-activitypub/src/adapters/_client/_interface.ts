import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {UserDetailed} from "@dhaaga/shared-provider-misskey/src";
import {Status, StatusArray} from "../status/_interface";


export type TimelineQuery = {
  maxId?: string;
  minId?: string;
};


export type GetUserPostsQueryDTO = {
  limit: number,
  maxId?: string,
  excludeReplies: boolean
}

export type GetPostsQueryDTO = {
  limit: number,
  sinceId?: string,
  minId?: string,
  maxId?: string,
}

export type GetTrendingPostsQueryDTO = {
  limit: number,
  offset?: number
}


export type GetSearchResultQueryDTO = {
  type: "accounts" | "hashtags" | "statuses" | null | undefined
  following: boolean,
  limit: number,
  maxId?: string,
}

export type RestClientCreateDTO = {
  instance: string;
  token: string;
};

export type Tag = mastodon.v1.Tag | null | undefined
export type TagArray = mastodon.v1.Tag[] | []

export type TrendLinkArray = mastodon.v1.TrendLink[] | []

/**
 * What common functionalities do we want to support
 * across all ActivityPub based clients
 */
interface ActivityPubClient {
  getHomeTimeline(opts?: GetPostsQueryDTO): Promise<StatusArray>;

  getTimelineByHashtag(
      q: string,
      query?: TimelineQuery
  ): Promise<StatusArray>;

  /** User */
  getUserProfile(username: string): Promise<mastodon.v1.Account | UserDetailed>;

  getFavourites(opts: GetPostsQueryDTO): Promise<StatusArray>

  getUserPosts(userId: string, opts: GetUserPostsQueryDTO): Promise<StatusArray>;

  getBookmarks(opts: GetPostsQueryDTO): Promise<StatusArray>;

  getRelationshipWith(ids: string[]): Promise<mastodon.v1.Relationship[]>

  /**
   * Trending
   */
  getTrendingPosts(opts: GetTrendingPostsQueryDTO): Promise<StatusArray>

  getTrendingTags(opts: GetTrendingPostsQueryDTO): Promise<TagArray>

  getTrendingLinks(opts: GetTrendingPostsQueryDTO): Promise<TrendLinkArray>

  /**
   * Tags
   */
  getTag(id: string): Promise<mastodon.v1.Tag | null>

  followTag(id: string): Promise<mastodon.v1.Tag | null>

  unfollowTag(id: string): Promise<mastodon.v1.Tag | null>


  getFollowedTags(): Promise<mastodon.v1.Tag[] | any[]>;

  muteUser(id: string): Promise<void>;

  /** Status */
  getStatus(id: string): Promise<Status>

  bookmark(id: string): Promise<Status>

  // https://mastodon.social/api/v1/statuses/:id/context
  // mastodon specific
  // getStatusContext(id: string): Promise<any>

  unBookmark(id: string): Promise<Status>

  favourite(id: string): Promise<Status>

  unFavourite(id: string): Promise<Status>

  search(q: string, dto: GetSearchResultQueryDTO): Promise<{
    accounts: [],
    hashtags: []
  }>
}


export default ActivityPubClient