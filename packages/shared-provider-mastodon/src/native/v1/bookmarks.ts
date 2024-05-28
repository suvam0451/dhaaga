import applyCaseMiddleware from "axios-case-converter";
import {RestClient} from "../../native-client";
import axios from "axios";
import type {mastodon} from "masto";

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
    let queryUrl = `${client.url}/api/v1/bookmarks`;
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

      const linkHeader = res.headers["link"]
      const maxIdRegex = /max_id=([0-9]+)/
      const minIdRegex = /min_id=([0-9]+)/

      let maxId = null
      let minId = null
      if (minIdRegex.test(linkHeader)) {
        const minMatch = linkHeader.match(minIdRegex)
        console.log(minMatch)
        minId = minMatch[1]
      }
      if (maxIdRegex.test(linkHeader)) {
        const maxMatch = linkHeader.match(maxIdRegex)
        console.log(maxMatch)
        maxId = maxMatch[1]
      }
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