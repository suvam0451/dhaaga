import ActivityPubClient, {
  GetUserPostsQueryDTO,
  RestClientCreateDTO
} from "./_interface";
import {
  createClient,
  misskeyApi,
  Note
} from "@dhaaga/shared-provider-misskey/src";
import axios, {AxiosInstance} from "axios";

class MisskeyRestClient implements ActivityPubClient {
  client: misskeyApi.APIClient;
  axiosClient: AxiosInstance;

  constructor(dto: RestClientCreateDTO) {
    this.client = createClient(dto.instance, dto.token);
    this.axiosClient = axios.create({
      baseURL: `${dto.instance}/api`,
    });
  }

  async getBookmarks() {
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

  async bookmark(id: string): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  async unBookmark(id: string): Promise<Note> {
    throw new Error("Method not implemented.");
  }

  async getUserPosts(userId: string, opts: GetUserPostsQueryDTO) {
    return this.client.request("users/notes", {
      userId: userId,
      limit: opts.limit,
    });
  }

  async getHomeTimeline(): Promise<Note[]> {
    return await this.client.request("notes/local-timeline", {limit: 20});
  }

  async getTimelineByHashtag(q: string): Promise<Note[]> {
    const res = await this.axiosClient.post<Note[]>("/notes/search-by-tag", {
      limit: 20,
      tag: q,
    });
    return res.data;
  }

  async getUserProfile(
      username: string
  ) {
    return this.client.request("users/show", {username});
  }

  async getStatus(id: string): Promise<Note> {
    throw new Error("Not Implemented")
  }
}

export default MisskeyRestClient;
