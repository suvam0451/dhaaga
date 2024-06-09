import applyCaseMiddleware from "axios-case-converter";
import {RestClient} from "../../native-client";
import axios from "axios";
import type {mastodon} from "masto";
import {extractPaginationFromLinkHeader} from "./_common";

export type StatusQuery = {
  maxId?: string;
  minId?: string;
  sinceId?: string
  limit: number
};


export default class BookmarkService {
  static getBookmarks = async (
      client: RestClient,
      query?: StatusQuery): Promise<{
    data: mastodon.v1.Status[],
    minId?: string,
    maxId?: string
  }> => {
    let queryUrl = `https://${client.url}/api/v1/bookmarks`;
    queryUrl = queryUrl.concat(`?limit=${query.limit}`)
    if (query?.maxId) {
      queryUrl = queryUrl.concat(`&max_id=${query?.maxId}`);
    }
    if (query?.minId) {
      queryUrl = queryUrl.concat(`&min_id=${query?.minId}`);
    }

    const axiosClient = applyCaseMiddleware(axios.create());
    try {
      const res = await axiosClient.get<mastodon.v1.Status[]>(queryUrl, {
        headers: {
          Authorization: `Bearer ${client.accessToken}`,
        },
      });

      let {minId, maxId} = extractPaginationFromLinkHeader(res.headers)
      return {
        data: res.data,
        minId,
        maxId
      }
    } catch (e) {
      console.log(e);
      return {
        data: [],
      }
    }
  }
}