import ActivityPubClient, {
  GetPostsQueryDTO,
  GetSearchResultQueryDTO,
  GetTimelineQueryDTO,
  GetTrendingPostsQueryDTO,
  GetUserPostsQueryDTO, MediaUploadDTO,
  RestClientCreateDTO,
  TimelineQuery,
} from "./_interface";
import {
  mastodon,
  RestClient,
  RestServices
} from "@dhaaga/shared-provider-mastodon/src";
import {createRestAPIClient} from "masto";
import {Note} from "@dhaaga/shared-provider-misskey/src";
import {StatusArray} from "../status/_interface";

class MastodonRestClient implements ActivityPubClient {
  client: RestClient;

  constructor(dto: RestClientCreateDTO) {
    this.client = new RestClient(dto.instance, {
          accessToken: dto.token,
          domain: "mastodon"
        }
    );
  }

  async getPublicTimelineAsGuest(opts?: GetTimelineQueryDTO | undefined): Promise<StatusArray> {
    const _client = this.createPublicClient()
    try {
      return await _client.v1.timelines.public.list(opts)
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async getPublicTimeline(opts?: GetTimelineQueryDTO | undefined): Promise<StatusArray> {
    const _client = this.createClient()
    try {
      return await _client.v1.timelines.public.list(opts)
    } catch (e) {
      console.log(e)
      return []
    }
  }

  getIsSensitive(): boolean {
    throw new Error("Method not implemented.");
  }

  getSpoilerText(): string | null {
    throw new Error("Method not implemented.");
  }

  async uploadMedia(params: MediaUploadDTO): Promise<any> {
    const _client = this.createClient()
    try {
      return await _client.v2.media.create(params)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getFollowing(id: string) {
    const _client = this.createClient()
    try {
      return await _client.v1.accounts.$select(id).following.list()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getFollowers(id: string) {
    const _client = this.createClient()
    try {
      return await _client.v1.accounts.$select(id).followers.list()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getMe() {
    const _client = this.createClient()
    try {
      return await _client.v1.accounts.verifyCredentials()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getMyConversations() {
    const _client = this.createClient()
    try {
      return await _client.v1.conversations.list()
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async getStatusContext(id: string) {
    const _client = this.createClient()
    try {
      return await _client.v1.statuses.$select(id).context.fetch()
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async getRelationshipWith(ids: string[]) {
    const _client = this.createClient()
    try {
      return await _client.v1.accounts.relationships.fetch({id: ids})
    } catch (e) {
      console.log(e)
      return []
    }
  }

  async getTrendingPosts(opts: GetTrendingPostsQueryDTO) {
    return await RestServices.v1.trends.getTrendingPosts(this.client, opts);
  }

  async getTrendingTags(opts: GetTrendingPostsQueryDTO) {
    return await RestServices.v1.trends.getTrendingTags(this.client, opts);
  }

  async getTrendingLinks(opts: GetTrendingPostsQueryDTO) {
    return await RestServices.v1.trends.getTrendingLinks(this.client, opts);
  }

  async followTag(id: string) {
    const _client = this.createClient()
    try {
      return await _client.v1.tags.$select(id).follow()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async unfollowTag(id: string) {
    const _client = this.createClient()
    try {
      return await _client.v1.tags.$select(id).unfollow()
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getTag(id: string) {
    const _client = this.createPublicClient()
    try {
      console.log("started fetching tag", id, _client)
      const data = await _client.v1.tags.$select(id).fetch()
      console.log(data)
      return data
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async muteUser(id: string) {
    const _client = this.createClient()
    try {
      await _client.v1.accounts.$select(id).mute()
      return
    } catch (e) {
      console.log(e)
      return
    }
  }

  async search(q: string, dto: GetSearchResultQueryDTO): Promise<any> {
    const _client = this.createClient()
    try {
      return await _client.v2.search.list({
        q,
        type: dto.type,
        following: dto.following,
        limit: dto.limit,
        maxId: dto.maxId
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

  createPublicClient() {
    return createRestAPIClient({
      url: this.client.url,
    })
  }


  async getFavourites(opts: GetPostsQueryDTO): Promise<StatusArray> {
    const _client = this.createClient()
    try {
      return await _client.v1.favourites.list()
    } catch (e) {
      console.log(e)
      return []
    }
  }


  async getBookmarks(opts: GetPostsQueryDTO) {
    return await RestServices.v1.bookmarks.getBookmarks(this.client, opts);
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

  async getHomeTimeline(opts?: GetPostsQueryDTO): Promise<mastodon.v1.Status[]> {
    try {
      const _client = createRestAPIClient({
        url: this.client.url,
        accessToken: this.client.accessToken
      })

      return await _client.v1.timelines.home.list({
        limit: 5,
        maxId: opts?.maxId
      })
    } catch (e) {
      return []
    }
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

  async getTimelineByHashtag(q: string, query?: TimelineQuery) {
    try {
      const _client = createRestAPIClient({
        url: this.client.url,
        accessToken: this.client.accessToken
      })
      return await _client.v1.timelines.tag.$select(q).list({
        ...query,
        limit: 5
      })
    } catch (e) {
      console.log(e)
      return []
    }
  }


  async getUserProfile(userId: string): Promise<mastodon.v1.Account> {
    return RestServices.v1.accounts.getByUserId(this.client, userId)
  }

  async getStatus(id: string): Promise<mastodon.v1.Status> {
    return RestServices.v1.statuses.getStatus(this.client, id)
  }
}

export default MastodonRestClient;