import ActivityPubService from "./activitypub.service";
import Realm from "realm"
import {MMKV} from "react-native-mmkv";
import globalMmkvCacheServices from "./globalMmkvCache.services";
import {formatRelative} from "date-fns";

export type EmojiAdapter = {
  // common
  identifier: string;
  url: string;
  staticUrl: string;
  visibleInPicker: boolean;
  // misskey
  aliases?: string;
  category?: string;
};

export class EmojiService {
  /**
   * Update the emoji raw cache everyday
   * @param db
   * @param globalDb
   * @param subdomain
   * @returns
   */
  static async resolveEmojis(db: Realm, globalDb: MMKV, subdomain: string) {
    const found = globalMmkvCacheServices.getEmojiCacheForInstance(globalDb, subdomain)
    if (found) {
      console.log("[INFO]: found cached emojis:", subdomain, found.data.length,
          formatRelative(found.lastFetchedAt, new Date()))
      return found.data
    }
    // GlobalMmkvCacheService
    const emojis = await ActivityPubService.fetchEmojis(subdomain)
    if (!emojis) return
    globalMmkvCacheServices.saveEmojiCacheForInstance(globalDb, subdomain, emojis)
    console.log("[INFO]: fetched emojis for:", subdomain, emojis.length)
  }
}
