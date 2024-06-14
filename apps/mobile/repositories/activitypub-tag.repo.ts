import {Realm} from "@realm/react";
import {
  ActivityPubTag,
  ActivityPubTagCreateDTO
} from "../entities/activitypub-tag.entity";
import {mastodon} from "@dhaaga/shared-provider-mastodon/src";

export class ActivityPubTagRepository {
  static cleanAll(db: Realm) {
    db.delete(db.objects(ActivityPubTag))
  }

  static clearFollowing(db: Realm) {
    const all = db.objects(ActivityPubTag)
    all.forEach((o) => {
      o.following = false
    })
  }

  static updateFollowStatus() {

  }

  static applyFollowing(db: Realm, dto: mastodon.v1.Tag[]) {
    const all = db.objects(ActivityPubTag)
    const mapper = new Map<string, ActivityPubTag>
    all.forEach((o) => {
      mapper.set(o.name, o)
    })

    dto.forEach((o) => {
      const match = mapper.get(o.name)
      if (match) {
        match.following = o.following
      } else {
        this.upsert(db, {
          name: o.name,
          following: o.following,
          privatelyFollowing: false
        })
      }
    })
  }

  static upsert(db: Realm, dto: ActivityPubTagCreateDTO) {
    const conflict = this.find(db, dto.name)
    return db.create(ActivityPubTag, {
      _id: conflict?._id || new Realm.BSON.UUID(),
      name: dto.name,
      following: dto.following,
      privatelyFollowing: dto.privatelyFollowing
    })
  }

  static find(db: Realm, name: string) {
    return db.objects(ActivityPubTag).find((o) => o.name === name)
  }
}