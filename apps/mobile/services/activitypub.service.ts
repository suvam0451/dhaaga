import axios from "axios";
import {
  ActivityPubCustomEmojiItemDTO
} from "../entities/activitypub-emoji.entity";

class ActivityPubService {
  /**
   * Try fetching custom emojis
   *
   * Supported: Mastodon/Misskey API Spec
   * @param instance
   */
  static async fetchEmojis(instance: string): Promise<ActivityPubCustomEmojiItemDTO[] | null> {

    // Mastodon strategy
    return axios.get(`https://${instance}/api/v2/instance`).then(async (res) => {
      try {
        const emojisRes = await axios.get(`https://${instance}/api/v1/custom_emojis`);
        return emojisRes.data.map((o) => ({
          shortcode: o.shortcode,
          url: o.url,
          staticUrl: o.static_url,
          visibleInPicker: o.visible_in_picker,
          category: o.category
        }))
      } catch (e) {
        console.log("[INFO]: failed to fetch emojis, using mastodon schema")
        return null
      }
    }).catch(async (e) => {
      // Misskey strategy
      console.log("[INFO]: not a mastodon server. trying misskey.")
      try {
        // NOT: needs http
        let res = await axios.get(`https://${instance}/api/emojis`);

        return res.data.emojis.map((o) => ({
          shortcode: o.name,
          url: o.url,
          staticUrl: o.url,
          visibleInPicker: true,
          category: o.category,
          aliases: o.aliases
        }))
      } catch (e1) {
        /**
         * NOTE: known instance which fall through to this stage are:
         *
         * - Pleroma -- api/v1/pleroma/emoji -- Uses KV map
         */
        console.log("[INFO]: failed emoji fetch. tried misskey schema", instance, e1)
        return null
      }
    })
  }
}

export default ActivityPubService;