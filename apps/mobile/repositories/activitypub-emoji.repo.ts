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
import {
  ActivityPubCustomEmojiCategory
} from "../entities/activitypub-emoji-category.entity";
import {ActivityPubServerRepository} from "./activitypub-server.repo";

export class ActivityPubCustomEmojiRepository {
  static clearAll(db: Realm) {
    db.delete(db.objects(ActivityPubCustomEmojiItem))
  }

  static upsertMany(db: Realm, items: ActivityPubCustomEmojiItemDTO[], server: ActivityPubServer) {
    for (let i = 0; i < items.length; i++) {
      this.upsert(db, items[i], server);
    }
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

    if (item.category) {
      const category = ActivityPubCustomEmojiCategoryRepository.upsert(db, item.category)
      ActivityPubCustomEmojiCategoryRepository.pushEmoji(db, category, savedEmojiItem)
    } else {
      const categoryNotFound = ActivityPubCustomEmojiCategoryRepository.upsert(db, "Category:404")
      ActivityPubCustomEmojiCategoryRepository.pushEmoji(db, categoryNotFound, savedEmojiItem)
    }
    ActivityPubServerRepository.addEmoji(db, savedEmojiItem, server)
  }

  static search(db: Realm, shortcode: string, instance: string) {
    const server = ActivityPubServerRepository.get(db, instance)
    return server?.emojis?.find((o) => o.shortcode === shortcode)
  }
}