import {ActivityPubServer} from "../entities/activitypub-server.entity";
import {Realm} from "@realm/react"

export class ActivityPubServerRepository {
  /**
   * add an ActivityPub server to list of known servers
   */
  static upsert(db: Realm, url: string) {
    const match = db.objects(ActivityPubServer)
        .find((o) => o.url === url)

    if (!match) {
      return db.create(ActivityPubServer, {
        _id: new Realm.BSON.UUID(),
        url,
        description: "N/A",
        type: "Mastodon"
      })
    }
    return match
  }

  static get(db: Realm, url: string) {
    return db.objects(ActivityPubServer)
        .find((o) => o.url === url)
  }
}