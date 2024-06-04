import type {MMKV} from "react-native-mmkv";
import {
  ActivityPubCustomEmojiItemDTO
} from "../entities/activitypub-emoji.entity";

export type BottomSheetProp_HashtagType = {
  name: string, remoteInstance: string
}

export type BottomSheetProp_LinkType = {
  url: string,
  displayName: string
}

class GlobalMmkvCacheService {
  private static set(db: MMKV, key: string, value: any) {
    db.set(key, value)
  }

  private static get(db: MMKV, key: string) {
    return db.getString(key)
  }

  static setBottomSheetProp_Hashtag(db: MMKV, dto: BottomSheetProp_HashtagType) {
    this.set(db, "bs/hashtag", JSON.stringify(dto))
  }

  static getBottomSheetProp_Hashtag(db: MMKV):
      BottomSheetProp_HashtagType | null {
    const res = this.get(db, "bs/hashtag")
    if (!res) return null
    return JSON.parse(res)
  }

  static setBottomSheetProp_Link(db: MMKV, dto: BottomSheetProp_LinkType) {
    this.set(db, "global-prop/bottom-sheet/link", JSON.stringify(dto))
  }

  static getBottomSheetProp_Link(db: MMKV): BottomSheetProp_LinkType {
    const res = this.get(db, "global-prop/bottom-sheet/link")
    if (!res) return null
    return JSON.parse(res)
  }

  static saveEmojiCacheForInstance(db: MMKV, instance: string, items: ActivityPubCustomEmojiItemDTO[]) {
    this.set(db, `emojis/${instance}`, JSON.stringify({
      data: items,
      lastFetchedAt: new Date()
    }))
    return items
  }

  static getEmojiCacheForInstance(db: MMKV, instance: string): {
    data: ActivityPubCustomEmojiItemDTO[],
    lastFetchedAt: Date
  } | null {
    const res = this.get(db, `emojis/${instance}`)
    if (!res) return null
    return JSON.parse(res)
  }
}

export default GlobalMmkvCacheService