import type {mastodon} from "masto";
import {RestClient} from "../../native-client";
import axios from "axios";
import {get} from "./lib";
import {StatusQuery} from "./bookmarks";
import {
  buildQueryUrl,
  extractPaginationFromLinkHeader,
  getAxiosClient
} from "./_common";

class AccountsService {
  static verifyCredentials = async (
      client: RestClient
  ): Promise<mastodon.v1.AccountCredentials> => {
    const res = await axios.get<mastodon.v1.AccountCredentials>(
        `https://${client.url}/api/v1/accounts/verify_credentials`,
        {
          headers: {
            Authorization: `Bearer ${client.accessToken}`,
          },
        }
    );
    return res.data;
  };

  static getByUserId = async (client: RestClient, id: number | string): Promise<mastodon.v1.Account> => {
    return await get<mastodon.v1.Account>(
        `https://${client.url}/api/v1/accounts/${id}`,
        client.accessToken);
  }

  static getStatuses = async (client: RestClient, accountId: string, {
    maxId, limit = 20, excludeReplies = false
  }: {
    maxId?: string,
    limit: number,
    excludeReplies: boolean
  }): Promise<mastodon.v1.Status[]> => {
    let url = `https://${client.url}/api/v1/accounts/${accountId}/statuses?limit=${limit}&exclude_replies=${excludeReplies}`;
    if (maxId)
      url += `max_id=${maxId}`;

    return await get<mastodon.v1.Status[]>(url, client.accessToken);
  }

  static getFollowedTags = async (
      client: RestClient,
      query?: StatusQuery): Promise<{
    data: mastodon.v1.Tag[],
    minId?: string,
    maxId?: string
  }> => {
    let queryUrl = buildQueryUrl(`https://${client.url}/api/v1/followed_tags`, query);
    const axiosClient = getAxiosClient()
    try {
      const res = await axiosClient.get<mastodon.v1.Tag[]>(queryUrl, {
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

export default AccountsService