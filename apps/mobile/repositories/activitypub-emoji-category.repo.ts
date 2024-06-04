import {Realm} from "@realm/react";
import {
  ActivityPubCustomEmojiCategory
} from "../entities/activitypub-emoji-category.entity";
import {UpdateMode} from "realm";

export class ActivityPubCustomEmojiCategoryRepository {
  static clearAll(db: Realm) {
    db.delete(db.objects(ActivityPubCustomEmojiCategory))
  }

  static pushEmojis(db: Realm, target: ActivityPubCustomEmojiCategory, emojis: ActivityPubCustomEmojiCategory[]) {

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