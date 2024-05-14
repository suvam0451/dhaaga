import {get} from "./lib";
import {createRestAPIClient, mastodon} from "masto";
import {RestClient} from "../../native-client";

class StatusService {
  static getStatus = async (client: RestClient, id: number | string): Promise<mastodon.v1.Status> => {
    return await get<mastodon.v1.Status>(
        `${client.url}/api/v1/statuses/${id}`,
        client.accessToken);
  }

  static getStatusContext = async (client: RestClient, id: number | string): Promise<mastodon.v1.Status> => {
    return await get<mastodon.v1.Status>(
        `${client.url}/api/v1/statuses/${id}/context`,
        client.accessToken);
  }

  static async bookmark(client: RestClient, id: number | string): Promise<mastodon.v1.Status> {
    try {
      const masto = createRestAPIClient({
        url: client.url,
        accessToken: client.accessToken
      })
      return await masto.v1.statuses.$select(id.toString()).bookmark()
    } catch (e) {
      console.log(e)
      return null
    }
  }
}

export default StatusService