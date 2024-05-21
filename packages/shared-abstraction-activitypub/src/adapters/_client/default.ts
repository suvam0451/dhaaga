import ActivityPubClient, {
  GetSearchResultQueryDTO,
  GetPostsQueryDTO,
  TagArray
} from "./_interface";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";
import {StatusArray} from "../status/_interface";

class UnknownRestClient implements ActivityPubClient {
  getTrendingPosts(opts: GetPostsQueryDTO): Promise<StatusArray> {
      throw new Error("Method not implemented.");
  }
  getTrendingTags(): Promise<TagArray> {
      throw new Error("Method not implemented.");
  }
  getTrendingLinks(): Promise<any[]> {
      throw new Error("Method not implemented.");
  }
  async followTag(id: string) {
    return null
  }

  async unfollowTag(id: string) {
    return null
  }

  async getTag() {
    return null
  }

  async muteUser(id: string) {
    return
  }

  async search(q: string, dto: GetSearchResultQueryDTO): Promise<any> {
    return []
  }

  async getFavourites(opts: GetPostsQueryDTO) {
    return []
  }

  async getBookmarks(opts: GetPostsQueryDTO) {
    return []
  }

  async getFollowedTags() {
    return []
  }

  async favourite(id: string) {
    return null
  }

  async unFavourite(id: string) {
    return null
  }

  getUserPosts(): Promise<Note[] | mastodon.v1.Status[]> {
    throw new Error("Method not implemented.");
  }

  async bookmark(id: string): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  async unBookmark(id: string): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  async getHomeTimeline() {
    return [];
  }

  async getTimelineByHashtag(q: string) {
    return [];
  }

  async getUserProfile(username: string): Promise<mastodon.v1.Account> {
    throw new Error("Not Implemented")
  }

  async getStatus(id: string): Promise<Note> {
    throw new Error("Not Implemented")
  }
}

export default UnknownRestClient