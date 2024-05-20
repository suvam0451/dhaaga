import ActivityPubClient, {
  GetSearchResultQueryDTO,
  GetUserFavouritedPostQueryDTO
} from "./_interface";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";

class UnknownRestClient implements ActivityPubClient {
  async search(q: string, dto: GetSearchResultQueryDTO): Promise<any> {
    return []
  }

  async getFavourites(opts: GetUserFavouritedPostQueryDTO) {
    return []
  }

  async getBookmarks(opts: GetUserFavouritedPostQueryDTO) {
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