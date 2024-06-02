import type {MMKV} from "react-native-mmkv";

export type BottomSheetProp_HashtagType = {
  name: string, remoteInstance: string
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
}

export default GlobalMmkvCacheService