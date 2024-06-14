import type {mastodon} from "masto";
import axios from "axios";
import {RestClient} from "../../native-client";
import applyCaseMiddleware from "axios-case-converter";

export type TimelinePostsQuery = {
  limit: number
  offset?: number
};

class TrendsService {
  private static buildQueryUrl(client: RestClient, opts: TimelinePostsQuery, path: string) {
    let queryUrl = `https://${client.url}/api/v1/trends/${path}`;
    queryUrl = queryUrl.concat(`?limit=${opts?.limit || 5}`);
    if (opts?.offset)
      queryUrl = queryUrl.concat(`&offset=${opts?.offset}`);
    return queryUrl
  }

  static async getTrendingPosts(client: RestClient, opts: TimelinePostsQuery): Promise<mastodon.v1.Status[]> {
    try {
      const axiosClient = applyCaseMiddleware(axios.create());
      const resp = await axiosClient.get<mastodon.v1.Status[]>(this.buildQueryUrl(client, opts, "statuses"))
      return resp.data
    } catch (e) {
      return []
    }
  }

  static async getTrendingTags(client: RestClient, opts: TimelinePostsQuery): Promise<mastodon.v1.Tag[]> {
    try {
      const axiosClient = applyCaseMiddleware(axios.create());
      const resp = await axiosClient.get<mastodon.v1.Tag[]>(this.buildQueryUrl(client, opts, "tags"))
      return resp.data
    } catch (e) {
      return []
    }
  }

  static async getTrendingLinks(client: RestClient, opts: TimelinePostsQuery): Promise<mastodon.v1.TrendLink[]> {
    try {
      const axiosClient = applyCaseMiddleware(axios.create());
      const resp = await axiosClient.get<mastodon.v1.TrendLink[]>(this.buildQueryUrl(client, opts, "links"))
      return resp.data
    } catch (e) {
      return []
    }
  }
}

export default TrendsService