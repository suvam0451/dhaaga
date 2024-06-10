import {Realm} from "@realm/react"
import {UserDataTimeline} from "../entities/userdata-timeline.entity";
import {UpdateMode} from "realm";

class UserDataTimelineRepository {
  static seed(db: Realm) {
    this.upsertHome(db)
    this.upsertLocal(db)
    this.upsertFederated(db)
  }

  private static upsertHome(db: Realm) {
    const match = db.objects(UserDataTimeline).find((o) => o.type === "Home")
    const saveData = JSON.stringify({type: "Home"})

    db.create(UserDataTimeline, {
      _id: match?._id || new Realm.BSON.UUID(),
      type: "Home",
      pinned: match?.pinned || true,
      createdAt: match?.createdAt || new Date(),
      updatedAt: new Date(),
      saveData
    }, UpdateMode.Modified)
  }

  private static upsertLocal(db: Realm) {
    const match = db.objects(UserDataTimeline).find((o) => o.type === "Local")
    const saveData = JSON.stringify({type: "Local"})

    db.create(UserDataTimeline, {
      _id: match?._id || new Realm.BSON.UUID(),
      type: "Local",
      pinned: match?.pinned || true,
      createdAt: match?.createdAt || new Date(),
      updatedAt: new Date(),
      saveData
    }, UpdateMode.Modified)
  }

  private static upsertFederated(db: Realm) {
    const match = db.objects(UserDataTimeline).find((o) => o.type === "Federated")
    const saveData = JSON.stringify({type: "Federated"})

    db.create(UserDataTimeline, {
      _id: match?._id || new Realm.BSON.UUID(),
      type: "Federated",
      pinned: match?.pinned || true,
      createdAt: match?.createdAt || new Date(),
      updatedAt: new Date(),
      saveData
    }, UpdateMode.Modified)
  }
}

export default UserDataTimelineRepository