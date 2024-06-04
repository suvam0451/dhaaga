import {Realm} from "@realm/react";
import {
  ActivityPubCustomEmojiItem,
  ActivityPubCustomEmojiItemDTO
} from "../entities/activitypub-emoji.entity";
import {ActivityPubServer} from "../entities/activitypub-server.entity";
import {
  ActivityPubCustomEmojiCategoryRepository
} from "./activitypub-emoji-category.repo";
import {UpdateMode} from "realm";

export class ActivityPubCustomEmojiRepository {
  static clearAll(db: Realm) {
    db.delete(db.objects(ActivityPubCustomEmojiItem))
  }

  /**
   * Upserts emoji item and appends it to it's category
   * @param db
   * @param item
   * @param server
   */
  static upsert(db: Realm, item: ActivityPubCustomEmojiItemDTO, server: ActivityPubServer) {
    const conflict = this.search(db, item.shortcode, server.url)
    const savedEmojiItem = db.create(ActivityPubCustomEmojiItem, {
      _id: conflict?._id || new Realm.BSON.UUID(),
      shortcode: item.shortcode,
      aliases: item.aliases,
      url: item.url,
      staticUrl: item.staticUrl,
      visibleInPicker: item.visibleInPicker,
      server,
    }, UpdateMode.Modified)

    const category = ActivityPubCustomEmojiCategoryRepository.upsert(db, item.category)
    category.emojis.push(savedEmojiItem)
  }

  static search(db: Realm, shortcode: string, instance: string) {
    return db.objects(ActivityPubCustomEmojiItem).find((o) =>
        o.shortcode === shortcode && o.server?.url === instance)
  }
}