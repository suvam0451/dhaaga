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


export type RestClientCreateDTO = {
  instance: string;
  token: string;
};

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

  getUserPosts(userId: string, opts: GetUserPostsQueryDTO): Promise<mastodon.v1.Status[] | Note[]>;

  getBookmarks(): Promise<mastodon.v1.Status[] | Note[]>;

  getFollowedTags(): Promise<mastodon.v1.Tag[] | any[]>;

  /** Status */
  getStatus(id: string): Promise<mastodon.v1.Status | Note>

  bookmark(id: string): Promise<mastodon.v1.Status | Note | null>

  unBookmark(id: string): Promise<mastodon.v1.Status | Note | null>

  favourite(id: string): Promise<mastodon.v1.Status | Note | null>

  unFavourite(id: string): Promise<mastodon.v1.Status | Note | null>
}


export default ActivityPubClient