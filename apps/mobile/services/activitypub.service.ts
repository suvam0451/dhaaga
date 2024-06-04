import axios from "axios";
import {
  ActivityPubCustomEmojiItemDTO
} from "../entities/activitypub-emoji.entity";

class ActivityPubService {
  /**
   * Try fetching custom emojis
   *
   * Supported: Mastodon/Misskey API Spec
   * @param domain
   */
  static async fetchEmojis(domain: string): Promise<ActivityPubCustomEmojiItemDTO[] | null> {
    return axios.get(`${domain}/api/v2/instance`).then(async (res) => {
      try {
        await axios.get(`${domain}/api/v1/custom_emojis`);
        return res.data.map((o) => ({
          shortcode: o.shortcude,
          url: o.url,
          staticUrl: o.static_url,
          visibleInPicker: o.visible_in_picker,
          category: o.category
        }))
      } catch (e) {
        return null
      }
    }).catch(async (e) => {
      try {
        let res = await axios.get(`${domain}/api/emojis`);
        return res.data.map((o) => ({
          shortcode: o.name,
          url: o.url,
          staticUrl: o.url,
          visibleInPicker: true,
          category: o.category,
          aliases: o.aliases
        }))
      } catch (e1) {
        return null
      }
    })
  }
}

export default ActivityPubService;