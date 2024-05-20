import ActivityPubClient, {
  GetSearchResultQueryDTO,
  GetUserFavouritedPostQueryDTO,
  GetUserPostsQueryDTO,
  RestClientCreateDTO,
  StatusArray
} from "./_interface";
import {
  mastodon,
  RestClient,
  RestServices
} from "@dhaaga/shared-provider-mastodon/src";
import {createRestAPIClient} from "masto";
import {Note} from "@dhaaga/shared-provider-misskey/src";

class MastodonRestClient implements ActivityPubClient {
  client: RestClient;

  constructor(dto: RestClientCreateDTO) {
    this.client = new RestClient(dto.instance, {
          accessToken: dto.token,
          domain: "mastodon"
        }
    );
  }

  async search(q: string, dto: GetSearchResultQueryDTO): Promise<any> {
    const _client = this.createClient()
    try {
      return await _client.v2.search.list({
        q,
        type: dto.type,
        following: dto.following,
      })
    } catch (e) {
      console.log(e)
      return []
    }
  }


  createClient() {
    return createRestAPIClient({
      url: this.client.url,
      accessToken: this.client.accessToken
    })
  }


  async getFavourites(opts: GetUserFavouritedPostQueryDTO): Promise<StatusArray> {
    const _client = this.createClient()
    try {
      return await _client.v1.favourites.list()
    } catch (e) {
      console.log(e)
      return []
    }
  }


  async getBookmarks() {
    const _client = this.createClient()
    try {
      return await _client.v1.bookmarks.list()
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async getFollowedTags() {
    const _client = this.createClient()
    try {
      return await _client.v1.followedTags.list()
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async favourite(id: string) {
    const _client = this.createClient()
    try {
      return await _client.v1.statuses.$select(id.toString()).favourite()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async unFavourite(id: string) {
    const _client = this.createClient()
    try {
      return await _client.v1.statuses.$select(id.toString()).unfavourite()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getUserPosts(userId: string, opts: GetUserPostsQueryDTO): Promise<Note[] | mastodon.v1.Status[]> {
    return await RestServices.v1.accounts.getStatuses(this.client, userId, opts);
  }

  async getHomeTimeline(): Promise<mastodon.v1.Status[]> {
    return await RestServices.v1.timelines.getHomeTimeline(
        this.client
    );
  }

  async bookmark(id: string) {
    try {
      const _client = createRestAPIClient({
        url: this.client.url,
        accessToken: this.client.accessToken
      })

      return await _client.v1.statuses.$select(id.toString()).bookmark()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async unBookmark(id: string) {
    try {
      const _client = createRestAPIClient({
        url: this.client.url,
        accessToken: this.client.accessToken
      })
      return await _client.v1.statuses.$select(id.toString()).unbookmark()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getTimelineByHashtag(q: string): Promise<mastodon.v1.Status[]> {
    return RestServices.v1.timelines.getTimelineByHashtag(
        this.client,
        q
    );
  }


  async getUserProfile(userId: string): Promise<mastodon.v1.Account> {
    return RestServices.v1.accounts.getByUserId(this.client, userId)
  }

  async getStatus(id: string): Promise<mastodon.v1.Status> {
    return RestServices.v1.statuses.getStatus(this.client, id)
  }
}

export default MastodonRestClient;