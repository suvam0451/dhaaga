import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {Note, UserDetailed} from "@dhaaga/shared-provider-misskey/src";


export type TimelineQuery = {
  maxId?: string;
  minId?: string;
};


export type GetUserPostsQueryDTO = {
  limit: number,
  maxId?: string,
  excludeReplies: boolean
}

export type GetUserFavouritedPostQueryDTO = {
  limit: number,
  sinceId?: string,
  min_id?: string,
  maxId?: string,
}


export type GetSearchResultQueryDTO = {
  type: "accounts" | "hashtags" | "statuses" | null | undefined
  following: boolean
}

export type RestClientCreateDTO = {
  instance: string;
  token: string;
};

export type Status = mastodon.v1.Status | Note | null
export type StatusArray = Status[]


/**
 * What common functionalities do we want to support
 * across all ActivityPub based clients
 */
interface ActivityPubClient {
  getHomeTimeline(): Promise<mastodon.v1.Status[] | Note[]>;

  getTimelineByHashtag(
      q: string,
      query?: TimelineQuery
  ): Promise<mastodon.v1.Status[] | Note[]>;

  /** User */
  getUserProfile(username: string): Promise<mastodon.v1.Account | UserDetailed>;

  getFavourites(opts: GetUserFavouritedPostQueryDTO): Promise<StatusArray>

  getUserPosts(userId: string, opts: GetUserPostsQueryDTO): Promise<StatusArray>;

  getBookmarks(opts: GetUserFavouritedPostQueryDTO): Promise<StatusArray>;

  getFollowedTags(): Promise<mastodon.v1.Tag[] | any[]>;

  /** Status */
  getStatus(id: string): Promise<Status>

  bookmark(id: string): Promise<Status>

  unBookmark(id: string): Promise<Status>

  favourite(id: string): Promise<Status>

  unFavourite(id: string): Promise<Status>

  search(q: string, dto: GetSearchResultQueryDTO): Promise<{
    accounts: [],
    hashtags: []
  }>
}


export default ActivityPubClient