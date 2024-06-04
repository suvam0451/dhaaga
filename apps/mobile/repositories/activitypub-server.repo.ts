import {ActivityPubServer} from "../entities/activitypub-server.entity";
import {Realm} from "@realm/react"
import {ActivityPubCustomEmojiItem} from "../entities/activitypub-emoji.entity";

export class ActivityPubServerRepository {
  /**
   * add an ActivityPub server to list of known servers
   */
  static upsert(db: Realm, url: string) {
    if(!url) return null
    const removeHttps = url.replace(/^https?:\/\//, '');

    const match = db.objects(ActivityPubServer)
        .find((o) => o.url === removeHttps)

    if (!match) {
      return db.create(ActivityPubServer, {
        _id: new Realm.BSON.UUID(),
        url: removeHttps,
        description: "N/A",
        type: "Mastodon"
      })
    }
    return match
  }

  static addEmoji(db: Realm, emoji: ActivityPubCustomEmojiItem, server: ActivityPubServer) {
    const _server = this.upsert(db, server.url)
    if (!_server.emojis.find((o) => o.shortcode === emoji.shortcode)) {
      _server.emojis.push(emoji)
    }
  }

  static get(db: Realm, url: string) {
    return db.objects(ActivityPubServer)
        .find((o) => o.url === url)
  }
}