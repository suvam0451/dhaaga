import type {mastodon} from "masto";
import {RestClient} from "../../native-client";
import axios from "axios";
import {get} from "./lib";

class AccountsService {
  static verifyCredentials = async (
      client: RestClient
  ): Promise<mastodon.v1.AccountCredentials> => {
    const res = await axios.get<mastodon.v1.AccountCredentials>(
        `${client.url}/api/v1/accounts/verify_credentials`,
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
        `${client.url}/api/v1/accounts/${id}`,
        client.accessToken);
  }

  static getStatuses = async (client: RestClient, accountId: string, {
    maxId, limit = 20, excludeReplies = false
  }: {
    maxId?: string,
    limit: number,
    excludeReplies: boolean
  }): Promise<mastodon.v1.Status[]> => {
    let url = `${client.url}/api/v1/accounts/${accountId}/statuses?limit=${limit}&exclude_replies=${excludeReplies}`;
    if (maxId)
      url += `max_id=${maxId}`;

    return await get<mastodon.v1.Status[]>(url, client.accessToken);
  }
}

export default AccountsService