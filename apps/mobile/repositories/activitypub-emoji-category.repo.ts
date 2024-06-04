import {Realm} from "@realm/react";
import {
  ActivityPubCustomEmojiCategory
} from "../entities/activitypub-emoji-category.entity";
import {UpdateMode} from "realm";
import {ActivityPubCustomEmojiItem} from "../entities/activitypub-emoji.entity";

export class ActivityPubCustomEmojiCategoryRepository {
  static clearAll(db: Realm) {
    db.delete(db.objects(ActivityPubCustomEmojiCategory))
  }

  static pushEmoji(db: Realm, target: ActivityPubCustomEmojiCategory, emoji: ActivityPubCustomEmojiItem) {
    const conflict = target.emojis.find((o) => o._id.toString() === emoji._id.toString())
    if (!conflict) {
      target.emojis.push(emoji)
    }
  }


  static pushEmojis(db: Realm, target: ActivityPubCustomEmojiCategory, emojis: ActivityPubCustomEmojiCategory[]) {

  }

  static addCategories(db: Realm, items: string[]) {
    for (let i = 0; i < items.length; i++) {
      const category = items[i]
      const conflict = this.search(db, category)
      db.create(ActivityPubCustomEmojiCategory, {
        _id: conflict?._id || new Realm.BSON.UUID(),
        name: category,
      }, UpdateMode.Modified)
    }
  }

  static upsert(db: Realm, category: string) {
    const conflict = this.search(db, category)

    return db.create(ActivityPubCustomEmojiCategory, {
      _id: conflict?._id || new Realm.BSON.UUID(),
      name: category
    }, UpdateMode.Modified)
  }

  static search(db: Realm, category: string) {
    return db.objects(ActivityPubCustomEmojiCategory).find((o) => o.name === category)
  }
}